import React, { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { WishlistContext } from './context/WishlistContext';
import ProductCard from './components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "products"),
          where("__name__", "in", wishlist)
        );
        
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1>Meus Favoritos</h1>
        
        {products.length === 0 ? (
          <div className="empty-wishlist">
            <p>Sua lista de favoritos está vazia</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;