import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('aims_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aims_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aims_user');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual API call
    // Mock login for demo purposes
    if (username && password) {
      const mockUser: User = {
        id: '1',
        username,
        email: `${username}@aims.com`,
        roles: ['administrator', 'product_manager'],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

