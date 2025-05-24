import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CartContext } from '../context/CartContext';
import Review from './Review';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
        
        // Buscar avaliações
        const reviewsRef = doc(db, "products", id, "reviews");
        const reviewsSnap = await getDoc(reviewsRef);
        if (reviewsSnap.exists()) {
          setReviews(reviewsSnap.data().items || []);
        }
      }
      setLoading(false);
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!product) return <div>Produto não encontrado</div>;

  return (
    <div className="product-detail">
      <div className="product-info">
        <img src={product.image} alt={product.name} />
        <div>
          <h1>{product.name}</h1>
          <p className="price">R$ {product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
        </div>
      </div>
      
      <div className="product-reviews">
        <h2>Avaliações</h2>
        {reviews.length === 0 ? (
          <p>Nenhuma avaliação ainda</p>
        ) : (
          reviews.map((review, index) => (
            <Review key={index} review={review} />
          ))
        )}
        <ReviewForm productId={id} setReviews={setReviews} />
      </div>
    </div>
  );
};

export default ProductDetail;