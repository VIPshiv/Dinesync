// src/components/ReviewForm/ReviewForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css';

const ReviewForm = ({ itemId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/menu/${itemId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted!');
      setRating('');
      setComment('');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Rating (1-5):</label>
        <input
          type="number"
          className="form-input"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Comment:</label>
        <textarea
          className="form-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button type="submit" className="form-submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;