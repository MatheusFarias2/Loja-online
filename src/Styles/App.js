import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import ProductForm from './components/ProductForm';
import AdminRoute from './components/AdminRoute';
import AuthModal from './components/AuthModal';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import './styles/main.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<AuthModal />} />
                  
                  {/* Rotas do Usuário Autenticado */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<UserProfile />} />
                  
                  {/* Rotas Administrativas */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/products/new" element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/products/edit/:id" element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  } />
                  
                  {/* Rota para páginas não encontradas */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer>
                {/* Rodapé existente */}
              </footer>
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;