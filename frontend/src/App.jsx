import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Finance from './pages/Finance';
import SupplyChain from './pages/SupplyChain';
import Commerce from './pages/Commerce';
import ProjectOps from './pages/ProjectOps';
import HumanResources from './pages/HumanResources';
import BusinessCentral from './pages/BusinessCentral';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Workspace */}
        <div className="main-content">
          
          {/* Top Corporate Navbar */}
          <header className="navbar flex align-center justify-between">
            <div className="nav-left flex align-center gap-sm">
              <span>Microsoft Dynamics 365</span>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Entorno de Producción</span>
            </div>
            
            <div className="nav-right">
              <div className="user-profile">
                <div className="user-avatar flex align-center justify-center">
                  <span>AD</span>
                </div>
                <div className="user-info">
                  <span className="user-name">Administrador ERP</span>
                  <span className="user-role">SIS315 - Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Router Viewport */}
          <main className="page-viewport">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/supplychain" element={<SupplyChain />} />
              <Route path="/commerce" element={<Commerce />} />
              <Route path="/project" element={<ProjectOps />} />
              <Route path="/hr" element={<HumanResources />} />
              <Route path="/businesscentral" element={<BusinessCentral />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}

export default App;
