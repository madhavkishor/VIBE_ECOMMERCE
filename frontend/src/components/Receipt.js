import React from 'react';

const Receipt = ({ receipt, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal receipt">
        <div className="receipt-header">
          <h2>🎉 Order Confirmed!</h2>
          <p>Thank you for your purchase!</p>
        </div>

        <div className="receipt-details">
          <div className="receipt-item">
            <span>Order ID:</span>
            <strong>{receipt.orderId}</strong>
          </div>

          <div className="receipt-item">
            <span>Customer:</span>
            <span>{receipt.customer.name}</span>
          </div>

          <div className="receipt-item">
            <span>Email:</span>
            <span>{receipt.customer.email}</span>
          </div>

          <div className="receipt-item">
            <span>Order Date:</span>
            <span>{new Date(receipt.timestamp).toLocaleDateString()}</span>
          </div>

          <div className="receipt-item">
            <span>Order Time:</span>
            <span>{new Date(receipt.timestamp).toLocaleTimeString()}</span>
          </div>

          <h4 style={{ margin: '1.5rem 0 1rem 0' }}>Items:</h4>
          {receipt.items.map(item => (
            <div key={item.productId} className="receipt-item">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="receipt-item">
            <span>Subtotal:</span>
            <span>${receipt.subtotal}</span>
          </div>

          <div className="receipt-item">
            <span>Tax:</span>
            <span>${receipt.tax}</span>
          </div>

          <div className="receipt-total">
            <span>Grand Total:</span>
            <span>${receipt.grandTotal}</span>
          </div>
        </div>

        <div className="receipt-footer">
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>
            A confirmation email has been sent to {receipt.customer.email}
          </p>
          <button onClick={onClose} className="checkout-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
