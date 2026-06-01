import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [pinnedModules] = useState(['/', '/finance', '/businesscentral']);

  const modules = [
    { path: '/', label: 'Home', icon: '🏠', category: 'main' },
    { path: '/finance', label: 'Finance', icon: '💰', color: '#498205', category: 'erp' },
    { path: '/supplychain', label: 'Supply Chain', icon: '📦', color: '#0078D4', category: 'erp' },
    { path: '/commerce', label: 'Commerce', icon: '🛒', color: '#FF8C00', category: 'erp' },
    { path: '/project', label: 'Project Operations', icon: '📊', color: '#8B4513', category: 'erp' },
    { path: '/hr', label: 'Human Resources', icon: '👥', color: '#7B68EE', category: 'erp' },
    { path: '/businesscentral', label: 'Business Central', icon: '🏢', color: '#008272', category: 'erp' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <rect x="3" y="3" width="8" height="8" rx="1"/>
            <rect x="13" y="3" width="8" height="8" rx="1"/>
            <rect x="3" y="13" width="8" height="8" rx="1"/>
            <rect x="13" y="13" width="8" height="8" rx="1"/>
          </svg>
        </div>
        <div className="brand-title-group">
          <span className="brand-title">Dynamics 365</span>
          <span className="brand-subtitle">SIS315 Prototipo</span>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search"
          className="sidebar-search-input"
        />
      </div>

      {/* Recently visited */}
      <div className="sidebar-section">
        <div className="section-header">
          <span>Recent</span>
        </div>
        <NavLink to="/" end className="menu-item">
          <span className="menu-icon">🏠</span>
          <span className="menu-label">Home</span>
        </NavLink>
        <NavLink to="/finance" className="menu-item">
          <span className="menu-icon" style={{ color: '#498205' }}>💰</span>
          <span className="menu-label">Finance</span>
        </NavLink>
      </div>

      {/* Pinned */}
      <div className="sidebar-section">
        <div className="section-header">
          <span>Pinned</span>
        </div>
        <NavLink to="/finance" className="menu-item">
          <span className="menu-icon" style={{ color: '#498205' }}>📊</span>
          <span className="menu-label">Dashboards</span>
        </NavLink>
        <NavLink to="/businesscentral" className="menu-item">
          <span className="menu-icon" style={{ color: '#008272' }}>📈</span>
          <span className="menu-label">Workspaces</span>
        </NavLink>
      </div>

      {/* ERP Modules */}
      <div className="sidebar-section">
        <div className="section-header">
          <span>Módulos ERP</span>
        </div>
        {modules.filter(m => m.category === 'erp').map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { borderLeftColor: m.color } : {}}
          >
            <span className="menu-icon" style={{ color: m.color }}>{m.icon}</span>
            <span className="menu-label">{m.label}</span>
            <span className="module-dot" style={{ backgroundColor: m.color }}></span>
          </NavLink>
        ))}
      </div>

      {/* Copilot Footer */}
      <div className="sidebar-footer">
        <div className="copilot-pill">
          <span className="copilot-icon">✨</span>
          <div className="copilot-text">
            <strong>Copilot</strong>
            <small>PREVIEW</small>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
