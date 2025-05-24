import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';

const ReviewForm = ({ productId, setReviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || rating === 0) return;
    
    setSubmitting(true);
    const newReview = {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anônimo',
      rating,
      comment,
      date: new Date().toISOString()
    };

    try {
      const reviewRef = doc(db, "products", productId, "reviews", "data");
      await setDoc(reviewRef, {
        items: arrayUnion(newReview)
      }, { merge: true });
      
      setReviews(prev => [...prev, newReview]);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Error adding review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Deixe sua avaliação</h3>
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star-filled' : 'star-empty'}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escreva sua avaliação..."
        required
      />
      <button type="submit" disabled={submitting || rating === 0}>
        {submitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
};

export default ReviewForm;