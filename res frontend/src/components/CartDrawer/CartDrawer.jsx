import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer({ onClose }) {
  // Removed lastAddedName toast; now show compact inline list of all items instead
  const { items, total, clearCart, removeItem, addItem, decrementItem } = useCart();
  const navigate = useNavigate();
  const subtotal = total; // future: taxes/shipping
  const tax = +(subtotal * 0.07).toFixed(2); // simple sample
  const grandTotal = +(subtotal + tax).toFixed(2);

  // Checkout local UI state
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // { success, message, order }

  const canCheckout = items.length > 0 && !placing;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!customerName.trim() || !email.trim()) {
      setOrderResult({ success: false, message: 'Name and email required' });
      return;
    }
    // basic email shape check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setOrderResult({ success: false, message: 'Invalid email format' });
      return;
    }
    if (!items.length) {
      setOrderResult({ success: false, message: 'Cart is empty' });
      return;
    }
    setPlacing(true);
    setOrderResult(null);
    try {
      const payload = {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        deliveryAddress: address.trim() || undefined,
        items: items.map(it => ({
          name: it.name,
            // ensure price is numeric for backend normalization
          price: Number(it.price),
          quantity: Number(it.quantity)
        }))
      };
      console.log('[checkout] placing order payload:', payload);
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      console.log('[checkout] response status', res.status, 'data:', data);
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to place order');
      }
      setOrderResult({ success: true, message: 'Order placed!', order: data.order });
      clearCart();
      // Optionally collapse form after success
    } catch (err) {
      setOrderResult({ success: false, message: err.message || 'Order failed' });
    } finally {
      setPlacing(false);
    }
  }

  function startCheckout() {
    const token = localStorage.getItem('token');
    if(!token){
      // Close cart before navigating to register
      try { onClose && onClose(); } catch { /* ignore */ }
      window.dispatchEvent(new CustomEvent('close-cart'));
      navigate('/register');
      return;
    }
    setShowCheckout(s => !s);
    setOrderResult(null);
  }

  return (
    <div className="cart-drawer-content">
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button
          className="close-btn"
          onClick={() => {
            try { onClose && onClose(); } catch { /* ignore */ }
            // Also broadcast a close-cart event so any listening navbar can sync state
            window.dispatchEvent(new CustomEvent('close-cart'));
          }}
        >×</button>
      </div>
      {items.length === 0 && <div className="empty">Cart is empty</div>}
      {items.length > 0 && (
        <div className="cart-inline-list" aria-label="Items in cart">
          {items.map(it => (
            <span key={it.id} className="cart-inline-chip">
              <span className="chip-label">
                {it.name}
                {it.quantity > 1 && <span className="chip-qty">x{it.quantity}</span>}
              </span>
              <button
                type="button"
                className="chip-remove"
                aria-label={`Remove ${it.name}`}
                onClick={() => removeItem(it.id)}
              >×</button>
            </span>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <ul className="cart-items">
          {items.map(it => {
            const unit = Number(it.price) || 0;
            const line = unit * it.quantity;
            return (
              <li key={it.id} className="cart-item">
                <div className="cart-item-info">
                  {it.image && <img src={it.image} alt={it.name} />}
                  <div>
                    <div className="cart-item-name-row">
                      <span className="cart-item-name">{it.name || 'Item'} {it.quantity > 1 && (<span className="qty-inline-badge">x{it.quantity}</span>)}</span>
                      <span className="cart-unit-price">${unit.toFixed(2)}</span>
                    </div>
                    <div className="cart-line-controls">
                      <div className="qty-row mini">
                        <button className="qty-btn" onClick={() => decrementItem(it.id)}>-</button>
                        <span className="qty-val">{it.quantity}</span>
                        <button className="qty-btn" onClick={() => addItem(it)}>+</button>
                      </div>
                      <div className="cart-line-price">${line.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(it.id)}>Remove</button>
              </li>
            );
          })}
        </ul>
      )}
      {/* Debug fallback if somehow items not rendering */}
      {items.length > 0 && (
        <div style={{display:'none'}} aria-hidden="true" data-cart-debug>{JSON.stringify(items)}</div>
      )}
      <div className="cart-summary-block">
        <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="summary-row"><span>Tax (7%)</span><span>${tax.toFixed(2)}</span></div>
        <div className="summary-row total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
      </div>
      <div className="cart-footer">
        <div className="cart-actions">
          <button className="clear-btn" disabled={!items.length} onClick={clearCart}>Clear</button>
          <button className="checkout-btn" disabled={!items.length} onClick={startCheckout}>{showCheckout ? 'Close' : 'Checkout'}</button>
        </div>
        {showCheckout && (
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="cf-row">
              <input
                className="cf-input"
                placeholder="Name*"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                disabled={placing}
                required
              />
            </div>
            <div className="cf-row">
              <input
                className="cf-input"
                type="email"
                placeholder="Email*"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={placing}
                required
              />
            </div>
            <div className="cf-row two">
              <input
                className="cf-input"
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={placing}
              />
              <input
                className="cf-input"
                placeholder="Address (optional)"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={placing}
              />
            </div>
            <button className="place-order-btn" disabled={!canCheckout}>{placing ? 'Placing...' : 'Place Order'}</button>
            {orderResult && (
              <div className={`cf-status ${orderResult.success ? 'ok' : 'err'}`}>
                {orderResult.success && orderResult.order ? (
                  <>
                    <strong>{orderResult.message}</strong> ID: {orderResult.order.id}
                  </>
                ) : (
                  orderResult.message
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
