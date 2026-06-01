import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Si ya está autenticado, redirigir al home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };

  const fillDemo = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                <rect x="3" y="3" width="8" height="8" rx="1"/>
                <rect x="13" y="3" width="8" height="8" rx="1"/>
                <rect x="3" y="13" width="8" height="8" rx="1"/>
                <rect x="13" y="13" width="8" height="8" rx="1"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Microsoft Dynamics 365</h1>
              <p>SIS315 - Prototipo ERP</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar Sesión</h2>
          <p className="form-subtitle">Accede a tu entorno de producción</p>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="demo-credentials">
            <p className="demo-title">Cuentas de demostración:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('admin', 'admin123')}
              >
                <strong>admin</strong> / admin123
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('usuario', 'user123')}
              >
                <strong>usuario</strong> / user123
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('contoso', 'demo2026')}
              >
                <strong>contoso</strong> / demo2026
              </button>
            </div>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2026 Microsoft Dynamics 365 - Prototipo Académico SIS315</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
