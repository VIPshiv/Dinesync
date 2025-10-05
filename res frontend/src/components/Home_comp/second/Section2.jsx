import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Section2.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const specialties = [
  {
    title: "BUTTERNUT PUMPKIN",
    description: "Slow-roasted butternut with caramelized edges, drizzled with maple glaze and toasted pecans.",
    price: "$15.00",
    image: "https://images.unsplash.com/photo-1603894584373-2d7f1717ec9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    isSpicy: false,
    isVegetarian: true,
  },
  {
    title: "OPU FISH",
    description: "Fresh-caught Opu fish seared to perfection, served on a bed of citrus risotto with saffron broth.",
    price: "$22.00",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4,
    isSpicy: false,
    isVegetarian: false,
  },
  {
    title: "SPICY ARRABIATA",
    description: "Al dente pasta tossed in our signature spicy arrabiata sauce with fresh basil and Parmigiano-Reggiano.",
    price: "$18.00",
    image: "https://images.unsplash.com/photo-1621996346565-effa8b336239?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4,
    isSpicy: true,
    isVegetarian: true,
  },
  {
    title: "TOKUSEN WAGYU",
    description: "Premium A5 Wagyu beef perfectly marbled and grilled, with truffle mashed potatoes.",
    price: "$45.00",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    isSpicy: false,
    isVegetarian: false,
  },
  {
    title: "COCONUT SHRIMP",
    description: "Jumbo shrimp coated in coconut flakes, deep-fried to golden perfection with mango chili sauce.",
    price: "$24.00",
    image: "https://images.unsplash.com/photo-1612871698487-4e3f4f330d85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    title: "GREEK SALAD",
    description: "Crisp cucumbers, heirloom tomatoes, Kalamata olives, and authentic feta cheese with olive oil dressing.",
    price: "$12.00",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4,
    isSpicy: false,
    isVegetarian: true,
  }
];

function getRelativeIndex(index, active, length) {
  // Returns -2, -1, 0, 1, 2 for visible cards, or null for hidden
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  if (Math.abs(diff) > 2) return null;
  return diff;
}

export default function Section2() {
  const [active, setActive] = useState(0);
  const length = specialties.length;
  const sectionRef = useRef();
  const navigate = useNavigate();

  function goTo(idx) {
    setActive((idx + length) % length);
  }
  function next() { goTo(active + 1); }
  function prev() { goTo(active - 1); }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from('.culinary-heading', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
      gsap.from('.culinary-tagline', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
      // Animate dish cards
      gsap.from('.dish-card', {
        opacity: 0,
        y: 80,
        scale: 0.9,
        stagger: 0.15,
        duration: 0.7,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.dish-slider',
          start: 'top 85%',
        },      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section className="culinary-showcase" ref={sectionRef}>
      <div className="culinary-header">
        <h2 className="culinary-heading">OUR SPECIALTIES</h2>
        <p className="culinary-tagline">Signature dishes crafted with passion</p>
      </div>
      <div className="dish-slider">
        <div className="slider-stage">
          {specialties.map((dish, idx) => {
            const rel = getRelativeIndex(idx, active, length);
            if (rel === null) return null;
            let style = {};
            if (rel === 0) style = { left: '50%', transform: 'translateX(-50%) scale(1)', zIndex: 3, opacity: 1 };
            if (rel === -1) style = { left: '25%', transform: 'translateX(-50%) scale(0.85)', zIndex: 2, opacity: 0.7 };
            if (rel === 1) style = { left: '75%', transform: 'translateX(-50%) scale(0.85)', zIndex: 2, opacity: 0.7 };
            if (rel === -2) style = { left: '10%', transform: 'translateX(-50%) scale(0.7)', zIndex: 1, opacity: 0.4 };
            if (rel === 2) style = { left: '90%', transform: 'translateX(-50%) scale(0.7)', zIndex: 1, opacity: 0.4 };
            return (
              <div
                className={`dish-card${rel === 0 ? ' active' : ''}`}
                key={dish.title}
                style={style}
                onClick={() => navigate('/menu')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/menu'); }}
                aria-label={`View full menu (selected dish: ${dish.title})`}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <div className="dish-image-wrapper">
                      <img src={dish.image} alt={dish.title} className="dish-image" />
                    </div>
                    <div className="dish-info">
                      <h3 className="dish-title">{dish.title}</h3>
                      <div className="dish-rating">{'★'.repeat(dish.rating)}{'☆'.repeat(5 - dish.rating)}</div>                      <div className="dish-tags">
                        {dish.isSpicy && <span className="dish-tag spicy">SPICY 🔥</span>}
                        {dish.isVegetarian && <span className="dish-tag vegetarian">VEGETARIAN 🥬</span>}
                        {!dish.isVegetarian && dish.title.includes('FISH') && <span className="dish-tag seafood">SEAFOOD 🐟</span>}
                        {!dish.isVegetarian && dish.title.includes('WAGYU') && <span className="dish-tag premium">PREMIUM ⭐</span>}
                        {!dish.isVegetarian && dish.title.includes('SHRIMP') && <span className="dish-tag seafood">SEAFOOD 🦐</span>}
                        {dish.title.includes('SALAD') && <span className="dish-tag fresh">FRESH 🥗</span>}
                        {dish.rating === 5 && <span className="dish-tag chef-special">CHEF'S CHOICE 👨‍🍳</span>}
                        {!dish.isVegetarian && !dish.title.includes('FISH') && !dish.title.includes('WAGYU') && !dish.title.includes('SHRIMP') && !dish.title.includes('SALAD') && <span className="dish-tag protein">PROTEIN 🥩</span>}
                      </div>
                      <div className="dish-price">{dish.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={prev} aria-label="Previous dish">←</button>
          <div className="slider-dots">
            {specialties.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot${active === idx ? ' active' : ''}`}
                onClick={() => goTo(idx)}
                aria-label={`Go to dish ${idx + 1}`}
              />
            ))}
          </div>
          <button className="slider-arrow next" onClick={next} aria-label="Next dish">→</button>
        </div>
      </div>
    </section>
  );
}