// src/pages/Contact/Contact.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Contact.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', subject: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.message.length > 500) {
      setErrorMessage('Message cannot exceed 500 characters.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Map emoji prefixed select labels to backend enum values
    const subjectMap = {
      reservation: 'reservation',
      feedback: 'feedback',
      catering: 'catering',
      events: 'events',
      general: 'general',
      complaint: 'complaint'
    };
    const normalizedSubject = subjectMap[formData.subject] || 'general';

    try {
      const payload = { name: formData.name, email: formData.email, subject: normalizedSubject, message: formData.message };
      const res = await axios.post('http://localhost:5000/api/contact', payload);
      setSuccessMessage(res.data?.message || 'Message sent successfully.');
      setFormData({ name: '', email: '', message: '', subject: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      const apiErr = err.response?.data?.error || 'Failed to send message. Please try again.';
      setErrorMessage(apiErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Ensure page loads at top when navigated to (e.g. from Home review button)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="contact-page">
      <Navbar />
      
      {/* Parallax Background */}
      <div className="contact-parallax-bg"></div>
      
      {/* Split Hero Section */}
      <section className="contact-split-hero">
        <div className="hero-left">
          <div className="hero-text-content">
            <div className="hero-badge">Contact Us</div>
            <h1 className="hero-main-title">Let's Start a<br/><span className="title-accent">Conversation</span></h1>
            <p className="hero-description">
              Ready to experience exceptional dining? We're here to make your culinary journey unforgettable.
            </p>
            <div className="hero-quick-info">
              <div className="quick-info-item">
                <span className="info-icon">⚡</span>
                <span className="info-text">Response within 2 hours</span>
              </div>
              <div className="quick-info-item">
                <span className="info-icon">🎯</span>
                <span className="info-text">Personalized service</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-right">
          <div className="floating-contact-card">
            <div className="card-header">
              <h3>Quick Contact</h3>
              <p>Get in touch instantly</p>
            </div>
            <div className="quick-contact-options">
              <a href="tel:+15551234663" className="quick-option call">
                <div className="option-icon">📞</div>
                <div className="option-content">
                  <span className="option-title">Call Now</span>
                  <span className="option-detail">+1 (555) 123-FOOD</span>
                </div>
              </a>
              <a href="mailto:hello@foodieshub.com" className="quick-option email">
                <div className="option-icon">✉️</div>
                <div className="option-content">
                  <span className="option-title">Email Us</span>
                  <span className="option-detail">hello@foodieshub.com</span>
                </div>
              </a>
              <div className="quick-option location">
                <div className="option-icon">📍</div>
                <div className="option-content">
                  <span className="option-title">Visit Us</span>
                  <span className="option-detail">123 Culinary Street</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section - Vertical Layout */}
      <section className="contact-main">
        <div className="contact-container">
          
          {/* Contact Form - Full Width */}
          <div className="form-container">
            <div className="form-intro">
              <h2 className="section-title">Send us a Message</h2>
              <p className="section-subtitle">
                Whether you're planning a special celebration, have dietary questions, or want to share feedback, 
                we're excited to hear from you.
              </p>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="message success-message">
                <span className="message-icon">✓</span>
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="message error-message">
                <span className="message-icon">⚠</span>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="modern-contact-form">
              <div className="form-grid">
                <div className="form-field">
                  <input
                    type="text"
                    className={`modern-input ${focusedField === 'name' ? 'focused' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    required
                  />
                  <label className="floating-label">Full Name</label>
                  <div className="field-border"></div>
                </div>

                <div className="form-field">
                  <input
                    type="email"
                    className={`modern-input ${focusedField === 'email' ? 'focused' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    required
                  />
                  <label className="floating-label">Email Address</label>
                  <div className="field-border"></div>
                </div>

                <div className="form-field full-width">
                  <select
                    className={`modern-select ${focusedField === 'subject' ? 'focused' : ''}`}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="">Choose a topic</option>
                    <option value="reservation">🍽️ Table Reservation</option>
                    <option value="feedback">⭐ Feedback & Reviews</option>
                    <option value="catering">🎉 Catering Services</option>
                    <option value="events">🥂 Private Events</option>
                    <option value="general">💬 General Question</option>
                    <option value="complaint">⚠️ Issue Report</option>
                  </select>
                  <label className="floating-label">Subject</label>
                  <div className="field-border"></div>
                </div>

                <div className="form-field full-width">
                  <textarea
                    className={`modern-textarea ${focusedField === 'message' ? 'focused' : ''}`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    rows={5}
                    required
                  />
                  <label className="floating-label">Your Message</label>
                  <div className="field-border"></div>
                  <div className={`message-counter ${formData.message.length > 500 ? 'over-limit' : ''}`}>
                    {formData.message.length}/500 characters
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="submit" 
                  className={`modern-submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  <span className="btn-content">
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner"></span>
                        Sending your message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Info Cards - Horizontal Layout */}
          <div className="info-cards-container">
            <h2 className="section-title">Other Ways to Connect</h2>
            <div className="horizontal-info-cards">
              
              <div className="info-card-modern location">
                <div className="card-icon-bg">
                  <span className="card-icon">🏠</span>
                </div>
                <div className="card-content">
                  <h3 className="card-title">Our Location</h3>
                  <p className="card-details">
                    123 Culinary Street<br/>
                    Gourmet District, Food City<br/>
                    FC 12345
                  </p>
                  <div className="card-actions">
                    <button className="card-btn primary">Get Directions</button>
                    <button className="card-btn secondary">View Map</button>
                  </div>
                </div>
              </div>

              <div className="info-card-modern hours">
                <div className="card-icon-bg">
                  <span className="card-icon">⏰</span>
                </div>
                <div className="card-content">
                  <h3 className="card-title">Operating Hours</h3>
                  <div className="hours-list">
                    <div className="hour-item">
                      <span className="day">Mon - Thu</span>
                      <span className="time">5:00 PM - 10:00 PM</span>
                    </div>
                    <div className="hour-item">
                      <span className="day">Fri - Sat</span>
                      <span className="time">5:00 PM - 11:00 PM</span>
                    </div>
                    <div className="hour-item">
                      <span className="day">Sunday</span>
                      <span className="time">4:00 PM - 9:00 PM</span>
                    </div>
                  </div>
                  <div className="status-badge open">
                    <span className="status-dot"></span>
                    Open Now
                  </div>
                </div>
              </div>

              <div className="info-card-modern social">
                <div className="card-icon-bg">
                  <span className="card-icon">🌟</span>
                </div>
                <div className="card-content">
                  <h3 className="card-title">Follow Our Journey</h3>
                  <p className="card-details">
                    Stay updated with our latest dishes, events, and special offers.
                  </p>
                  <div className="social-grid">
                    <a href="#" className="social-btn instagram">�</a>
                    <a href="#" className="social-btn facebook">📘</a>
                    <a href="#" className="social-btn twitter">�</a>
                    <a href="#" className="social-btn youtube">📺</a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA - Redesigned */}
      <section className="bottom-cta">
        <div className="cta-background">
          <div className="cta-content-wrapper">
            <div className="cta-header">
              <div className="cta-badge">Get Started Today</div>
              <h2 className="cta-title">
                Ready for an <span className="cta-title-accent">Extraordinary Experience?</span>
              </h2>
              <p className="cta-description">
                Join us for an unforgettable culinary journey. Reserve your table now or explore our delicious menu offerings.
              </p>
            </div>

            <div className="cta-actions">
              <button className="cta-primary-btn" type="button" onClick={() => navigate('/menu')}>
                <span className="btn-icon">🍽️</span>
                Reserve Your Table
              </button>
              <button className="cta-secondary-btn" type="button" onClick={() => navigate('/menu')}>
                <span className="btn-icon">📋</span>
                Explore Menu
              </button>
            </div>

            <div className="cta-footer">
              <div className="cta-contact-info">
                <div className="cta-contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+1 (555) 123-FOOD</span>
                </div>
                <div className="cta-contact-item">
                  <span className="contact-icon">⏰</span>
                  <span>Open Daily 5:00 PM - 11:00 PM</span>
                </div>
                <div className="cta-contact-item">
                  <span className="contact-icon">📍</span>
                  <span>123 Culinary Street</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;