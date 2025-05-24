import React, { useContext } from 'react';
import { WishlistContext } from './context/WishlistContext';

const WishlistButton = ({ productId }) => {
  const { updateWishlist, isInWishlist } = useContext(WishlistContext);

  return (
    <button 
      className={`wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
      onClick={() => updateWishlist(productId)}
      aria-label={isInWishlist(productId) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <i className={`fas fa-heart ${isInWishlist(productId) ? 'solid' : 'regular'}`}></i>
    </button>
  );
};

export default WishlistButton;