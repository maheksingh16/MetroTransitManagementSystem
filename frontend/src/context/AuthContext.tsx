import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import type { User, Role } from '../types';
import { getAuthToken, setAuthToken, login as apiLogin, getUserById, getAllUsers } from '../lib/api';

interface JwtPayload {
  sub: string;
  role: Role;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const payload = useMemo(() => (token ? parseJwt(token) : null), [token]);
  const role = payload?.role ?? null;

  const loadUser = async (currentToken: string) => {
    try {
      const parsed = parseJwt(currentToken);
      if (!parsed || isTokenExpired(currentToken)) {
        logout();
        return;
      }
      // We need the user ID. The JWT subject is the email, so we cannot directly fetch by ID.
      // We store the user object in localStorage on login for convenience.
      const storedUser = localStorage.getItem('metro_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        // Refresh user details in background; if the account no longer exists, force logout.
        try {
          const refreshed = await getUserById(parsedUser.id);
          setUser(refreshed);
          localStorage.setItem('metro_user', JSON.stringify(refreshed));
        } catch (err) {
          const status = (err as AxiosError).response?.status;
          if (status === 401 || status === 404) {
            logout();
            return;
          }
          // Ignore other refresh errors and keep the stored user.
        }
      } else {
        setUser(null);
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const jwt = await apiLogin(email, password);
    if (isTokenExpired(jwt)) {
      throw new Error('Received an expired token. Please try again.');
    }
    setAuthToken(jwt);
    setTokenState(jwt);
    const parsed = parseJwt(jwt);
    if (!parsed) {
      throw new Error('Invalid authentication token.');
    }
    // Try to find existing user by email by fetching all users (not ideal but no search endpoint)
    // For passenger login, the email is the username. We'll fetch the user list to find the ID.
    // This is a one-time operation after login.
    try {
      const users = await getAllUsers();
      const matched = users.find((u) => u.email === parsed.sub);
      if (matched) {
        setUser(matched);
        localStorage.setItem('metro_user', JSON.stringify(matched));
      } else {
        throw new Error('User account not found.');
      }
    } catch {
      setAuthToken(null);
      setTokenState(null);
      throw new Error('Unable to retrieve your account. Please try again.');
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('metro_user');
  };

  const refreshUser = async () => {
    if (!user) return;
    const refreshed = await getUserById(user.id);
    setUser(refreshed);
    localStorage.setItem('metro_user', JSON.stringify(refreshed));
  };

  const value: AuthContextType = {
    user,
    token,
    role,
    isLoading,
    isAuthenticated: !!token && !!user && !isTokenExpired(token),
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function hasRole(role: Role | null, allowed: Role[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}
