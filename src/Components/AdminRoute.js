import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.email === 'admin@loja.com'; // Ou lógica mais complexa

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;