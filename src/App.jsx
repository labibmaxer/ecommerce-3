import './index.css';
import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS, DEMO_USERS, SHIPPING, TAX_RATE } from './mockdata';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Filter products by search and category
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Management
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= SHIPPING.freeThreshold || subtotal === 0 ? 0 : SHIPPING.flatRate;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingFee + tax;
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app">
      {/* Top Header */}
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <span>Fable</span>
            <span className="logo-tagline">Spend Less. Imagine More.</span>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search books, gadgets, home goods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="nav-actions">
            <button
              className="nav-btn"
              onClick={() =>
                setCurrentUser(currentUser ? null : DEMO_USERS[0])
              }
            >
              {currentUser ? `Hi, ${currentUser.firstName}` : 'Sign In'}
            </button>
            <button className="nav-btn" onClick={() => setIsCartOpen(true)}>
              <span>Cart</span>
              <span className="cart-badge">{totalItemCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="categories-bar">
        <div className="container categories-inner">
          <button
            className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container main-content">
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
                loading="lazy"
              />
              <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-rating">
                  ★ {product.rating} ({product.reviewCount})
                </div>
                <div className="product-footer">
                  <div>
                    <span className="price">${product.price.toFixed(2)}</span>
                    {product.listPrice > product.price && (
                      <span className="list-price">${product.listPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer & Overlay */}
      {isCartOpen && (
        <>
          <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <h2 className="font-serif">Your Cart ({totalItemCount})</h2>
              <button className="nav-btn" style={{ color: '#000' }} onClick={() => setIsCartOpen(false)}>
                ✕
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p style={{ textTransform: 'none', color: 'var(--color-text-muted)', marginTop: '2rem' }}>
                  Your cart is empty.
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} />
                    <div style={{ flex: 1 }}>
                      <div className="font-serif" style={{ fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div className="price">${item.price.toFixed(2)}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className="font-mono">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'red', background: 'none' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="price">${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Shipping</span>
                  <span className="price">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span className="price">${tax.toFixed(2)}</span>
                </div>
                <hr style={{ margin: '0.5rem 0', borderColor: 'var(--color-border)' }} />
                <div className="summary-row" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span className="price">${total.toFixed(2)}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}