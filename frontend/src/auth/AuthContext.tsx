import { useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';
import { api } from '../lib/api';
import { AuthContext } from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  function login(user: AuthUser) {
    setUser(user);
  }

  async function logout() {
    await api.post('/auth/logout').catch(() => undefined);
    sessionStorage.removeItem('tvet_provider_form');
    sessionStorage.removeItem('tvet_college_upload');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
