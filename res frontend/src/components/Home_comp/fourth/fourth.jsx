import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './fourth.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Fourth = () => {
  const navigate = useNavigate();
  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    // Animate section entrance
    if (sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Animate header first
      tl.fromTo(".section-header", 
        { 
          opacity: 0, 
          y: 30 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power3.out"
        }
      )
      // Then animate the review rows
      .fromTo(".reviews-wrapper", 
        { 
          opacity: 0, 
          y: 40 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4"
      )
      // Finally animate the CTA button
      .fromTo(".cta-section", 
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.3"
      );
    }    // GSAP infinite scroll animation for left track (moving left)
    if (leftTrackRef.current) {
      const leftTrack = leftTrackRef.current;
      const leftCards = leftTrack.children;
      const cardWidth = leftCards[0]?.offsetWidth || 280;
      const gap = 25;
      const totalWidth = (cardWidth + gap) * (leftCards.length / 2); // Half because we duplicate

      gsap.set(leftTrack, { x: 0 });
      
      gsap.to(leftTrack, {
        x: -totalWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      });
    }

    // GSAP infinite scroll animation for right track (moving right)
    if (rightTrackRef.current) {
      const rightTrack = rightTrackRef.current;
      const rightCards = rightTrack.children;
      const cardWidth = rightCards[0]?.offsetWidth || 280;
      const gap = 25;
      const totalWidth = (cardWidth + gap) * (rightCards.length / 2); // Half because we duplicate

      gsap.set(rightTrack, { x: -totalWidth });
      
      gsap.to(rightTrack, {
        x: 0,
        duration: 45,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      });
    }
  }, []);
  // Sample reviews data with different colors
  const reviewsRow1 = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Food Blogger",
      rating: 5,
      review: "Absolutely amazing! The pasta was perfectly cooked and the service was exceptional. This place has become my go-to restaurant.",
      color: "blue",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Mike Chen",
      title: "Local Guide",
      rating: 5,
      review: "Best pizza in town! The ingredients are fresh and the atmosphere is cozy. Highly recommend the margherita pizza.",
      color: "green",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emma Davis",
      title: "Restaurant Critic",
      rating: 5,
      review: "Outstanding culinary experience! Every dish was a masterpiece. The chef really knows how to balance flavors perfectly.",
      color: "red",
      avatar: "ED"
    },
    {
      id: 4,
      name: "John Smith",
      title: "Food Enthusiast",
      rating: 5,
      review: "Fantastic dining experience! The staff was friendly and attentive. The seafood pasta was absolutely delicious.",
      color: "yellow",
      avatar: "JS"
    },
    {
      id: 5,
      name: "Lisa Wang",
      title: "Travel Writer",
      rating: 5,
      review: "Hidden gem! The ambiance is perfect for date nights. The tiramisu is to die for. Will definitely be back soon.",
      color: "orange",
      avatar: "LW"
    },
    {
      id: 6,
      name: "David Brown",
      title: "Chef",
      rating: 5,
      review: "As a fellow chef, I'm impressed by the quality and presentation. The risotto was creamy perfection. Well done!",
      color: "purple",
      avatar: "DB"
    }
  ];

  const reviewsRow2 = [
    {
      id: 7,
      name: "Anna Rodriguez",
      title: "Food Vlogger",
      rating: 5,
      review: "Incredible flavors and beautiful presentation! My followers loved seeing this place. The carbonara was heavenly.",
      color: "teal",
      avatar: "AR"
    },
    {
      id: 8,
      name: "Tom Wilson",
      title: "Business Owner",
      rating: 5,
      review: "Perfect for business lunches! Professional atmosphere and quick service. The grilled salmon was cooked to perfection.",
      color: "brown",
      avatar: "TW"
    },
    {
      id: 9,
      name: "Grace Kim",
      title: "Student",
      rating: 5,
      review: "Great value for money! Portions are generous and the taste is amazing. My friends and I come here regularly.",
      color: "pink",
      avatar: "GK"
    },
    {
      id: 10,
      name: "Robert Taylor",
      title: "Retiree",
      rating: 5,
      review: "Reminds me of authentic Italian cuisine from my travels. The staff treats you like family. Wonderful experience!",
      color: "indigo",
      avatar: "RT"
    },
    {
      id: 11,
      name: "Maya Patel",
      title: "Nutritionist",
      rating: 5,
      review: "Healthy options that don't compromise on taste! The fresh salads and grilled vegetables are outstanding.",
      color: "lime",
      avatar: "MP"
    },
    {
      id: 12,
      name: "Chris Anderson",
      title: "Sports Coach",
      rating: 5,
      review: "Great place to celebrate wins with the team! Large portions and delicious food. The pizza party was a hit!",
      color: "cyan",
      avatar: "CA"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };
  const ReviewCard = ({ review }) => {
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
        y: -10,
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    return (
      <div 
        className={`review-card ${review.color}`}
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-header">
          <div className="avatar-container">
            <div className="avatar">{review.avatar}</div>
          </div>
          <div className="reviewer-info">
            <h4 className="reviewer-name">{review.name}</h4>
            <p className="reviewer-title">{review.title}</p>
          </div>
        </div>
        
        <div className="rating-container">
          {renderStars(review.rating)}
        </div>
        
        <p className="review-text">"{review.review}"</p>
        
        <div className="card-footer">
          <span className="review-date">⏰ 2 weeks ago</span>
        </div>
      </div>
    );
  };
  return (
    <section className="fourth-section" ref={sectionRef}>
      <div className="reviews-container">        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Wall of love</span> 💖
          </h2>
          <p className="section-subtitle">Latest reviews from our customers</p>
          <div className="rating-summary">
            <div className="stars-display">
              {renderStars(5)}
            </div>
            <span className="rating-text">5.0 rating of 200+ reviews</span>
          </div>
        </div>

        <div className="reviews-wrapper">
          {/* First row - moving left */}
          <div className="reviews-row row-left">
            <div className="reviews-track" ref={leftTrackRef}>
              {[...reviewsRow1, ...reviewsRow1].map((review, index) => (
                <ReviewCard key={`${review.id}-${index}`} review={review} />
              ))}
            </div>
          </div>

          {/* Second row - moving right */}
          <div className="reviews-row row-right">
            <div className="reviews-track" ref={rightTrackRef}>
              {[...reviewsRow2, ...reviewsRow2].map((review, index) => (
                <ReviewCard key={`${review.id}-${index}`} review={review} />
              ))}
            </div>
          </div>
        </div>

        <div className="cta-section">
          <button
            className="leave-review-btn"
            onClick={() => navigate('/contact')}
            aria-label="Go to contact page to leave a review"
          >
            Leave us a review
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fourth;
