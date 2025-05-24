import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such order!");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  if (loading) return <div className="loading">Carregando pedido...</div>;
  if (!order) return <div className="not-found">Pedido não encontrado</div>;

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link">
          &larr; Voltar para Meus Pedidos
        </Link>
        
        <h1>Detalhes do Pedido #{order.id.slice(0, 8)}</h1>
        
        <div className="order-info">
          <div className="info-row">
            <span>Status:</span>
            <span className={`status ${order.status}`}>
              {order.status === 'pending' ? 'Pendente' : 
               order.status === 'paid' ? 'Pago' : 'Enviado'}
            </span>
          </div>
          <div className="info-row">
            <span>Data:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <span>Total:</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="order-items">
          <h2>Itens do Pedido</h2>
          <ul>
            {order.items.map((item, index) => (
              <li key={index} className="item">
                <div className="item-info">
                  <span className="quantity">{item.quantity}x</span>
                  <span className="name">{item.name}</span>
                  <span className="price">R$ {item.price.toFixed(2)}</span>
                </div>
                <div className="item-total">
                  Subtotal: R$ {(item.quantity * item.price).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {order.status === 'pending' && (
          <div className="payment-actions">
            <h2>Finalizar Pagamento</h2>
            <p>Seu pedido está aguardando pagamento.</p>
            {/* Aqui será adicionado o botão do PayPal posteriormente */}
            <button className="btn-pay" disabled>
              Pagar com PayPal (em breve)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;