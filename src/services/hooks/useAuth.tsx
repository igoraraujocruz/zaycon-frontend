import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { setCookie, destroyCookie } from 'nookies';
import { api } from '../apiClient';

type SignInCredentials = {
  username: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'snap.token', { path: '/' });
  destroyCookie(undefined, 'snap.refreshToken', { path: '/' });

  authChannel.postMessage('signOut');

  Router.push('/admin');
}

function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    authChannel = new BroadcastChannel('auth');
    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          Router.push('/admin');
          break;
        default:
          break;
      }
    };
  }, []);

  async function signIn({ username, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        username,
        password,
      });

      const { token, refreshToken, user } = response.data;

      setCookie(undefined, 'snap.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setCookie(undefined, 'snap.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/admin/products');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
