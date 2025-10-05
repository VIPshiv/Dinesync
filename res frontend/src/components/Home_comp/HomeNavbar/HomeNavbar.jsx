// src/components/HomeNavbar/HomeNavbar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import CartDrawer from '../../CartDrawer/CartDrawer';
import '../../CartDrawer/CartDrawer.css';
import './HomeNavbar.css';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [isScrolled, setIsScrolled] = useState(false);
  const { count } = useCart();
  const [showCart, setShowCart] = useState(false);
  const closingRef = useRef(false); // prevent instant reopen after close

  const closeCart = useCallback(() => {
    if (!showCart) return;
    closingRef.current = true;
    setShowCart(false);
    // allow reopen after brief cooldown
    setTimeout(() => { closingRef.current = false; }, 250);
  }, [showCart]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const openCartHandler = () => {
      if (closingRef.current) return; // ignore stray events right after closing
      setShowCart(true);
    };
    const externalCloseHandler = () => closeCart();
    const handleKey = (e) => {
      if (e.key === 'Escape') closeCart();
    };
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
    <nav className={`home-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="home-navbar-container">
        <Link to="/" className="home-navbar-brand">DineSync</Link>
        <div className="home-navbar-links">
          <Link to="/" className="home-navbar-link">Home</Link>
          <Link to="/menu" className="home-navbar-link">Menu</Link>
          <Link to="/contact" className="home-navbar-link">Contact</Link>
          <Link to="/order-status" className="home-navbar-link">Order Status</Link>
          {role === 'admin' && (
            <Link to="/admin" className="home-navbar-link">Admin Dashboard</Link>
          )}
          <button type="button" className="home-navbar-link cart-btn" onClick={() => setShowCart(true)}>
            Cart{count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          {token ? (
            <button onClick={handleLogout} className="home-navbar-link logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="home-navbar-link">Login</Link>
              <Link to="/register" className="home-navbar-link">Register</Link>
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

export default HomeNavbar;