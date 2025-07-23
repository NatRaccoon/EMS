"use client";
import { User } from "@/shared/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  mustChangePassword: boolean;
  setPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("token")
  );
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      setMustChangePassword(!!parsed.mustChangePassword);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch('http://localhost:3001/users');
    const users: User[] = await res.json();
    const foundUser = users.find((u) => u.email === email);
    if (foundUser && password === foundUser.password) {
      Cookies.set("token", `${foundUser.role}-token`, { expires: 7 });
      setUser(foundUser);
      setIsAuthenticated(true);
      setMustChangePassword(!!foundUser.mustChangePassword);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const setPassword = async (newPassword: string) => {
    if (!user) return;
    const res = await fetch(`http://localhost:3001/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword, mustChangePassword: false }),
    });
    const updated = await res.json();
    setUser(updated);
    setMustChangePassword(false);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    Cookies.remove("token"); // ✅ Remove cookie
    router.push('/auth/login'); // Redirect user
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes("all")) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, hasPermission, mustChangePassword, setPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
