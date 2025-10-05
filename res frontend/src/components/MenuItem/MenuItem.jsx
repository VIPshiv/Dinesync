// src/components/MenuItem/MenuItem.jsx
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MenuItem.css';

const MenuItem = ({ searchTerm = '', onOrderItem }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const sliderRefs = useRef({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Sample menu data with categories - replace with actual API data
  const menuData = {
    appetizers: [
      {
        _id: '1',
        name: 'Bruschetta Trio',
        price: 12.99,
        description: 'Three varieties of our signature bruschetta with fresh basil and tomatoes',
        image: '/api/placeholder/300/200',
        rating: 4.5,
        reviews: []
      },
      {
        _id: '2',
        name: 'Calamari Rings',
        price: 14.99,
        description: 'Crispy golden calamari rings served with marinara sauce',
        image: '/api/placeholder/300/200',
        rating: 4.2,
        reviews: []
      },
      {
        _id: '3',
        name: 'Stuffed Mushrooms',
        price: 11.99,
        description: 'Button mushrooms stuffed with herbs, cheese and breadcrumbs',
        image: '/api/placeholder/300/200',
        rating: 4.7,
        reviews: []
      }
    ],
    mains: [
      {
        _id: '4',
        name: 'Grilled Salmon',
        price: 24.99,
        description: 'Fresh Atlantic salmon with lemon herb butter and seasonal vegetables',
        image: '/api/placeholder/300/200',
        rating: 4.8,
        reviews: []
      },
      {
        _id: '5',
        name: 'Ribeye Steak',
        price: 32.99,
        description: 'Premium ribeye steak cooked to perfection with garlic mashed potatoes',
        image: '/api/placeholder/300/200',
        rating: 4.9,
        reviews: []
      },
      {
        _id: '6',
        name: 'Chicken Parmesan',
        price: 19.99,
        description: 'Breaded chicken breast with marinara sauce and melted mozzarella',
        image: '/api/placeholder/300/200',
        rating: 4.4,
        reviews: []
      }
    ],
    desserts: [
      {
        _id: '7',
        name: 'Tiramisu',
        price: 8.99,
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        image: '/api/placeholder/300/200',
        rating: 4.6,
        reviews: []
      },
      {
        _id: '8',
        name: 'Chocolate Lava Cake',
        price: 9.99,
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        image: '/api/placeholder/300/200',
        rating: 4.8,
        reviews: []
      }
    ]
  };

  const categoryTitles = {
    all: 'All Items',
    appetizers: 'Appetizers',
    mains: 'Main Courses',
    desserts: 'Desserts'
  };

  const filteredItems = selectedCategory === 'all' 
    ? Object.values(menuData).flat()
    : menuData[selectedCategory] || [];

  const searchFilteredItems = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollLeft = (category) => {
    if (sliderRefs.current[category]) {
      sliderRefs.current[category].scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (category) => {
    if (sliderRefs.current[category]) {
      sliderRefs.current[category].scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedItem) return;

    try {
      await axios.post(
        `http://localhost:5000/api/menu/${selectedItem._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted!');
      setRating('');
      setComment('');
      setShowReviewForm(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const CategorySlider = ({ category, items, title }) => (
    <div className="category-section">
      <div className="category-header">
        <h2 className="category-title">{title}</h2>
        <div className="slider-controls">
          <button className="slider-btn" onClick={() => scrollLeft(category)}>‹</button>
          <button className="slider-btn" onClick={() => scrollRight(category)}>›</button>
        </div>
      </div>
      
      <div className="items-slider-container">
        <div 
          className="items-slider" 
          ref={el => sliderRefs.current[category] = el}
        >
          {items.map(item => (
            <div key={item._id} className="menu-item-card">
              <div className="item-image-container">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-rating">
                  {renderStars(item.rating)}
                  <span className="rating-number">{item.rating}</span>
                </div>
              </div>
              
              <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                  <span className="item-price">${item.price}</span>
                  <div className="item-actions">
                    <button 
                      className="btn-review"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowReviewForm(true);
                      }}
                    >
                      Review
                    </button>
                    <button 
                      className="btn-order"
                      onClick={() => onOrderItem && onOrderItem(item)}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="menu-component">
      {/* Category Tabs */}
      <div className="category-tabs">
        {Object.entries(categoryTitles).map(([key, title]) => (
          <button
            key={key}
            className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="menu-content">
        {selectedCategory === 'all' ? (
          // Show all categories
          Object.entries(menuData).map(([category, items]) => (
            <CategorySlider 
              key={category}
              category={category}
              items={items}
              title={categoryTitles[category]}
            />
          ))
        ) : (
          // Show selected category
          <CategorySlider 
            category={selectedCategory}
            items={searchFilteredItems}
            title={categoryTitles[selectedCategory]}
          />
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedItem && (
        <div className="review-modal">
          <div className="review-modal-content">
            <div className="modal-header">
              <h3>Review {selectedItem.name}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowReviewForm(false);
                  setSelectedItem(null);
                  setRating('');
                  setComment('');
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating (1-5):</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`rating-star ${rating >= num ? 'active' : ''}`}
                      onClick={() => setRating(num)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  className="form-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;