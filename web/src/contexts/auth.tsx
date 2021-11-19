import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

type  User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User |  null;
  signInUrl: string;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)

  const signInUrl = 'https://github.com/login/oauth/authorize?scope=user&client_id=418f8f7d86612354479e';

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    const { token, user } = response.data;

    //salvar o token no local storage
    localStorage.setItem('@dowille:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

   setUser(user);
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@dowille:token')
  }

  //manter os dados do usuário sem perder quando faz reload
  useEffect(() => {
    //busca o token do usuário no localStorage e salvar os dados
    const token = localStorage.getItem('@dowille:token')

    if (token) {
      //mandar o token de autenticao pelo header
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  }, [])


  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')
      //remover o código url da barra do navegador
      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode)

    }
  }, [])
  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}