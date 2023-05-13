const fs = require("fs");





class ProductManager {
    constructor(filePath) {
        this.products = [];
        /*A1- La clase debe contar con una variable this.path,
        el cual se inicializará desde el constructor
        y debe recibir la ruta a trabajar desde
        el momento de generar su instancia.*/
        this.path = filePath;
    }

    #idGenerator() {
        let maxID = 0;
        for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];
            if (product.id > maxID) {
                maxID = product.id;
            }
        }
        return ++maxID;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
                console.error("The product's code already exists");
                return;
            }
        }
        /* A2 - Debe guardar objetos con el siguiente formato:
           id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
           title (nombre del producto)
           description (descripción del producto)
           price (precio)
           thumbnail (ruta de imagen)
           code (código identificador)
           stock (número de piezas disponibles)*/
        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.#idGenerator(),
        };

        this.products.push(newProduct);

        /*A3 - Debe tener un método addProduct el cual debe recibir un objeto con el
      formato previamente especificado, asignarle un id autoincrementable
      y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).*/

        fs.writeFile(this.path, JSON.stringify(this.products), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Product Added Successfully");
            }
        });

    }

    /* A5 - Debe tener un método getProductById,
    el cual debe recibir un id, y tras leer el archivo,
    debe buscar el producto con el id especificado
     y devolverlo en formato objeto */

    async getProductById(id) {
        try {
            const productsObtained = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsObtained);

            for (let i = 0; i < products.length; i++) {
                if (products[i].id === id) {
                    return products[i];
                }
            }
        } catch (err) {
            console.error("Error al leer el archivo de productos", err);
        }
    }

    /* A4 - Debe tener un método getProducts, el cual debe leer
     el archivo de productos
      y devolver todos los productos en formato de arreglo.*/

      async getProducts() {
        try {
          const productsObtained = await fs.promises.readFile(this.path, "utf-8");
          this.products = JSON.parse(productsObtained);
          return this.products;
        } catch (err) {
          /* Se agrega estas lineas para evitar excepciones
          al realizar la primer iteración sobre los productos
          ya que el .txt se encontrará vacio en ese momento.*/
          if (err.code === "ENOENT" || err.message === "Unexpected end of JSON input" || err.message === "Unexpected end of input") {
            console.error("Archivo VACIO", err);
            return [];
          } else {
            console.error("Error al leer archivo", err);
            return [];
          }
        }
      }

    /* A6 - Debe tener un método updateProduct,
    el cual debe recibir el id del producto a actualizar,
    así también como el campo a actualizar
    (puede ser el objeto completo, como en una DB),
     y debe actualizar el producto que tenga ese id en el archivo.
     NO DEBE BORRARSE SU ID */

    async updateProduct(id, updatedFields) {
        try {
            const productsObtained = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(productsObtained);

            for (let i = 0; i < products.length; i++) {
                if (products[i].id === id) {
                    products[i] = { ...products[i], ...updatedFields };
                    await fs.promises.writeFile(this.path, JSON.stringify(products));
                    console.log("Product Updated")
                    return products[i];
                }
            }

        } catch (err) {
            console.error('Error al actualizar el producto', err);
        }
    }
    /* A7 - Debe tener un método deleteProduct,
    el cual debe recibir un id
     y debe eliminar el producto que tenga ese id en el archivo.*/

    async deleteProduct(id) {
        try {
            const productsObtained = await fs.promises.readFile(this.path, "utf-8");
            let products = JSON.parse(productsObtained);

            /* Verificaciones para encontrar el producto*/

            let prueba = -1;
            for (let i = 0; i < products.length; i++) {
                if (products[i].id === id) {
                    prueba = i;
                    break;
                }
            }

            if (prueba !== -1) {
                products.splice(prueba, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                console.log(`Product with id ${id} has been deleted`);
                console.log(products);
            } else {
                console.log(`Product with id ${id} not found`);
            }
        } catch (err) {
            console.error("Error al leer o escribir el archivo de productos", err);
        }
    }


}
//Testing de Entregables
/* Utilicé async/await debido al uso de promesas

const newProduct = new ProductManager('C:/Users/Admin/Desktop/Programacion Backend/EntregableN3ServidoresconExpress/productManager.txt');

async function pruebasTesteo() {
    const products = await newProduct.getProducts(); // P1 - Se creará una instancia de la clase “ProductManager”
    console.log(products); // P2 - Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

    // P3 - Se llamará al método “addProduct” con los campos: title: “producto prueba” description:”Este es un producto prueba” price:200, thumbnail:”Sin imagen” code:”abc123”, stock:25

    await newProduct.addProduct(
        "producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        "abc123",
        25
    );

    // P4 - El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
    // P5 - Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

    const productsUpdated = await newProduct.getProducts();
    console.log("Once product was added:", productsUpdated); // Se agrega el producto y se muestra por productsUpdated

    // P6 - Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado

    const productFound = await newProduct.getProductById(1);
    if (productFound) {
        console.log("Found by ID:", productFound); // Si hay match
    } else {
        console.log("Not Found"); // Si no hay match
    }

    // P6 - en caso de no existir, debe arrojar un error. (Se podría solamente cambiar el ID en el codigo de arriba y evitar redundancia, lo dejo solo por cuestiones de comodidades al testear)
    const productNotFound = await newProduct.getProductById(99);
    if (productNotFound) {
        console.log("Found by ID", productNotFound);
    } else {
        console.log("Not Found");
    }

    // P7 - Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

    await newProduct.updateProduct(1, { price: 250 }); // Se intenta cambiar el campo price de 200 a 250.

    // P8 - Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.

    await newProduct.deleteProduct(2); // Debería arrojar error
    await newProduct.deleteProduct(1); // Deberia eliminar el producto

}

pruebasTesteo(); // Ejecuto el metodo de las pruebas de testeo
*/


const newProduct = new ProductManager('C:/Users/Admin/Desktop/Programacion Backend/EntregableN3ServidoresconExpress/productManager.txt');

async function creacionProductos() {
    await newProduct.addProduct(
        "Producto 1",
        "Descripción del producto 1",
        100,
        "imagen1.jpg",
        "code1",
        10
      );

      await newProduct.addProduct(
        "Producto 2",
        "Descripción del producto 2",
        150,
        "imagen2.jpg",
        "code2",
        15
      );

      await newProduct.addProduct(
        "Producto 3",
        "Descripción del producto 3",
        80,
        "imagen3.jpg",
        "code3",
        8
      );

      await newProduct.addProduct(
        "Producto 4",
        "Descripción del producto 4",
        120,
        "imagen4.jpg",
        "code4",
        20
      );

      await newProduct.addProduct(
        "Producto 5",
        "Descripción del producto 5",
        200,
        "imagen5.jpg",
        "code5",
        12
      );

      await newProduct.addProduct(
        "Producto 6",
        "Descripción del producto 6",
        90,
        "imagen6.jpg",
        "code6",
        5
      );

      await newProduct.addProduct(
        "Producto 7",
        "Descripción del producto 7",
        180,
        "imagen7.jpg",
        "code7",
        18
      );

      await newProduct.addProduct(
        "Producto 8",
        "Descripción del producto 8",
        70,
        "imagen8.jpg",
        "code8",
        14
      );

      await newProduct.addProduct(
        "Producto 9",
        "Descripción del producto 9",
        10,
        "imagen9.jpg",
        "code9",
        18
      );

      await newProduct.addProduct(
        "Producto 10",
        "Descripción del producto 10",
        11,
        "imagen10.jpg",
        "code10",
        11
      );


}

creacionProductos();

module.exports = ProductManager