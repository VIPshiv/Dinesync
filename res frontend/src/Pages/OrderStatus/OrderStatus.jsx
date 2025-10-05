// src/pages/OrderStatus/OrderStatus.jsx
import { useState } from 'react';
import './OrderStatus.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const OrderStatus = () => {
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Mock order statuses for demonstration
  const orderStatuses = [
    { id: 1, status: 'Order Received', completed: true, time: '2:30 PM', description: 'Your order has been received and is being prepared.' },
    { id: 2, status: 'Preparing', completed: true, time: '2:45 PM', description: 'Our chefs are preparing your delicious meal.' },
    { id: 3, status: 'Ready for Pickup', completed: false, time: '', description: 'Your order will be ready for pickup soon.' },
    { id: 4, status: 'Out for Delivery', completed: false, time: '', description: 'Your order is on its way to you.' },
    { id: 5, status: 'Delivered', completed: false, time: '', description: 'Enjoy your meal!' }
  ];

  const mockOrders = [
    {
      id: 'ORD001',
      email: 'john@example.com',
      customerName: 'John Doe',
      orderDate: '2025-08-02T14:30:00Z',
      status: 'preparing',
      currentStep: 2,
      estimatedTime: '15-20 minutes',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
        { name: 'Caesar Salad', quantity: 1, price: 12.99 },
        { name: 'Garlic Bread', quantity: 2, price: 8.99 }
      ],
      total: 40.97,
      deliveryAddress: '123 Main St, City, State 12345',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 'ORD002',
      email: 'jane@example.com',
      customerName: 'Jane Smith',
      orderDate: '2025-08-02T13:15:00Z',
      status: 'ready',
      currentStep: 3,
      estimatedTime: 'Ready now',
      items: [
        { name: 'Pasta Carbonara', quantity: 1, price: 16.99 },
        { name: 'Tiramisu', quantity: 1, price: 7.99 }
      ],
      total: 24.98,
      deliveryAddress: '456 Oak Ave, City, State 12345',
      phone: '+1 (555) 987-6543'
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchAttempted(true);

    try {
      const resp = await fetch(`http://localhost:5000/api/orders/track/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`);
      if (resp.status === 404) {
        setOrderData(null);
        setError('Order not found. Please check your Order ID and email address.');
      } else if (!resp.ok) {
        const errData = await resp.json().catch(()=>({}));
        throw new Error(errData.error || errData.message || 'Failed to fetch order');
      } else {
        const data = await resp.json();
        // Backend returns { order: { id, status, currentStep, estimatedTime, items, total, customerName, phone, deliveryAddress, createdAt } }
        const o = data.order;
        // Map to UI model: ensure orderDate field exists
        const normalized = {
          id: o.id,
          email: email,
          customerName: o.customerName,
          orderDate: o.createdAt || new Date().toISOString(),
          status: (o.status || 'Received').toLowerCase(),
          currentStep: o.currentStep || 1,
          estimatedTime: o.estimatedTime || '—',
          items: o.items || [],
          total: o.total || 0,
          deliveryAddress: o.deliveryAddress || '',
          phone: o.phone || ''
        };
        setOrderData(normalized);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order. Please try again.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStep) => {
    return orderStatuses.map((status, index) => ({
      ...status,
      completed: index < currentStep,
      current: index === currentStep - 1
    }));
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="order-status-page">
      <Navbar />
      
      {/* Parallax Background */}
      <div className="order-status-parallax-bg"></div>
      
      {/* Hero Section */}
      <section className="order-status-hero">
        <div className="hero-content">
          <h1 className="hero-title">Track Your Order</h1>
          <p className="hero-subtitle">
            Stay updated on your delicious meal's journey from our kitchen to your table
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="order-status-main">
        <div className="status-container">
          
          {/* Search Form */}
          <div className="order-search-section">
            <div className="search-header">
              <h2 className="search-title">Find Your Order</h2>
              <p className="search-subtitle">
                Enter your Order ID and email address to track your order status
              </p>
            </div>

            <form onSubmit={handleSearch} className="order-search-form">
              <div className="search-form-grid">
                <div className="form-field">
                  <label className="form-label">Order ID</label>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="e.g., ORD001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="search-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`search-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔍</span>
                    Track Order
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="order-details-section">
              {/* Order Header */}
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-number">Order #{orderData.id}</h3>
                  <div className="order-meta">
                    <span className="order-date">{formatDate(orderData.orderDate)}</span>
                    <span className="order-time">{formatTime(orderData.orderDate)}</span>
                  </div>
                </div>
                <div className="order-status-badge">
                  <span className={`status-indicator ${orderData.status}`}></span>
                  {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="progress-tracker">
                <h4 className="tracker-title">Order Progress</h4>
                <div className="progress-steps">
                  {getStatusSteps(orderData.currentStep).map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`progress-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                    >
                      <div className="step-indicator">
                        <div className="step-circle">
                          {step.completed ? '✓' : step.current ? step.id : step.id}
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={`step-line ${step.completed ? 'completed' : ''}`}></div>
                        )}
                      </div>
                      <div className="step-content">
                        <div className="step-title">{step.status}</div>
                        <div className="step-description">{step.description}</div>
                        {step.time && <div className="step-time">{step.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="estimated-time">
                <div className="time-icon">⏱️</div>
                <div className="time-content">
                  <span className="time-label">Estimated Time:</span>
                  <span className="time-value">{orderData.estimatedTime}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                <h4 className="items-title">Order Items</h4>
                <div className="items-list">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </div>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">${orderData.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="customer-info">
                <div className="info-grid">
                  <div className="info-card">
                    <h5 className="info-title">Customer</h5>
                    <p className="info-text">{orderData.customerName}</p>
                    <p className="info-text">{orderData.phone}</p>
                  </div>
                  <div className="info-card">
                    <h5 className="info-title">Delivery Address</h5>
                    <p className="info-text">{orderData.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="order-actions">
                <button className="action-btn primary">
                  <span className="btn-icon">📞</span>
                  Contact Restaurant
                </button>
                <button className="action-btn secondary">
                  <span className="btn-icon">🔄</span>
                  Refresh Status
                </button>
              </div>
            </div>
          )}

          {/* No Order Found State */}
          {searchAttempted && !orderData && !loading && !error && (
            <div className="no-order-found">
              <div className="no-order-icon">🔍</div>
              <h3 className="no-order-title">No Order Found</h3>
              <p className="no-order-text">
                We couldn't find an order with those details. Please check your Order ID and email address.
              </p>
            </div>
          )}

          {/* Demo Orders */}
          <div className="demo-section">
            <h3 className="demo-title">Try Demo Orders</h3>
            <p className="demo-subtitle">Use these sample orders to test the tracking system:</p>
            <div className="demo-orders">
              {mockOrders.map(order => (
                <div key={order.id} className="demo-order">
                  <div className="demo-info">
                    <strong>Order ID:</strong> {order.id}<br/>
                    <strong>Email:</strong> {order.email}
                  </div>
                  <button 
                    className="demo-btn"
                    onClick={() => {
                      setOrderId(order.id);
                      setEmail(order.email);
                    }}
                  >
                    Use This Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderStatus;