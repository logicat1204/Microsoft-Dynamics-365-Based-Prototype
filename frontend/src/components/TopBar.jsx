import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './TopBar.css';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLegalEntityMenu, setShowLegalEntityMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [currentEntity, setCurrentEntity] = useState('USMF - Contoso USA');
  const [showCopilot, setShowCopilot] = useState(false);

  const profileRef = useRef(null);
  const legalRef = useRef(null);
  const helpRef = useRef(null);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (legalRef.current && !legalRef.current.contains(event.target)) {
        setShowLegalEntityMenu(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelpMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const legalEntities = [
    { code: 'USMF', name: 'Contoso USA, Inc.', location: 'Seattle, WA' },
    { code: 'CRONUS', name: 'CRONUS USA, Inc.', location: 'New York, NY' },
    { code: 'DEMF', name: 'Contoso Demo Company', location: 'Los Angeles, CA' },
    { code: 'GBSI', name: 'Contoso Global Services', location: 'London, UK' },
  ];

  return (
    <header className="topbar">
      {/* Breadcrumb de navegación */}
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="breadcrumb-item breadcrumb-home">🏠</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item breadcrumb-product">Microsoft Dynamics 365</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item breadcrumb-environment">Entorno de Producción</span>
        </div>
      </div>

      {/* Centro: Entidad Legal */}
      <div className="topbar-center" ref={legalRef}>
        <button
          className="legal-entity-button"
          onClick={() => setShowLegalEntityMenu(!showLegalEntityMenu)}
        >
          <span className="legal-entity-icon">🏢</span>
          <span className="legal-entity-text">{currentEntity}</span>
          <span className="dropdown-arrow">▾</span>
        </button>

        {showLegalEntityMenu && (
          <div className="dropdown-menu legal-entity-menu">
            <div className="dropdown-header">Cambiar entidad legal</div>
            {legalEntities.map((entity) => (
              <button
                key={entity.code}
                className={`dropdown-item ${currentEntity.startsWith(entity.code) ? 'active' : ''}`}
                onClick={() => {
                  setCurrentEntity(`${entity.code} - ${entity.name}`);
                  setShowLegalEntityMenu(false);
                }}
              >
                <div className="entity-info">
                  <strong>{entity.code}</strong> - {entity.name}
                  <small>{entity.location}</small>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Derecha: Búsqueda, Copilot, Ayuda, Perfil */}
      <div className="topbar-right">
        {/* Búsqueda */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search for a page"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Botón Copilot */}
        <button
          className="topbar-icon-button copilot-button"
          onClick={() => setShowCopilot(!showCopilot)}
          title="Copilot (AI Assistant)"
        >
          <span className="copilot-icon">✨</span>
          <span className="copilot-label">Copilot</span>
        </button>

        {/* Ayuda */}
        <div className="topbar-icon-wrapper" ref={helpRef}>
          <button
            className="topbar-icon-button"
            onClick={() => setShowHelpMenu(!showHelpMenu)}
            title="Ayuda"
          >
            <span className="help-icon">?</span>
          </button>
          {showHelpMenu && (
            <div className="dropdown-menu help-menu">
              <div className="dropdown-header">Ayuda y soporte</div>
              <button className="dropdown-item">
                <span>📚</span> Documentación
              </button>
              <button className="dropdown-item">
                <span>🎓</span> Tutoriales
              </button>
              <button className="dropdown-item">
                <span>💬</span> Contactar soporte
              </button>
              <button className="dropdown-item">
                <span>⌨️</span> Atajos de teclado
              </button>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item-info">
                <small>SIS315 v1.0.0 - Prototipo</small>
              </div>
            </div>
          )}
        </div>

        {/* Notificaciones */}
        <button className="topbar-icon-button" title="Notificaciones">
          <span className="notif-icon">🔔</span>
          <span className="notif-badge">3</span>
        </button>

        {/* Perfil de usuario */}
        <div className="user-profile" ref={profileRef} onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <div className="user-avatar">
            <span>{user?.initials || 'U'}</span>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuario'}</span>
            <span className="user-role">{user?.role || 'Invitado'}</span>
          </div>
          <span className="dropdown-arrow">▾</span>

          {showProfileMenu && (
            <div className="dropdown-menu profile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="profile-menu-header">
                <div className="user-avatar large">
                  <span>{user?.initials || 'U'}</span>
                </div>
                <div>
                  <strong>{user?.name}</strong>
                  <small>{user?.email || `${user?.username}@dynamics365.com`}</small>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <span>👤</span> Mi perfil
              </button>
              <button className="dropdown-item">
                <span>⚙️</span> Configuración
              </button>
              <button className="dropdown-item">
                <span>🔔</span> Notificaciones
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={logout}>
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
