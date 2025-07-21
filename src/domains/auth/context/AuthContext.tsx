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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@company.com",
    role: "admin",
    permissions: ["all"],
    department: "IT",
    employeeId: "EMP001",
  },
  {
    id: "2",
    name: "Sarah HR",
    email: "hr@company.com",
    role: "hr",
    permissions: ["employees", "leave", "payroll", "performance"],
    department: "Human Resources",
    employeeId: "EMP002",
  },
  {
    id: "3",
    name: "Mike Manager",
    email: "manager@company.com",
    role: "manager",
    permissions: ["team", "tasks", "attendance"],
    department: "Engineering",
    employeeId: "EMP003",
  },
  {
    id: "4",
    name: "Alice Employee",
    email: "employee@company.com",
    role: "employee",
    permissions: ["self"],
    department: "Engineering",
    employeeId: "EMP004",
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("token")
  );

  const router = useRouter();
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser && password === "password") {
      // ✅ Set cookie for middleware
      Cookies.set("token", `${foundUser.role}-token`, { expires: 7 });

      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
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
      value={{ user, login, logout, isAuthenticated, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};
