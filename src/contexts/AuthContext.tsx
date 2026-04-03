import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/user";
import { login, logout as apiLogout, LoginCredentials, SignUpData, signUp } from "../api/auth";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signUp: (data: SignUpData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile) {
          const user: User = {
            id: session.user.id,
            email: profile.email,
            fullName: profile.full_name,
            tenantId: profile.tenant_id,
            pharmacyName: profile.pharmacy_name,
            pharmacyInitials: profile.pharmacy_initials,
          };
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("tenantId", user.tenantId);
        }
      } else {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const parsed = JSON.parse(rawUser) as User;
          setUser(parsed);
        }
      }
    } catch (error) {
      console.error("Erreur de vérification d'authentification:", error);
      setUser(null);
    } finally {
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
        return true;
      }
      return false;
    } catch (error) {
      console.error("Échec de connexion:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await signUp(data);
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Échec d'inscription:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setUser(null);
    await apiLogout();
    window.location.href = "/";
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (event === 'SIGNED_IN' && session?.user) {
            await checkAuthStatus();
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("tenantId");
            localStorage.removeItem("accessToken");
          }
        })();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    signUp: handleSignUp,
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
