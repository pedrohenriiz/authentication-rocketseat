import React, { createContext, useState } from 'react';
import Router from 'next/router';
import { setCookie } from 'nookies';
import { api } from '../services/api';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  const isAuthenticated = !!user?.email;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', { email, password });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      setCookie(undefined, 'auth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({ email, permissions, roles });

      Router.push('/dashboard');
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
