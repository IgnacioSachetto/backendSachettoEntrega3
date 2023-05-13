const ProductManager = require('./productManager')
const express = require('express')
const app = express()

app.get('/products', async (req, res, next) => {
  const limit = req.query.limit;

  try {
    const pm = new ProductManager('productManager.txt');
    const products = await pm.getProducts();

    if (!limit) {
      return res.send(products);
    } else {
      const productsLimited = products.slice(0, limit);
      return res.send(productsLimited);
    }
  } catch (err) {
    next(err);
  }
});


app.get('/products/:pid', async (req, res, next) => {
  const pid = req.params.pid;
  const parsedId = parseInt(pid);

  try {
    const pm = new ProductManager('productManager.txt');
    const product = await pm.getProductById(parsedId);

    if (product) {
      return res.send(product);
    } else {
      return res.status(404).send('Producto no encontrado');
    }
  } catch (err) {
    next(err);
  }
});


app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
