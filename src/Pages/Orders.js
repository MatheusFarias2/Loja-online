import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;
      
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Carregando pedidos...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>Meus Pedidos</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Você ainda não fez nenhum pedido.</p>
            <Link to="/products" className="btn">Ver Produtos</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Pedido #{order.id.slice(0, 8)}</h3>
                  <span className={`status ${order.status}`}>
                    {order.status === 'pending' ? 'Pendente' : 
                     order.status === 'paid' ? 'Pago' : 'Enviado'}
                  </span>
                </div>
                
                <div className="order-details">
                  <div>
                    <strong>Data:</strong> 
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Total:</strong> 
                    R$ {order.total.toFixed(2)}
                  </div>
                </div>
                
                <div className="order-items">
                  <h4>Itens:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name} - R$ {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link to={`/orders/${order.id}`} className="btn-details">
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;