import React, { useState, useContext } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CartContext } from './context/CartContext';
import { auth } from '../firebase/config';

const CouponInput = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { cartTotal, applyCoupon } = useContext(CartContext);

  const validateCoupon = async () => {
    if (!code) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const docRef = doc(db, "coupons", code.toUpperCase());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Cupom inválido ou expirado");
      }
      
      const coupon = docSnap.data();
      
      // Verificar validade
      if (!coupon.isActive) {
        throw new Error("Cupom não está ativo");
      }
      
      if (new Date(coupon.expiresAt) < new Date()) {
        throw new Error("Cupom expirado");
      }
      
      if (coupon.minOrder > cartTotal) {
        throw new Error(`Mínimo de R$ ${coupon.minOrder.toFixed(2)} para usar este cupom`);
      }
      
      // Verificar se usuário já usou (se estiver logado)
      if (auth.currentUser && coupon.usedBy.includes(auth.currentUser.uid)) {
        throw new Error("Você já usou este cupom");
      }
      
      // Aplicar cupom
      applyCoupon(coupon);
      setSuccess(`Cupom aplicado: ${coupon.code}`);
      
      // Marcar como usado
      if (auth.currentUser) {
        await updateDoc(docRef, {
          usedBy: [...coupon.usedBy, auth.currentUser.uid]
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-input">
      <h4>Aplicar Cupom</h4>
      <div className="coupon-controls">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código"
        />
        <button 
          onClick={validateCoupon}
          disabled={loading}
        >
          {loading ? 'Validando...' : 'Aplicar'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default CouponInput;