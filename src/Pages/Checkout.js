import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '/src/context/CartContext';
import { AuthContext } from '/src/context/AuthContext';
import { db, auth } from '/src/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import CouponInput from '/src/components/CouponInput';
import ShippingForm from '/src/components/ShippingForm';
import PaymentMethod from '/src/components/PaymentMethod';
import OrderSummary from '/src/components/OrderSummary';

const Checkout = () => {
  const { cart, finalTotal, clearCart, coupon } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [shippingData, setShippingData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPaypal = async () => {
      try {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=BRL`;
        script.async = true;
        script.onload = () => setPaypalReady(true);
        document.body.appendChild(script);
      } catch (error) {
        console.error("Failed to load PayPal SDK", error);
      }
    };

    loadPaypal();
  }, []);

  const createOrder = async (paymentResult) => {
    setLoading(true);
    try {
      const orderData = {
        userId: currentUser?.uid || 'guest',
        userEmail: currentUser?.email || 'guest@checkout.com',
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shipping: shippingData,
        payment: {
          method: 'paypal',
          id: paymentResult.paymentID || paymentResult.id,
          status: paymentResult.status,
          update_time: new Date().toISOString()
        },
        coupon: coupon?.code || null,
        discount: coupon ? coupon.value : 0,
        subtotal: finalTotal + (coupon ? coupon.value : 0),
        total: finalTotal,
        status: 'processing',
        createdAt: serverTimestamp()
      };

      const orderRef = doc(db, 'orders', `order_${Date.now()}`);
      await setDoc(orderRef, orderData);

      clearCart();
      navigate(`/pedidos/${orderRef.id}`, { state: { success: true } });
    } catch (error) {
      console.error("Error creating order:", error);
      alert('Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>
      
      <div className="checkout-grid">
        <div className="checkout-steps">
          <ShippingForm onComplete={setShippingData} />
          
          {shippingData && (
            <PaymentMethod 
              paypalReady={paypalReady} 
              onCreateOrder={createOrder} 
              total={finalTotal}
            />
          )}
        </div>
        
        <div className="checkout-sidebar">
          <OrderSummary />
          <CouponInput />
        </div>
      </div>
    </div>
  );
};

export default Checkout;