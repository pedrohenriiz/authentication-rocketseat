import React, { createContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
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
  signOut(): void;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'auth.token');
  destroyCookie(undefined, 'auth.refreshToken');
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  const isAuthenticated = !!user?.email;

  useEffect(() => {
    const { 'auth.token': token } = parseCookies();

    if (token) {
      api
        .get('/me')
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

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

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
