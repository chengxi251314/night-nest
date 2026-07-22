"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

type User = { id: string; email: string } | null;

const AuthCtx = createContext<{
  user: User; token: string | null; ready: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}>({ user: null, token: null, ready: false, login: async () => null, register: async () => null, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nn_token");
    if (saved) {
      setToken(saved);
      fetch(`${API}/v1/auth/me`, { headers: { Authorization: `Bearer ${saved}` } })
        .then(r => r.json())
        .then(d => { if (d.user) setUser(d.user); else { setToken(null); localStorage.removeItem("nn_token"); } })
        .finally(() => setReady(true));
    } else { setReady(true); }
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${API}/v1/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
    });
    if (!res.ok) return "网络错误";
    const data = await res.json();
    if (data.error) return data.error;
    localStorage.setItem("nn_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return null;
  }

  async function register(email: string, password: string) {
    const res = await fetch(`${API}/v1/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
    });
    if (!res.ok) return "网络错误";
    const data = await res.json();
    if (data.error) return data.error;
    localStorage.setItem("nn_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return null;
  }

  function logout() {
    localStorage.removeItem("nn_token");
    setToken(null);
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, token, ready, login, register, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
