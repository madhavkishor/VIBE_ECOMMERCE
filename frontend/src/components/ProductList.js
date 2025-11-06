import React from 'react';

const ProductList = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-cart-icon">📦</div>
        <p>No products available at the moment.</p>
        <p>Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            {product.image && product.image.startsWith('http') ? (
              <img 
                src={product.image} 
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="product-image-placeholder" style={{ 
              display: product.image && product.image.startsWith('http') ? 'none' : 'flex'
            }}>
              📦
            </div>
          </div>
          
          <div className="product-info">
            <h3>{product.name}</h3>
            <span className="product-category">{product.category}</span>
            <p className="product-description">{product.description}</p>
            
            <div className="product-footer">
              <div className="product-price">${product.price}</div>
              <button 
                onClick={() => onAddToCart(product.id)}
                className="add-to-cart-btn"
              >
                <span>🛒</span>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;