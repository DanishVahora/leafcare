import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData:any) => Promise<User>;
  signup: (userData: any) => Promise<User>;
  logout: () => void;
  refreshUserData: () => Promise<void>; // Make sure this is included
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize auth state based on token existence
    return !!localStorage.getItem('token');
  });

  // Load user data from token
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      const response = await api.get('/users/me');
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading user', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login function
  const login = async (userData: any) => {
    try {
      let response;
      
      if (userData.accessToken) {
        // Handle Google OAuth login
        response = await api.post('/auth/oauth/login', {
          provider: 'google',
          email: userData.email,
          firstName: userData.given_name,
          lastName: userData.family_name,
          photo: userData.picture,
          accessToken: userData.accessToken
        });
      } else {
        // Handle email/password login
        response = await api.post('/auth/login', {
          email: userData.email,
          password: userData.password
        });
      }
  
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data.user;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };
  // Signup function
  const signup = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // Refresh user data function (called after actions that might change user data)
  const refreshUserData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/users/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error refreshing user data', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      refreshUserData // Include in context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};