import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { addDocument } from '../firebase/config';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert('Por favor, faça login para finalizar a compra');
      return;
    }

    try {
      // Criar a ordem no Firestore
      const orderData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const orderId = await addDocument('orders', orderData);
      
      if (orderId) {
        // Aqui você pode adicionar a integração com o PayPal depois
        // Por enquanto, apenas limpa o carrinho
        clearCart();
        alert(`Pedido #${orderId} criado com sucesso!`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert('Erro ao processar o pedido');
    }
  };

  return (
    <div className="cart">
      <h2>Seu Carrinho</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio</p>
          <Link to="/products" className="btn">Ver Produtos</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>R$ {item.price.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn-remove"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Frete:</span>
              <span>Grátis</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="btn-checkout"
            >
              Finalizar Compra
            </button>
            
            <small className="payment-info">
              * O pagamento será processado na próxima etapa
            </small>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;