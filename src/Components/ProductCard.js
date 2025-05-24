import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '/src/context/CartContext';
import { WishlistContext } from '/src/context/WishlistContext';
import LazyImage from '/src/components/LazyImage';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, updateWishlist } = useContext(WishlistContext);

  return (
    <article 
      className="product-card" 
      itemScope 
      itemType="https://schema.org/Product"
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className="product-image-container">
        <Link to={`/produto/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
          <LazyImage
            src={`/images/products/${product.id}.webp`}
            alt={product.name}
            placeholder="/images/placeholder.webp"
            width="300"
            height="300"
          />
        </Link>
        
        <button 
          className={`wishlist-button ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={() => updateWishlist(product.id)}
          aria-label={isInWishlist(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          ♥
        </button>
      </div>

      <div className="product-info">
        <h3 id={`product-title-${product.id}`} itemProp="name">{product.name}</h3>
        
        <div className="product-meta" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span className="price" itemProp="price" content={product.price}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          <meta itemProp="priceCurrency" content="BRL" />
          <link itemProp="availability" href={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
        </div>

        <div className="product-actions">
          <button 
            className="btn btn-add-to-cart"
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            aria-label="Adicionar ao carrinho"
          >
            {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}
          </button>
          
          <Link 
            to={`/produto/${product.id}`} 
            className="btn btn-details"
            aria-label={`Ver detalhes de ${product.name}`}
          >
            Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;