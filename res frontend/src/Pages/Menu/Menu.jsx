// src/pages/Menu/Menu.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Menu.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Removed static menuData: now fully dynamic from API while preserving layout.

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  // Dynamic menu data state (moved above effects to avoid TDZ errors)
  const [dynamicMenuData, setDynamicMenuData] = useState(null); // grouped by category
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState('');
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const menuContentRef = useRef(null);
  const categoryRef = useRef(null);
  const { addItem } = useCart();
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'starters', name: 'Starters', icon: '🍤' },
    { id: 'mains', name: 'Main Courses', icon: '🥩' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'beverages', name: 'Beverages', icon: '🍷' }
  ];
  useEffect(() => {
    // Reset scroll position to top on component mount
    window.scrollTo(0, 0);
    
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
      // GSAP animations
    const tl = gsap.timeline();
    
    // Initial setup - hide elements
    gsap.set([heroTitleRef.current, heroSubtitleRef.current], { 
      opacity: 0, 
      y: 50 
    });
    
    tl.fromTo(heroRef.current,      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo(heroTitleRef.current, 
      { 
        opacity: 0, 
        y: 100,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      },
      "-=0.4"
    )
    .fromTo(heroSubtitleRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.6"    )
    .fromTo(menuContentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.2"
    );

    const filterItems = () => {
      if (!dynamicMenuData) { setFilteredItems({}); return; }
      if (selectedCategory === 'all') {
        const filtered = {};
        Object.keys(dynamicMenuData).forEach(category => {
          const categoryItems = dynamicMenuData[category].filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.ingredients || []).some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          filtered[category] = categoryItems;
        });
        setFilteredItems(filtered);
      } else {
        const source = dynamicMenuData[selectedCategory] || [];
        const categoryItems = source.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.ingredients || []).some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredItems({ [selectedCategory]: categoryItems });
      }
    };
    filterItems();
  }, [selectedCategory, searchTerm, dynamicMenuData]);

  // Popup handlers for main courses
  const handleMainItemClick = (itemId) => {
    if (activePopup === itemId) {
      closePopup();
    } else {
      setActivePopup(itemId);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }
  };

  const closePopup = () => {
    setActivePopup(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('popup-backdrop')) {
      closePopup();
    }
  };

  // Close popup on escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && activePopup) {
        closePopup();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Cleanup: restore body scroll if component unmounts with popup open
      document.body.style.overflow = 'unset';
    };
  }, [activePopup]);const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    gsap.fromTo('.menu-section', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  };


  // Scroll restoration - runs only on component mount
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Set scroll restoration to manual
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Also set it on window beforeunload
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Category bar scroll animation  // Enhanced scroll-triggered animations
  useEffect(() => {
    if (categoryRef.current) {
      // Set initial state
      gsap.set(categoryRef.current, { x: '-100%', opacity: 0 });
      gsap.set('.filter-btn', { y: 20, opacity: 0, scale: 0.8 });
      gsap.set('.search-wrapper', { y: 30, opacity: 0 });

      // Create scroll trigger animation
      gsap.timeline({
        scrollTrigger: {
          trigger: categoryRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      })
      .to(categoryRef.current, {
        x: '0%',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      })
      .to('.filter-btn', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.3')
      .to('.search-wrapper', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '-=0.2');
    }    // Animate menu sections on scroll
    gsap.utils.toArray('.menu-section').forEach((section) => {
      gsap.set(section, { opacity: 0, y: 50 });
      
      gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Animate individual menu items
    gsap.utils.toArray('.menu-item').forEach((item, index) => {
      gsap.set(item, { opacity: 0, y: 30, scale: 0.95 });
      
      gsap.to(item, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        delay: (index % 6) * 0.1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredItems]);
  // Dynamic backend integration (state moved to top of component)

  useEffect(() => {
    const fetchData = async () => {
      setMenuLoading(true);
      setMenuError('');
      try {
        const response = await fetch('http://localhost:5000/api/menu?limit=200');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (!data.items) throw new Error('Malformed response');
        const grouped = { appetizers: [], starters: [], mains: [], desserts: [], beverages: [] };
        data.items.forEach(it => {
          if (grouped[it.category]) {
            // Keep server-provided id; fallback to _id or name hash
            const stableId = it.id || it._id || `${it.category}-${it.name}`;
            grouped[it.category].push({ ...it, id: stableId });
          }
        });
        setDynamicMenuData(grouped);
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setMenuError('Failed to load live menu. Showing sample items.');
      } finally {
        setMenuLoading(false);
      }
    };
    fetchData();
  }, []);

  // No static fallback; show loading/error states until dynamic data arrives.

  return (
    <div className="menu menu-page">
      <Navbar />
      
      {/* Parallax Background */}
      <div className="parallax-bg"></div>
      
      {/* Hero Section */}
      <section ref={heroRef} className="menu-hero">        <div className="hero-content">
          <h1 ref={heroTitleRef} className="hero-title">
            Culinary Excellence
          </h1>
          <p ref={heroSubtitleRef} className="hero-subtitle">
            Discover our carefully crafted dishes made with the finest ingredients
          </p>
        </div>
      </section>      {/* Category Filter with Integrated Search */}
      <section ref={categoryRef} className="category-filter">
        <div className="filter-container">
          {/* Category Buttons */}
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-name">{category.name}</span>
              </button>
            ))}
          </div>
          
          {/* Search Bar */}
          <div className="search-wrapper">
            <div className="search-bar-integrated">
              <svg className="search-icon-integrated" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="text"
                placeholder="Search our menu..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input-integrated"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="clear-button-integrated"
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="search-results-integrated">
                <span className="results-count">
                  {Object.values(filteredItems).reduce((total, items) => total + items.length, 0)}
                </span>
                <span className="results-text">
                  {Object.values(filteredItems).reduce((total, items) => total + items.length, 0) === 1 ? 'dish found' : 'dishes found'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>      {/* Menu Content */}
      <section ref={menuContentRef} className="menu-content">
        <div className="menu-container">
          {menuLoading && <div className="menu-status loading">Loading menu...</div>}
          {!menuLoading && menuError && <div className="menu-status error">{menuError}</div>}
          {Object.entries(filteredItems).map(([key, items]) => 
            items.length > 0 && (
              <div key={key} className="menu-section">
                <div className="section-header">
                  <div className="section-title-wrapper">
                    <span className="section-icon">
                      {categories.find(cat => cat.id === key)?.icon || '🍽️'}
                    </span>
                    <h2 className="section-title">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h2>
                    <div className="section-count">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                  <div className="section-line"></div>
                </div>                {/* Appetizers - Featured Layout */}
                {key === 'appetizers' && (
                  <div className="appetizers-layout">
                    <div className="featured-appetizer">
                      {items[0] && (
                        <div className="featured-item">
                          <div className="featured-image">
                            <img src={items[0].image} alt={items[0].name} />
                            <div className="featured-badge">Chef's Choice</div>
                          </div>
                          <div className="featured-content">
                            <h3 className="featured-name">{items[0].name}</h3>
                            <p className="featured-description">{items[0].description}</p>                            <div className="featured-details">
                              <span className="featured-price">${items[0].price}</span>
                              <div className="featured-tags">
                                {items[0].dietary.map(diet => (
                                  <span key={diet} className="diet-tag">{diet}</span>
                                ))}
                              </div>
                              <button className="featured-add-btn" onClick={() => addItem({ id: items[0].id || items[0]._id, name: items[0].name, price: items[0].price, image: items[0].image })}>Add to Order</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="appetizer-grid">
                      {items.slice(1).map((item, idx) => (
                        <div 
                          key={item.id || item._id || `${item.name}-${idx}`} 
                          className="appetizer-card"
                          onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, {
                              y: -5,
                              boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                              duration: 0.3
                            });
                          }}
                          onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, {
                              y: 0,
                              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                              duration: 0.3
                            });
                          }}
                        >
                          <div className="card-image">
                            <img src={item.image} alt={item.name} />
                            <div className="quick-add">
                              <button className="add-btn" onClick={() => addItem({ id: item.id || item._id, name: item.name, price: item.price, image: item.image })}>+</button>
                            </div>
                          </div>
                          <div className="card-content">
                            <h4 className="card-name">{item.name}</h4>
                            <p className="card-description">{item.description.substring(0, 80)}...</p>
                            <div className="card-footer">
                              <span className="card-price">${item.price}</span>
                              <span className="prep-time">{item.preparationTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}                {/* Starters - Modern Card Grid */}
                {key === 'starters' && (
                  <div className="starters-layout">
                    <div className="starters-grid">
                      {items.map((item, index) => (
                        <div 
                          key={item.id || item._id || `${item.name}-${index}`} 
                          className={`starter-card ${index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'small'}`}
                          onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, {
                              y: -12,
                              rotationY: 3,
                              scale: 1.02,
                              boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                              duration: 0.4,
                              ease: "power2.out"
                            });
                            gsap.to(e.currentTarget.querySelector('.starter-image-bg'), {
                              scale: 1.1,
                              duration: 0.6
                            });
                            gsap.to(e.currentTarget.querySelector('.starter-overlay'), {
                              opacity: 1,
                              duration: 0.3
                            });
                          }}
                          onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, {
                              y: 0,
                              rotationY: 0,
                              scale: 1,
                              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                              duration: 0.4,
                              ease: "power2.out"
                            });
                            gsap.to(e.currentTarget.querySelector('.starter-image-bg'), {
                              scale: 1,
                              duration: 0.6
                            });
                            gsap.to(e.currentTarget.querySelector('.starter-overlay'), {
                              opacity: 0,
                              duration: 0.3
                            });
                          }}
                        >
                          <div className="starter-image-container">
                            <div 
                              className="starter-image-bg"
                              style={{ backgroundImage: `url(${item.image})` }}
                            ></div>
                            <div className="starter-overlay">
                              <div className="overlay-badge">{item.subcategory}</div>
                              <div className="overlay-actions">
                                <button className="quick-view-btn">Quick View</button>
                                <button className="add-to-order-btn" onClick={() => addItem({ id: item.id || item._id, name: item.name, price: item.price, image: item.image })}>Add to Order</button>
                              </div>
                            </div>
                            <div className="price-tag">${item.price}</div>
                          </div>
                          
                          <div className="starter-info">
                            <div className="starter-top">
                              <h3 className="starter-title">{item.name}</h3>
                              <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`star ${i < 4 ? 'filled' : ''}`}>★</span>
                                ))}
                              </div>
                            </div>
                            
                            <p className="starter-desc">{item.description}</p>
                            
                            <div className="starter-details">
                              <div className="detail-badge">
                                <span className="detail-icon">⏱</span>
                                <span className="detail-text">{item.preparationTime}</span>
                              </div>
                              <div className="detail-badge">
                                <span className="detail-icon">🌶️</span>
                                <div className="spice-indicators">
                                  {[...Array(3)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`spice-indicator ${
                                        item.spiceLevel === 'hot' ? (i < 3 ? 'active' : '') :
                                        item.spiceLevel === 'medium' ? (i < 2 ? 'active' : '') :
                                        (i < 1 ? 'active' : '')
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                              {item.dietary.length > 0 && (
                                <div className="dietary-badge">
                                  <span className="dietary-icon">🍃</span>
                                  <span className="dietary-text">{item.dietary[0]}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="starter-ingredients">
                              <span className="ingredients-label">Key ingredients:</span>
                              <div className="ingredients-list">
                                {item.ingredients.slice(0, 3).map((ingredient, i) => (
                                  <span key={i} className="ingredient-chip">{ingredient}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}                {/* Main Courses - Interactive Grid */}
                {key === 'mains' && (
                  <div className="mains-layout">
                    <div className="mains-grid">
                      {items.map((item, index) => (
                        <div 
                          key={item.id} 
                          className={`main-card ${index === 0 ? 'featured' : ''}`}
                          onClick={() => handleMainItemClick(item.id)}
                          onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, {
                              scale: 1.02,
                              y: -8,
                              boxShadow: '0 25px 50px rgba(73, 81, 30, 0.15)',
                              duration: 0.4,
                              ease: "power2.out"
                            });
                            gsap.to(e.currentTarget.querySelector('.main-overlay'), {
                              opacity: 1,
                              duration: 0.3
                            });
                          }}
                          onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, {
                              scale: 1,
                              y: 0,
                              boxShadow: '0 10px 30px rgba(73, 81, 30, 0.08)',
                              duration: 0.4,
                              ease: "power2.out"
                            });
                            gsap.to(e.currentTarget.querySelector('.main-overlay'), {
                              opacity: 0,
                              duration: 0.3
                            });
                          }}
                        >
                          <div className="main-image">
                            <img src={item.image} alt={item.name} />
                            <div className="main-overlay">
                              <div className="overlay-content">
                                <span className="click-hint">Click for details</span>
                                <div className="ingredients-preview">
                                  {item.ingredients.slice(0, 3).join(' • ')}
                                </div>
                              </div>
                            </div>
                            <div className="premium-badge">{item.subcategory}</div>
                          </div>
                          <div className="main-content">
                            <div className="main-header">
                              <h3 className="main-name">{item.name}</h3>
                              <div className="main-price">${item.price}</div>
                            </div>
                            <p className="main-description">{item.description}</p>                            <div className="main-footer">
                              <div className="prep-time">
                                <span className="time-icon">⏱</span>
                                <span>{item.preparationTime}</span>
                              </div>
                              <div className="dietary-info">
                                {item.dietary.length > 0 && (
                                  <span className="dietary-badge">{item.dietary[0]}</span>
                                )}
                              </div>
                              <button className="add-main-btn" onClick={() => addItem({ id: item.id || item._id, name: item.name, price: item.price, image: item.image })}>Add to Order</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Main Course Popup */}
                    {activePopup && items.find(item => item.id === activePopup) && (
                      <div className="main-popup">
                        {(() => {
                          const popupItem = items.find(item => item.id === activePopup);
                          return (
                            <div className="popup-content">
                              <button 
                                className="popup-close"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closePopup();
                                }}
                              >
                                ×
                              </button>
                              <div className="popup-image">
                                <img src={popupItem.image} alt={popupItem.name} />
                              </div>
                              <div className="popup-info">
                                <h3 className="popup-name">{popupItem.name}</h3>
                                <p className="popup-description">{popupItem.description}</p>
                                <div className="popup-details">
                                  <div className="detail-row">
                                    <span className="detail-label">Preparation Time:</span>
                                    <span className="detail-value">{popupItem.preparationTime}</span>
                                  </div>
                                  <div className="detail-row">
                                    <span className="detail-label">Ingredients:</span>
                                    <span className="detail-value">{popupItem.ingredients.join(', ')}</span>
                                  </div>
                                  <div className="detail-row">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{popupItem.subcategory}</span>
                                  </div>
                                  {popupItem.dietary.length > 0 && (
                                    <div className="detail-row">
                                      <span className="detail-label">Dietary:</span>
                                      <span className="detail-value">{popupItem.dietary.join(', ')}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="popup-actions">
                                  <div className="popup-price">${popupItem.price}</div>
                                  <button className="order-btn" onClick={() => addItem({ id: popupItem.id || popupItem._id, name: popupItem.name, price: popupItem.price, image: popupItem.image })}>Add to Order</button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}                {/* Desserts - Showcase Layout */}
                {key === 'desserts' && (
                  <div className="desserts-layout">
                    <div className="desserts-showcase">
                      {items.map((item, idx) => (
                        <div 
                          key={item.id || item._id || `${item.name}-${idx}`} 
                          className="dessert-showcase-item"
                          onMouseEnter={(e) => {
                            gsap.to(e.currentTarget.querySelector('.dessert-image img'), {
                              scale: 1.1,
                              duration: 0.5
                            });
                            gsap.to(e.currentTarget.querySelector('.dessert-info'), {
                              y: -10,
                              duration: 0.4
                            });
                          }}
                          onMouseLeave={(e) => {
                            gsap.to(e.currentTarget.querySelector('.dessert-image img'), {
                              scale: 1,
                              duration: 0.5
                            });
                            gsap.to(e.currentTarget.querySelector('.dessert-info'), {
                              y: 0,
                              duration: 0.4
                            });
                          }}
                        >
                          <div className="dessert-image">
                            <img src={item.image} alt={item.name} />
                            <div className="dessert-rating">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="star">★</span>
                              ))}
                            </div>
                          </div>
                          <div className="dessert-info">
                            <h3 className="dessert-name">{item.name}</h3>
                            <p className="dessert-description">{item.description}</p>                            <div className="dessert-details">
                              <div className="dessert-price">${item.price}</div>
                              <div className="dessert-meta">
                                <span className="prep-time">{item.preparationTime}</span>
                                {item.dietary.length > 0 && (
                                  <span className="dietary-tag">{item.dietary[0]}</span>
                                )}
                              </div>
                              <button className="dessert-add-btn" onClick={() => addItem({ id: item.id || item._id, name: item.name, price: item.price, image: item.image })}>Add to Order</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}                {/* Beverages - Tab Layout */}
                {key === 'beverages' && (
                  <div className="beverages-layout">
                    <div className="beverages-grid">
                      {items.map((item, idx) => (
                        <div 
                          key={item.id || item._id || `${item.name}-${idx}`} 
                          className="beverage-item"
                          onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, {
                              scale: 1.05,
                              rotationY: 5,
                              duration: 0.3
                            });
                          }}
                          onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, {
                              scale: 1,
                              rotationY: 0,
                              duration: 0.3
                            });
                          }}
                        >
                          <div className="beverage-image">
                            <img src={item.image} alt={item.name} />
                            <div className="beverage-category">{item.subcategory}</div>
                          </div>
                          <div className="beverage-content">
                            <h4 className="beverage-name">{item.name}</h4>
                            <p className="beverage-description">{item.description}</p>                            <div className="beverage-footer">
                              <span className="beverage-price">${item.price}</span>
                              <button className="order-beverage" onClick={() => addItem({ id: item.id || item._id, name: item.name, price: item.price, image: item.image })}>Add to Order</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
          
          {Object.values(filteredItems).every(items => items.length === 0) && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No dishes found</h3>
              <p>Try adjusting your search or browse our categories</p>
            </div>
          )}
        </div>
      </section>

      {/* Popup backdrop for main courses */}
      {activePopup && (
        <div 
          className={`popup-backdrop ${activePopup ? 'active' : ''}`}
          onClick={handleBackdropClick}
        />
      )}

      <Footer />
    </div>
  );
};

export default Menu;