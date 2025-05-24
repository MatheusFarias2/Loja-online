import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersSnapshot, productsSnapshot] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "products"))
        ]);

        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Painel Administrativo</h1>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Produtos
          </button>
        </div>
        
        {activeTab === 'orders' ? (
          <div className="orders-list">
            <h2>Últimos Pedidos</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.userEmail}</td>
                    <td>R$ {order.total.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/orders/${order.id}`} className="btn-view">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="products-list">
            <h2>Produtos</h2>
            <Link to="/admin/products/new" className="btn-add">
              Adicionar Novo Produto
            </Link>
            <table>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} width="50" />
                    </td>
                    <td>{product.name}</td>
                    <td>R$ {product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="btn-edit"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;