import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const modules = [
    { path: '/finance', label: 'Finance', icon: '💰' },
    { path: '/supplychain', label: 'Supply Chain', icon: '📦' },
    { path: '/commerce', label: 'Commerce', icon: '🛒' },
    { path: '/project', label: 'Project Operations', icon: '📊' },
    { path: '/hr', label: 'Human Resources', icon: '👥' },
    { path: '/businesscentral', label: 'Business Central', icon: '🏢' },
  ];

  return (
    <div className="sidebar flex flex-col">
      <div className="sidebar-brand flex align-center gap-sm">
        <span className="brand-logo">D365</span>
        <div className="brand-title-group">
          <span className="brand-title">Dynamics 365</span>
          <span className="brand-subtitle">SIS315 Prototipo</span>
        </div>
      </div>
      
      <div className="sidebar-menu flex-col w-full">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `menu-item flex align-center gap-sm ${isActive ? 'active' : ''}`}
        >
          <span className="menu-icon">🏠</span>
          <span className="menu-label">Inicio Dashboard</span>
        </NavLink>

        <div className="menu-separator">MÓDULOS ERP</div>

        {modules.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) => `menu-item flex align-center gap-sm ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">{m.icon}</span>
            <span className="menu-label">{m.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="copilot-pill flex align-center gap-sm">
          <span className="copilot-sparkle">✨</span>
          <span>Copilot Activo</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
