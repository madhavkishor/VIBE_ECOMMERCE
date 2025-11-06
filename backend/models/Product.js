const products = require('../data/products.json');

class Product {
  static findAll() {
    return products;
  }

  static findById(id) {
    return products.find(product => product.id === parseInt(id));
  }
}

module.exports = Product;
