import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity, onCheckout }) => {
  const { items, total, itemCount } = cart;

  if (!items || items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <span className="cart-icon-small">🛒</span>
          <h2>Your Shopping Cart</h2>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">📦</div>
          <p>Your cart is empty</p>
          <p>Add some amazing products to get started!</p>
          <Link to="/" className="back-to-shopping">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = parseFloat(total);
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <span className="cart-icon-small">🛒</span>
        <h2>Your Shopping Cart ({itemCount} items)</h2>
      </div>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.productId} className="cart-item">
            <div className="item-image">
              {item.image && item.image.startsWith('http') ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="product-image-placeholder" style={{ 
                display: item.image && item.image.startsWith('http') ? 'none' : 'flex',
                width: '100%', 
                height: '100%', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                📦
              </div>
            </div>
            
            <div className="item-details">
              <h4>{item.name}</h4>
              <p className="item-price">${item.price} each</p>
              
              <div className="quantity-controls">
                <button 
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              onClick={() => onRemoveFromCart(item.productId)}
              className="remove-btn"
              title="Remove item"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total-section">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="total-line">
          <span>Tax (8%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="total-amount">
          <span>Total:</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={onCheckout}
          className="checkout-btn"
        >
          <span>🚀</span>
          Proceed to Checkout
        </button>
        
        <Link to="/" className="back-to-shopping" style={{ 
          display: 'block', 
          textAlign: 'center', 
          marginTop: '1rem',
          textDecoration: 'none'
        }}>
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;