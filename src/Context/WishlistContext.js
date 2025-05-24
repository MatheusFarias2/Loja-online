import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const docRef = doc(db, "wishlists", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setWishlist(docSnap.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const updateWishlist = async (productId) => {
    if (!auth.currentUser) {
      alert('Faça login para adicionar aos favoritos');
      return;
    }

    try {
      const userRef = doc(db, "wishlists", auth.currentUser.uid);
      
      if (wishlist.includes(productId)) {
        await updateDoc(userRef, {
          items: arrayRemove(productId)
        });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await setDoc(userRef, {
          items: arrayUnion(productId)
        }, { merge: true });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const value = {
    wishlist,
    loading,
    updateWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}