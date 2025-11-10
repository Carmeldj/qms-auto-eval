import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { login, LoginCredentials } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // COMMENTED OUT AUTH - Always authenticated for development
  const isAuthenticated = true; // !!user;  

  // Check if user is already authenticated on app load
  const checkAuthStatus = async () => {
    // COMMENTED OUT AUTH - Skip auth check for development
    setIsLoading(false);
    /* const token = localStorage.getItem('accessToken');
    const tenantId = localStorage.getItem('tenantId');
    const rawUser = localStorage.getItem('user');
    if (token && tenantId) {
      // TODO: Replace this with a real API call to validate the token with your backend
      try {
        // Example: await validateToken(token)
        // If valid, restore user
        if (rawUser) {
          const parsed = JSON.parse(rawUser) as User;
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setIsLoading(false);
    } else {
      setUser(null);
      setIsLoading(false);
    } */
  };

  // Login function
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await login(credentials);
      if (userData) {
        setUser(userData);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('user');
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;