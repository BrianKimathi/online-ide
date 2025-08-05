import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(api.getToken());
  const [loading, setLoading] = useState(false); // for login/register
  const [loadingUser, setLoadingUser] = useState(true); // for initial user fetch
  const [error, setError] = useState(null);

  // Fetch user profile if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        setLoadingUser(true);
        try {
          const data = await api.getMe();
          setUser(data);
        } catch {
          setUser(null);
        } finally {
          setLoadingUser(false);
        }
      } else {
        setUser(null);
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setLoading(true); setError(null);
    try {
      const data = await api.register({ username, email, password });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loadingUser, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 