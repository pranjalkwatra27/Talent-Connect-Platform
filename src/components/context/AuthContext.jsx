import { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  const signup = async (email, password, displayName, role = 'client', city = '', phone = '') => {
    try {
      setLoading(true);
      const data = await api.register({ name: displayName, email, password, role, city, phone });
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await api.login(email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updatedUser = await api.updateUserProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  const verifyArtist = async () => {
    await api.submitVerification();
    setUser(prev => prev ? { ...prev, isVerified: true } : null);
  };

  const upgradeToArtist = async () => {
    const updatedUser = await api.upgradeToArtist();
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    verifyArtist,
    upgradeToArtist,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
