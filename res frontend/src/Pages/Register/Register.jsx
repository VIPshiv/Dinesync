// src/pages/Register/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Register = () => {
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
    role: 'customer' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Terms validation
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await axios.post('http://localhost:5000/api/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone.replace(/\D/g, ''), // send only digits
        role: formData.role
      });
      
      setSuccessMessage('Account created successfully! Redirecting to login...');
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Error registering:', err);
      if (err.response?.data?.message) {
        setErrors({ submit: err.response.data.message });
      } else {
        setErrors({ submit: 'Failed to create account. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className="register-page">
      <Navbar />
      
      {/* Parallax Background */}
      <div className="register-parallax-bg"></div>
      
      {/* Main Content */}
      <div className="register-main">
        <div className="register-container">
          
          {/* Left Side - Welcome Content */}
          <div className="register-welcome-section">
            <div className="welcome-content">
              <div className="welcome-badge">Join Our Community</div>
              <h1 className="welcome-title">
                Create Your <span className="title-accent">Account</span>
              </h1>
              <p className="welcome-description">
                Join thousands of food lovers and unlock exclusive benefits, personalized recommendations, and seamless dining experiences.
              </p>
              
              <div className="welcome-features">
                <div className="feature-item">
                  <span className="feature-icon">🎁</span>
                  <span className="feature-text">Welcome bonus & discounts</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚀</span>
                  <span className="feature-text">Priority support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🍽️</span>
                  <span className="feature-text">Exclusive menu previews</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⭐</span>
                  <span className="feature-text">Loyalty rewards program</span>
                </div>
              </div>

              <div className="welcome-cta">
                <p className="cta-text">Already have an account?</p>
                <Link to="/login" className="cta-link">
                  Sign In <span className="link-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="register-form-section">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">Fill in your details to get started</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="success-banner">
                  <span className="success-icon">✓</span>
                  {successMessage}
                </div>
              )}

              {/* Error Banner */}
              {errors.submit && (
                <div className="error-banner">
                  <span className="error-icon">⚠</span>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                {/* Name Fields */}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">First Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        disabled={isSubmitting}
                      />
                      <span className="input-icon">👤</span>
                    </div>
                    {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Last Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        disabled={isSubmitting}
                      />
                      <span className="input-icon">👤</span>
                    </div>
                    {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      disabled={isSubmitting}
                    />
                    <span className="input-icon">✉️</span>
                  </div>
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                {/* Phone Field */}
                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                      placeholder="123-456-7890"
                      disabled={isSubmitting}
                    />
                    <span className="input-icon">📱</span>
                  </div>
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>

                {/* Password Fields */}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a strong password"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <div className="field-error">{errors.password}</div>}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="form-field">
                  <label className="form-label">Account Type</label>
                  <div className="role-selection">
                    <div 
                      className={`role-option ${formData.role === 'customer' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('role', 'customer')}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={formData.role === 'customer'}
                        onChange={() => handleInputChange('role', 'customer')}
                        disabled={isSubmitting}
                      />
                      <div className="role-content">
                        <span className="role-icon">🍽️</span>
                        <div className="role-info">
                          <span className="role-title">Customer</span>
                          <span className="role-description">Order food and enjoy our services</span>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`role-option ${formData.role === 'admin' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('role', 'admin')}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={() => handleInputChange('role', 'admin')}
                        disabled={isSubmitting}
                      />
                      <div className="role-content">
                        <span className="role-icon">👑</span>
                        <div className="role-info">
                          <span className="role-title">Admin</span>
                          <span className="role-description">Manage restaurant operations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="form-options">
                  <label className="checkbox-wrapper" htmlFor="terms">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      disabled={isSubmitting}
                    />
                    <div className="checkbox-custom"></div>
                    I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </label>
                  {errors.terms && <div className="field-error">{errors.terms}</div>}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`register-submit ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-icon">⏳</span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🚀</span>
                      Create Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;