import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('quantum_colony_token');
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem('quantum_colony_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('quantum_colony_token', res.access_token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await api.register(name, email, password, role);
    localStorage.setItem('quantum_colony_token', res.access_token);
    setUser(res.user);
    return res.user;
  };

  const demoLogin = async (role) => {
    const res = await api.demoLogin(role);
    localStorage.setItem('quantum_colony_token', res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('quantum_colony_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
