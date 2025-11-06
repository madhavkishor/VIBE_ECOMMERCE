const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const carts = new Map();

// Helper function to get or create cart
const getCart = (sessionId) => {
  if (!carts.has(sessionId)) {
    carts.set(sessionId, new Cart());
  }
  return carts.get(sessionId);
};

// Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  try {
    const { productId, quantity = 1, sessionId = uuidv4() } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const cart = getCart(sessionId);
    cart.addItem(product, quantity);

    res.json({
      message: 'Item added to cart',
      cart: cart.getCart(),
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const cart = getCart(sessionId);
    cart.removeItem(id);

    res.json({
      message: 'Item removed from cart',
      cart: cart.getCart()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// PUT /api/cart/:id - Update item quantity
app.put('/api/cart/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = getCart(sessionId);
    cart.updateQuantity(id, quantity);

    res.json({
      message: 'Cart updated',
      cart: cart.getCart()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// GET /api/cart - Get cart contents
app.get('/api/cart', (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.json({ items: [], total: '0.00', itemCount: 0 });
    }

    const cart = getCart(sessionId);
    res.json(cart.getCart());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
  try {
    const { sessionId, customer } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const cart = getCart(sessionId);
    const cartData = cart.getCart();

    if (cartData.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Generate receipt
    const receipt = {
      orderId: uuidv4().substr(0, 8).toUpperCase(),
      customer: {
        name: customer?.name || 'Guest',
        email: customer?.email || 'No email provided'
      },
      items: cartData.items,
      subtotal: cartData.total,
      tax: (parseFloat(cartData.total) * 0.08).toFixed(2),
      total: (parseFloat(cartData.total) * 1.08).toFixed(2),
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    };

    receipt.grandTotal = (parseFloat(receipt.subtotal) + parseFloat(receipt.tax)).toFixed(2);

    // Clear cart after successful checkout
    cart.clear();

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
});
