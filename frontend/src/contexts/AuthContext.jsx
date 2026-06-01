import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Credenciales hardcoded para el prototipo
const VALID_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrador ERP', role: 'SIS315 - Admin', initials: 'AD' },
  { username: 'usuario', password: 'user123', name: 'Usuario Demo', role: 'SIS315 - User', initials: 'UD' },
  { username: 'contoso', password: 'demo2026', name: 'Contoso Sales', role: 'USMF - Sales', initials: 'CS' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('dynamics365_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('dynamics365_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));

    const foundUser = VALID_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = {
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role,
        initials: foundUser.initials,
      };
      setUser(userData);
      localStorage.setItem('dynamics365_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Usuario o contraseña incorrectos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dynamics365_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
