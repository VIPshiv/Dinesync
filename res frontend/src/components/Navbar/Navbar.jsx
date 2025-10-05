// src/components/Navbar/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../CartDrawer/CartDrawer';
import '../CartDrawer/CartDrawer.css';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [isScrolled, setIsScrolled] = useState(false);
  const { count } = useCart();
  const [showCart, setShowCart] = useState(false);
  const closingRef = useRef(false);

  const closeCart = useCallback(() => {
    if (!showCart) return;
    closingRef.current = true;
    setShowCart(false);
    setTimeout(() => { closingRef.current = false; }, 250);
  }, [showCart]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
  const openCartHandler = () => {
    if (closingRef.current) return;
    setShowCart(true);
  };
  const externalCloseHandler = () => closeCart();
  const handleKey = (e) => { if (e.key === 'Escape') closeCart(); };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('open-cart', openCartHandler);
    window.addEventListener('close-cart', externalCloseHandler);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-cart', openCartHandler);
      window.removeEventListener('close-cart', externalCloseHandler);
      window.removeEventListener('keydown', handleKey);
    };
  }, [closeCart]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">DineSync</Link>
  <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/menu" className="navbar-link">Menu</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
          <Link to="/order-status" className="navbar-link">Order Status</Link>
          {role === 'admin' && (
            <Link to="/admin" className="navbar-link">Admin Dashboard</Link>
          )}
          <button className="navbar-link cart-btn" type="button" onClick={() => setShowCart(true)}>
            Cart{count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          {token ? (
            <button onClick={handleLogout} className="navbar-link logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
        {showCart && (
          <div className="cart-overlay" onClick={closeCart} data-cart-overlay>
            <div className="cart-drawer" onClick={e => e.stopPropagation()} data-cart-drawer>
              <CartDrawer onClose={closeCart} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;