import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/profile')
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data);
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      if (res.data.success) {
        const newToken = res.data.data.token;
        const userData = res.data.data.user;
        
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const hasPrivilege = (privilegeSlug) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) =>
      role.privileges?.some((priv) => priv.slug === privilegeSlug)
    );
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPrivilege }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);