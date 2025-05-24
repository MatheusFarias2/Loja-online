import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './components/ProductCard';

const Home = () => {
  // Na implementação real, esses produtos viriam do Firebase
  const featuredProducts = [
    {
      id: '1',
      name: 'Produto Destacado 1',
      price: 99.99,
      image: 'https://via.placeholder.com/300',
      description: 'Descrição breve do produto destacado'
    },
    {
      id: '2',
      name: 'Produto Destacado 2',
      price: 149.99,
      image: 'https://via.placeholder.com/300',
      description: 'Descrição breve do produto destacado'
    },
    {
      id: '3',
      name: 'Produto Destacado 3',
      price: 199.99,
      image: 'https://via.placeholder.com/300',
      description: 'Descrição breve do produto destacado'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="container">
          <h2>Bem-vindo à nossa loja</h2>
          <p>Os melhores produtos com os melhores preços</p>
          <Link to="/products" className="btn-shop-now">Compre agora</Link>
        </div>
      </section>
      
      <section className="featured-products">
        <div className="container">
          <h2>Produtos em Destaque</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-view-all">Ver todos os produtos</Link>
          </div>
        </div>
      </section>
      
      <section className="benefits">
        <div className="container">
          <div className="benefit-item">
            <i className="fas fa-truck"></i>
            <h3>Frete Grátis</h3>
            <p>Para compras acima de R$ 200,00</p>
          </div>
          <div className="benefit-item">
            <i className="fas fa-undo"></i>
            <h3>Devolução Fácil</h3>
            <p>Até 30 dias após a compra</p>
          </div>
          <div className="benefit-item">
            <i className="fas fa-lock"></i>
            <h3>Pagamento Seguro</h3>
            <p>Processado pelo PayPal</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;