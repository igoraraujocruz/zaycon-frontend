import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Router from 'next/router';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { api } from '../apiClient';

type User = {
  name: string;
  email: string;
  permissions: [
    {
      id: string;
      name: string;
    },
  ];
};

type SignInCredentials = {
  username: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  user: User;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'snap.token', { path: '/' });
  destroyCookie(undefined, 'snap.refreshToken', { path: '/' });

  authChannel?.postMessage('signOut');

  Router.push('/admin');
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({ permissions: [{}] } as User);
  const isAuthenticated = !!user;

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

  useEffect(() => {
    const { 'snap.token': token } = parseCookies();

    if (token) {
      api
        .get('users/get/me')
        .then(response => {
          const { email, permissions, name } = response.data;

          setUser({ email, permissions, name });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ username, password }: SignInCredentials) {
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

    setUser({
      name: user.name,
      permissions: user.permissions,
      email: user.email,
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    Router.push('/panel');
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
