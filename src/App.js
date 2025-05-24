import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '/src/context/AuthContext';
import { CartProvider } from '/src/context/CartContext';
import { WishlistProvider } from '/src/context/WishlistContext';
import Header from '/src/components/Header';
import Footer from '/src/components/Footer';
import LoadingSpinner from '/src/components/LoadingSpinner';
import ErrorBoundary from '/src/components/ErrorBoundary';

// Lazy loading para páginas
const Home = lazy(() => import('/src/pages/Home'));
const Products = lazy(() => import('/src/pages/Products'));
const ProductDetail = lazy(() => import('/src/components/ProductDetail'));
const Cart = lazy(() => import('/src/components/Cart'));
const Checkout = lazy(() => import('/src/pages/Checkout'));
const Orders = lazy(() => import('/src/pages/Orders'));
const OrderDetail = lazy(() => import('/src/pages/OrderDetail'));
const Wishlist = lazy(() => import('/src/pages/Wishlist'));
const Contact = lazy(() => import('/src/pages/Contact'));
const AuthModal = lazy(() => import('/src/components/AuthModal'));
const Admin = lazy(() => import('/src/pages/Admin'));
const NotFound = lazy(() => import('/src/pages/NotFound'));

function App() {
  return (
    <Router basename="/">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app" role="application">
              <Header />
              
              <main className="main-content" role="main">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner fullPage />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/produtos" element={<Products />} />
                      <Route path="/produto/:id" element={<ProductDetail />} />
                      <Route path="/carrinho" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/pedidos" element={<Orders />} />
                      <Route path="/pedidos/:id" element={<OrderDetail />} />
                      <Route path="/favoritos" element={<Wishlist />} />
                      <Route path="/contato" element={<Contact />} />
                      <Route path="/login" element={<AuthModal />} />
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>

              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;