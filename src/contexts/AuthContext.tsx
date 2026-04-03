import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/user";
import { login, LoginCredentials } from "../api/auth";
import { DEV_MODE } from "../lib/devMode";

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

const isValidUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== "object") return false;
  const u = obj as Record<string, unknown>;
  return typeof u.id === "string" && typeof u.email === "string";
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = DEV_MODE || !!user;

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("accessToken");
    const tenantId = localStorage.getItem("tenantId");
    const rawUser = localStorage.getItem("user");
    if (token && tenantId) {
      try {
        if (rawUser) {
          const parsed: unknown = JSON.parse(rawUser);
          setUser(isValidUser(parsed) ? parsed : null);
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
    }
  };

  const handleLogin = async (
    credentials: LoginCredentials
  ): Promise<boolean> => {
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
      console.error("Login failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Clearing user state is enough — RouteGuard listens to isAuthenticated
  // and redirects to /login when on a protected route.
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("user");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
