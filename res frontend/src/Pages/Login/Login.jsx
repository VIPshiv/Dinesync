// src/pages/Login/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Login.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // (Legacy) Demo credentials removed – now using backend

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = { email: formData.email, password: formData.password };
      // Call backend
      const response = await axios.post('http://localhost:5000/api/login', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Extract token & role
      const { token, role: userRole, message } = response.data;
      if (!token || !userRole) {
        setErrors({ general: 'Unexpected server response.' });
        return;
      }

      login(token, userRole);

      // Optional rememberMe handling (basic): if not remember, store token in session only
      if (!rememberMe) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', userRole);
        // Remove from localStorage if present
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }

      alert(message || 'Login successful');
      navigate(userRole === 'admin' ? '/admin' : '/');
    } catch (err) {
      console.error('Error logging in:', err);
      const backend = err.response?.data;
      if (backend?.error) {
        setErrors({ general: backend.error });
      } else if (backend?.details) {
        setErrors({ general: backend.details });
      } else {
        setErrors({ general: 'Login failed. Check credentials or server.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };


  return (
    <div className="login-page">
      <Navbar />
      
      {/* Parallax Background */}
      <div className="login-parallax-bg"></div>
      
      {/* Main Content */}
      <div className="login-main">
        <div className="login-container">
          
          {/* Left Side - Welcome Content */}
          <div className="login-welcome-section">
            <div className="welcome-content">
              <div className="welcome-badge">Welcome Back</div>
              <h1 className="welcome-title">
                Sign In to Your <span className="title-accent">Account</span>
              </h1>
              <p className="welcome-description">
                Access your account to track orders, save favorites, and enjoy personalized dining experiences.
              </p>
              
              <div className="welcome-features">
                <div className="feature-item">
                  <span className="feature-icon">🍽️</span>
                  <span className="feature-text">Track your orders</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">❤️</span>
                  <span className="feature-text">Save favorite dishes</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span className="feature-text">Personalized recommendations</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">Faster checkout</span>
                </div>
              </div>

              <div className="welcome-cta">
                <p className="cta-text">Don't have an account?</p>
                <Link to="/register" className="cta-link">
                  Create Account
                  <span className="link-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">Login</h2>
                <p className="form-subtitle">Welcome back! Please enter your details.</p>
              </div>

              {errors.general && (
                <div className="error-banner">
                  <span className="error-icon">⚠</span>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isSubmitting}
                    />
                    <span className="input-icon">📧</span>
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-field">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className={`login-submit ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🔐</span>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Demo credentials removed since backend auth is active */}

              {/* Social Login Options */}
              <div className="social-login">
                <div className="divider">
                  <span className="divider-text">Or continue with</span>
                </div>
                
                <div className="social-buttons">
                  <button className="social-btn google" disabled>
                    <span className="social-icon">G</span>
                    Google
                  </button>
                  <button className="social-btn facebook" disabled>
                    <span className="social-icon">f</span>
                    Facebook
                  </button>
                </div>
                <p className="social-note">Social login coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;