import React from 'react';

const Review = ({ review }) => {
  return (
    <div className="review">
      <div className="review-header">
        <h4>{review.userName}</h4>
        <div className="rating">
          {Array(5).fill().map((_, i) => (
            <span key={i} className={i < review.rating ? 'star-filled' : 'star-empty'}>★</span>
          ))}
        </div>
      </div>
      <p>{review.comment}</p>
      <small>{new Date(review.date).toLocaleDateString()}</small>
    </div>
  );
};

export default Review;
