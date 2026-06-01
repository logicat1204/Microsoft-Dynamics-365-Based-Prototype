import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Finance from './pages/Finance';
import SupplyChain from './pages/SupplyChain';
import Commerce from './pages/Commerce';
import ProjectOps from './pages/ProjectOps';
import HumanResources from './pages/HumanResources';
import BusinessCentral from './pages/BusinessCentral';
import Login from './pages/Login';
import './App.css';

// Componente para proteger rutas - redirige al login si no hay usuario autenticado
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout principal con Sidebar y TopBar
const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="page-viewport">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta de Login (sin layout) */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas (con layout principal) */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout><Home /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/finance" element={
            <ProtectedRoute>
              <MainLayout><Finance /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/supplychain" element={
            <ProtectedRoute>
              <MainLayout><SupplyChain /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/commerce" element={
            <ProtectedRoute>
              <MainLayout><Commerce /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/project" element={
            <ProtectedRoute>
              <MainLayout><ProjectOps /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/hr" element={
            <ProtectedRoute>
              <MainLayout><HumanResources /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/businesscentral" element={
            <ProtectedRoute>
              <MainLayout><BusinessCentral /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Ruta catch-all - redirige segun autenticacion */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
