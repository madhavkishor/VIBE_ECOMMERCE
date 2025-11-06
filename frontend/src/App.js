import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Receipt from './components/Receipt';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: '0.00', itemCount: 0 });
  const [sessionId, setSessionId] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize session ID
  useEffect(() => {
    const savedSessionId = localStorage.getItem('vibeSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      localStorage.setItem('vibeSessionId', newSessionId);
    }
  }, []);

  // Fetch products and cart on component mount
  useEffect(() => {
    if (sessionId) {
      fetchProducts();
      fetchCart();
    }
  }, [sessionId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cart?sessionId=${sessionId}`);
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(`${API_BASE}/cart`, {
        productId,
        quantity: 1,
        sessionId
      });
      setCart(response.data.cart);
      setError('');
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE}/cart/${productId}`, {
        data: { sessionId }
      });
      setCart(response.data.cart);
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(`${API_BASE}/cart/${productId}`, {
        quantity,
        sessionId
      });
      setCart(response.data.cart);
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckout = async (customerData) => {
    try {
      const response = await axios.post(`${API_BASE}/checkout`, {
        sessionId,
        customer: customerData
      });
      setReceipt(response.data);
      setShowCheckout(false);
      setCart({ items: [], total: '0.00', itemCount: 0 });
      setError('');
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error('Error during checkout:', err);
    }
  };

  const clearError = () => setError('');

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Vibe Commerce...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Modern Header */}
        <header className="app-header">
          <div className="header-content">
            <Link to="/" className="brand">
              <div className="brand-icon">🛍️</div>
              <div className="brand-text">
                <h1>Vibe Commerce</h1>
                <p>Your favorite shopping destination</p>
              </div>
            </Link>
            
            <Link to="/cart" className="cart-summary">
              <div className="cart-icon">
                🛒
                {cart.itemCount > 0 && (
                  <span className="cart-badge">{cart.itemCount}</span>
                )}
              </div>
              <div className="cart-info">
                <div className="cart-count">{cart.itemCount} items</div>
                <div className="cart-total">${cart.total}</div>
              </div>
            </Link>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={clearError} className="close-error">×</button>
          </div>
        )}

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={
                <div className="products-page">
                  <div className="section-header">
                    <h2>
                      Featured Products
                      <span className="product-count">{products.length}</span>
                    </h2>
                  </div>
                  <ProductList 
                    products={products} 
                    onAddToCart={addToCart} 
                  />
                </div>
              } />
              
              <Route path="/cart" element={
                <Cart 
                  cart={cart}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  onCheckout={() => setShowCheckout(true)}
                />
              } />
            </Routes>
          </div>
        </main>

        {showCheckout && (
          <Checkout
            onClose={() => setShowCheckout(false)}
            onSubmit={handleCheckout}
            cart={cart}
          />
        )}

        {receipt && (
          <Receipt
            receipt={receipt}
            onClose={() => setReceipt(null)}
          />
        )}

        <footer className="app-footer">
          <p>&copy; 2024 Vibe Commerce. Built with modern design principles.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;