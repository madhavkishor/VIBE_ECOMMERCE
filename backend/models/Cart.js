class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    this.calculateTotal();
    return this.items;
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== parseInt(productId));
    this.calculateTotal();
    return this.items;
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.productId === parseInt(productId));
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.calculateTotal();
      }
    }
    return this.items;
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return this.total;
  }

  clear() {
    this.items = [];
    this.total = 0;
  }

  getCart() {
    return {
      items: this.items,
      total: this.total.toFixed(2),
      itemCount: this.items.reduce((count, item) => count + item.quantity, 0)
    };
  }
}

module.exports = Cart;
