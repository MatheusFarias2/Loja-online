import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>R$ {product.price.toFixed(2)}</p>
      <div className="product-actions">
        <Link to={`/products/${product.id}`} className="btn-details">
          Ver Detalhes
        </Link>
        <button className="btn-add-to-cart">Adicionar ao Carrinho</button>
      </div>
    </div>
  );
};

export default ProductCard;