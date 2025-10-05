import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './third.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SpecialtiesSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const cardsRef = useRef([]);
  const flavorBurstRef = useRef(null);
  const { addItem } = useCart();
  // Specialty items data
  const specialties = [
    {
      id: 1,
      title: "Wagyu Beef",
      description: "Premium A5 Wagyu beef perfectly grilled with our signature seasoning blend and served with roasted vegetables",
      image: "/api/placeholder/400/300",
      tag: "Chef's Pick",
      rating: "★★★★★"
    },
    {
      id: 2,
      title: "Fresh Seafood Medley",
      description: "Perfectly seared fresh catch of the day with lemon butter sauce and seasonal accompaniments",
      image: "/api/placeholder/400/300",
      tag: "Fan Favorite",
      rating: "★★★★★"
    },
    {
      id: 3,
      title: "Truffle Pasta",
      description: "Hand-rolled pasta with authentic black truffle shavings in a delicate cream sauce",
      image: "/api/placeholder/400/300",
      tag: "Premium",
      rating: "★★★★☆"
    },
    {
      id: 4,
      title: "Garden Fresh Seasonal",
      description: "Locally sourced seasonal vegetables prepared with Mediterranean herbs and extra virgin olive oil",
      image: "/api/placeholder/400/300",
      tag: "Vegetarian",
      rating: "★★★★★"
    },
    {
      id: 5,
      title: "Artisan Dessert",
      description: "House-made chocolate and caramel creation with fresh berries and artisanal presentation",
      image: "/api/placeholder/400/300",
      tag: "Signature Sweet",
      rating: "★★★★☆"
    }
  ];
  useEffect(() => {    
    // Taste bar animation
    gsap.fromTo('.taste-bar', 
      { width: 0 }, 
      { 
        width: '95%', 
        duration: 1.5, 
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.specialties-grid',
          start: "top 80%",
        }
      }
    );
    
    // Food quote animation
    gsap.fromTo('.food-quote', 
      { opacity: 0, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2,
        delay: 0.5,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: '.specialties-header',
          start: "bottom 70%",
        }
      }
    );
    
    // Hot indicator animation
    gsap.to('.hot-indicator', {
      opacity: 0.8,
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
    
    // View Menu button animation
    gsap.fromTo(
      '.view-menu-button',
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1,
        delay: 2,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: '.view-menu-container',
          start: "top 90%",
        }
      }
    );

    // Headline animation with letter splitting
    const headlineText = headingRef.current.innerText;
    headingRef.current.innerHTML = '';
    [...headlineText].forEach((letter, i) => {
      const span = document.createElement('span');
      span.innerText = letter;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      headingRef.current.appendChild(span);
      
      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.05 * i,
        ease: "back.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });
    });

    // Tagline animation
    gsap.fromTo(
      taglineRef.current,
      { 
        scaleX: 0,
        opacity: 0 
      },
      { 
        scaleX: 1, 
        opacity: 1, 
        duration: 1.2,
        delay: 0.8,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    // Flavor burst animation
    gsap.fromTo(
      flavorBurstRef.current,
      { 
        scale: 0,
        rotation: -120
      },
      { 
        scale: 1, 
        rotation: 0,
        duration: 1.5,
        ease: "elastic.out(1.2, 0.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    // Cards staggered animation
    gsap.fromTo(
      cardsRef.current,
      { 
        opacity: 0,
        y: 100,
        rotationX: 45,
        transformOrigin: "50% 100%"
      },
      { 
        opacity: 1, 
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.specialties-grid',
          start: "top 85%",
        }
      }
    );

    // Special dish tags animation
    const tags = document.querySelectorAll('.specialty-tag');
    tags.forEach((tag) => {
      gsap.fromTo(
        tag,
        { scale: 0, rotation: -15 },
        { 
          scale: 1, 
          rotation: 0, 
          delay: 1.5,
          duration: 0.6, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: tag.parentElement,
            start: "top 80%",
          }
        }
      );
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <section ref={sectionRef} className="specialties-section" id="specialties">
      <div className="specialties-container">
        <div className="specialties-header">          <h2 ref={headingRef} className="specialties-heading">SIGNATURE SPECIALTIES</h2>
          <div className="tagline-wrapper">
            <p ref={taglineRef} className="specialties-tagline">Exceptional dishes crafted with passion</p>
          </div>
          <div ref={flavorBurstRef} className="flavor-burst">
            <span>CHEF'S</span>
            <span>SIGNATURE</span>
            <span>SELECTION</span>
          </div>
        </div>
        
        <div className="food-quote">
          <span className="quote-mark">"</span>
          <span className="quote-text">Every bite tells a story of passion and flavor</span>
          <span className="quote-mark">"</span>
        </div>
        
        <div className="specialties-grid">
          {specialties.map((item, index) => (
            <div 
              key={item.id}
              ref={el => cardsRef.current[index] = el}
              className="specialty-card"
            >
              <div className="specialty-image-container">
                <div className="specialty-tag">{item.tag}</div>
                <div className="image-overlay"></div>
                <img src={item.image} alt={item.title} className="specialty-image" />
                <div className="dish-glow"></div>
                <div className="hot-indicator">HOT & FRESH</div>
              </div>
              <div className="specialty-content">
                <h3 className="specialty-title">{item.title}</h3>
                <div className="specialty-rating">{item.rating}</div>
                <p className="specialty-description">{item.description}</p>
                <div className="specialty-extras">
                  <div className="taste-meter">
                    <span className="taste-label">Flavor</span>
                    <div className="taste-bar"></div>
                  </div>
                </div>                <button
                  className="specialty-button"
                  onClick={() => {
                    // Add to cart with minimal item info (price not present in original data; using fallback)
                    addItem({
                      id: `specialty-${item.id}`,
                      name: item.title,
                      price: 0, // TODO: assign real price if available
                      image: item.image
                    });
                    // Open cart drawer (global listener will handle)
                    window.dispatchEvent(new CustomEvent('open-cart'));
                  }}
                >
                  <span className="button-text">Order Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-menu-container">
          <button
            className="view-menu-button"
            onClick={() => navigate('/menu')}
            aria-label="Go to full menu"
          >
            <span className="menu-button-text">VIEW FULL MENU</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;