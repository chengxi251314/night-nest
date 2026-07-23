"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function AuthButton() {
  const { user, ready, login, register, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    const err = mode === "login" ? await login(email, password) : await register(email, password);
    if (err) setError(err);
    else { setShowForm(false); setEmail(""); setPassword(""); }
  }

  if (!ready) return <div style={{ width: 60 }} />;

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #ff8ec7, #8f7cff)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
          {user.email[0].toUpperCase()}
        </div>
        <button onClick={logout} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#8a87a0", fontSize: 12 }}>退出</button>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setShowForm(!showForm)} style={{ padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg, rgba(143,124,255,0.2), rgba(255,142,199,0.15))", border: "1px solid rgba(143,124,255,0.2)", color: "#fff" }}>登录</button>
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "rgba(20,20,50,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28, width: 320, maxWidth: "90vw", backdropFilter: "blur(40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <h3 style={{ marginBottom: 18, fontSize: 18, fontWeight: 700 }}>{mode === "login" ? "登录" : "注册"}</h3>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱" autoFocus style={inp} />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="密码" style={{ ...inp, marginTop: 10 }} onKeyDown={e => e.key === "Enter" && submit()} />
            {error && <p style={{ color: "#ff7b93", fontSize: 12, marginTop: 8 }}>{error}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={submit} style={{ flex: 1, padding: "12px", borderRadius: 16, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 15, boxShadow: "0 4px 16px rgba(143,124,255,0.3)" }}>{mode === "login" ? "登录" : "注册"}</button>
              <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ padding: "12px 18px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", color: "#8a87a0", fontSize: 13 }}>{mode === "login" ? "注册" : "登录"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = { width: "100%", padding: "13px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#f0edf6", fontSize: 14, outline: "none" } as const;
