import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { gsap } from 'gsap';
import './first_section.css';

const FirstSection = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { items } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text into characters for jiggle effect
      const splitTextIntoChars = () => {
        const titleElement = document.querySelector('.hero-title');
        if (titleElement) {
          const text = titleElement.textContent;
          titleElement.innerHTML = text
            .split('')
            .map(char => char === ' ' ? ' ' : `<span class="char">${char}</span>`)
            .join('');
        }
      };

      // Split text on component mount
      splitTextIntoChars();      // Get elements for animation
      const headingChars = document.querySelectorAll('.char');
      const verticalLine = document.querySelector('.vertical-line');
      const heroImage = document.querySelector('.hero-image');
      const stats = document.querySelectorAll('.stat-item');
      const subtitle = document.querySelector('.hero-subtitle');
      const heroContent = document.querySelector('.hero-content');
      const buttons = document.querySelectorAll('.hero-buttons button');

      // Set initial states
      gsap.set(headingChars, {
        opacity: 0,
        y: 20
      });

      gsap.set(verticalLine, {
        height: 0,
        opacity: 1
      });

      gsap.set(heroImage, {
        opacity: 0,
        scale: 0.8
      });

      gsap.set(stats, {
        opacity: 0,
        y: 20
      });      gsap.set(subtitle, {
        opacity: 0,
        x: -50
      });

      gsap.set(buttons, {
        opacity: 0,
        y: 30,
        scale: 0.9
      });      // Set hero content to appear slightly left of center in the viewport initially
      // For better centering, use transform to move to center regardless of grid position
      gsap.set(heroContent, {
        x: "50vw", // Move slightly left from center (was 50vw)
        xPercent: -50, // This centers the element exactly in the viewport
        transformOrigin: "center center"
      });

      // Create timeline
      const tl = gsap.timeline();

      // STEP 1: Characters jiggle animation
      tl.to(headingChars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
        delay: 0.5,
      });      // Add character jiggle - PERMANENT
      tl.to(headingChars, {
        rotation: 2,
        duration: 0.1,
        stagger: 0.02,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Start permanent jiggle animation
          gsap.to(headingChars, {
            rotation: 1.5,
            duration: 0.6,
            stagger: {
              each: 0.1,
              from: "random"
            },
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut"
          });
        }
      });// STEP 2 & 3: Vertical line and title movement start simultaneously
      tl.to(verticalLine, {
        height: "60vh",
        duration: 1.8,
        ease: "power2.out",
      }, "+=0.5")
      .to(heroContent, {
        x: 0, // Move back to its original grid position (left column)
        xPercent: 0, // Reset the centering transform
        duration: 1.8, // Same duration as line for synchronized movement
        ease: "power2.out",
      }, "<"); // "<" means start at the same time as previous animation      // STEP 4: Image pops up on the right (starts midway through title/line movement)
      tl.to(heroImage, {
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: "back.out(1.7)",
      }, "-=1.0");// STEP 5: Stats fade in (after image appears)
      tl.to(stats, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }, "-=0.5");      // STEP 6: Subtitle appears after title reaches its final position
      tl.to(subtitle, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.6");

      // STEP 7: Buttons animate in with stagger
      tl.to(buttons, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
      }, "-=0.4");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-container">        <div className="hero-content">
          <h1 className="hero-title">Fresh Flavors Daily</h1>
          <p className="hero-subtitle">Premium experience</p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => {
                // Not logged in -> go to register
                if (!token) {
                  navigate('/register');
                  return;
                }
                // Logged in: go to menu then open cart (slight delay to ensure mount)
                navigate('/menu');
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('open-cart'));
                }, 150); // small delay for route transition
              }}
            >
              {token ? (items.length ? 'Add More / Cart' : 'Start Order') : 'Order Now'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/menu')}
            >
              View Menu
            </button>
          </div>
        </div>
        
        <div className="vertical-line"></div>
        
        <div className="hero-image">
          <img 
            src="/Casual Dining Experience with Fresh Pizza and Pasta.jpeg" 
            alt="Delicious food" 
          />
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100+</span>
            <span className="stat-label">Menu Items</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstSection;
