import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import AuthModal from './AuthModal';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Loja Online</h1>
          </Link>
          
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Produtos</Link></li>
              <li><Link to="/contact">Contato</Link></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            {currentUser ? (
              <div className="user-profile">
                <span>Olá, {currentUser.email}</span>
                {/* Aqui pode ter um dropdown com mais opções */}
              </div>
            ) : (
              <button 
                className="btn-login"
                onClick={() => setShowAuthModal(true)}
              >
                Login/Cadastro
              </button>
            )}
            
            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cart.length > 0 && (
                <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </header>
  );
};

export default Header;