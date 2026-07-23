"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Settings, Key, LogOut, Download, Camera, Check, X, Star, Heart, Trophy, Flame, Edit3 } from "lucide-react";
import { getLLMConfig, saveLLMConfig, type LLMConfig } from "@/components/llm-settings";
import { useTheme, type Theme } from "@/lib/theme";
import { characters } from "@/lib/data";
import CropModal from "@/components/crop-modal";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

const GENDERS = [
  { v: "", l: "未设置" },
  { v: "male", l: "男" },
  { v: "female", l: "女" },
  { v: "other", l: "其他" },
];

const inp = { width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "#f0edf6", fontSize: 14, outline: "none" } as const;

type UserProfile = { id: string; email: string; nickname: string; avatar: string; gender: string; bio: string };

function SettingRow({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: "#8a87a0" }}>{label}</span>
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 3 }}>
        {options.map(o => (<button key={o.v} onClick={() => onChange(o.v)} style={{ padding: "6px 14px", borderRadius: 10, fontSize: 13, fontWeight: value === o.v ? 600 : 400, background: value === o.v ? "rgba(143,124,255,0.2)" : "transparent", color: value === o.v ? "#f0edf6" : "#8a87a0" }}>{o.l}</button>))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regNickname, setRegNickname] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [config, setConfig] = useState<LLMConfig>({ apiKey: "", baseUrl: "", model: "" });
  const [sound, setSound] = useState(true);
  const [notify, setNotify] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editBio, setEditBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSound(localStorage.getItem("nn_sound") !== "0");
    setNotify(localStorage.getItem("nn_notify") !== "0");
    const token = localStorage.getItem("nn_token");
    if (token) {
      fetch(API + "/v1/auth/me", { headers: { Authorization: "Bearer " + token } })
        .then(r => r.json()).then(d => {
          if (d.user) { setUser(d.user); localStorage.setItem("nn_profile", JSON.stringify(d.user)); }
          else { localStorage.removeItem("nn_token"); localStorage.removeItem("nn_profile"); }
        }).catch(() => {});
    }
  }, []);

  async function doLogin() {
    setErr("");
    const url = API + (mode === "login" ? "/v1/auth/login" : "/v1/auth/register");
    try {
      const r = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname: regNickname })
      });
      const d = await r.json();
      if (d.error) { setErr(d.error); return; }
      localStorage.setItem("nn_token", d.token);
      localStorage.setItem("nn_profile", JSON.stringify(d.user));
      setUser(d.user);
      setShowLogin(false);
      setEmail(""); setPassword(""); setRegNickname("");
    } catch { setErr("网络错误"); }
  }

  function doLogout() {
    localStorage.removeItem("nn_token");
    localStorage.removeItem("nn_profile");
    setUser(null);
  }

  function startEdit() {
    if (!user) return;
    setEditNickname(user.nickname || "");
    setEditGender(user.gender || "");
    setEditBio(user.bio || "");
    setEditing(true);
  }

  async function saveProfile() {
    if (!user) return;
    const token = localStorage.getItem("nn_token");
    try {
      const r = await fetch(API + "/v1/auth/profile", {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ nickname: editNickname, gender: editGender, bio: editBio })
      });
      const d = await r.json();
      if (d.user) {
        setUser(d.user);
        localStorage.setItem("nn_profile", JSON.stringify(d.user));
      }
      setEditing(false);
    } catch { /* */ }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    // Show crop modal
    setCropFile(file);
    // Reset file input so same file can be re-selected
    e.target.value = "";
  }

  async function handleCropped(blob: Blob) {
    setCropFile(null);
    setUploading(true);
    const form = new FormData();
    form.append("file", blob, "avatar.jpg");
    try {
      const r = await fetch(API + "/v1/auth/avatar", { method: "POST", body: form });
      const d = await r.json();
      if (d.avatarUrl) {
        const token = localStorage.getItem("nn_token");
        const r2 = await fetch(API + "/v1/auth/profile", {
          method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ avatar: d.avatarUrl })
        });
        const d2 = await r2.json();
        if (d2.user) {
          setUser(d2.user);
          localStorage.setItem("nn_profile", JSON.stringify(d2.user));
        }
      }
    } catch { /* */ }
    setUploading(false);
  }

  function getDisplayName(): string {
    if (user?.nickname) return user.nickname;
    if (user?.email) return user.email.split("@")[0];
    return "未登录";
  }

  function getGenderLabel(): string {
    const g = GENDERS.find(g => g.v === user?.gender);
    return g?.l || "未设置";
  }

  async function exportChat(charId: string) {
    try {
      const r = await fetch(API + "/v1/conversations/" + charId + "/seed");
      if (!r.ok) return;
      const d = await r.json();
      const text = d.messages.map((m: any) => "[" + (m.role === "user" ? "你" : characters.find(c => c.id === charId)?.name || "角色") + "] " + m.text).join("\n\n");
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "night-nest-" + charId + ".txt"; a.click();
    } catch {}
  }

  const achievements = [
    { id: "first-meet", score: 30, label: "初识之证", icon: Star, color: "#8f7cff" },
    { id: "confidant", score: 60, label: "知己之印", icon: Heart, color: "#ff8ec7" },
    { id: "devotion", score: 85, label: "倾心之章", icon: Flame, color: "#ffd78a" },
    { id: "obsession", score: 92, label: "沉沦之冕", icon: Trophy, color: "#ffd78a" },
  ];
  const [scores, setScores] = useState<Record<string, number>>({});
  useEffect(() => { characters.forEach(c => { fetch(API + "/v1/relationships/" + c.id).then(r => r.json()).then(d => { if (d && d.score !== undefined) setScores(p => ({ ...p, [c.id]: d.score })); }).catch(() => {}); }); }, []);
  const maxScore = Math.max(0, ...Object.values(scores));

  const avatarUrl = user?.avatar || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 8 }}>
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: "rgba(18,18,40,0.5)", borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
        {user ? (
          editing ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>编辑资料</span>
                <button onClick={() => setEditing(false)} style={{ padding: "4px 10px", borderRadius: 10, background: "rgba(255,255,255,0.04)", color: "#8a87a0", fontSize: 13 }}><X size={16} /></button>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" style={{ width: 72, height: 72, borderRadius: 20, objectFit: "cover", border: "2px solid rgba(143,124,255,0.3)" }} />
                  ) : (
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #8f7cff, #ff8ec7)", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 700, color: "#fff" }}>
                      {getDisplayName()[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: 13, background: "#8f7cff", display: "grid", placeItems: "center", border: "2px solid #030310" }}>
                    <Camera size={12} color="#fff" />
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                </div>
                {uploading && <span style={{ color: "#ffd78a", fontSize: 12 }}>上传中...</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div><label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 3 }}>昵称</label><input value={editNickname} onChange={e => setEditNickname(e.target.value)} placeholder="你的昵称" style={inp} /></div>
                <div><label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 3 }}>性别</label>
                  <div style={{ display: "flex", gap: 6 }}>{GENDERS.map(g => (<button key={g.v} onClick={() => setEditGender(g.v)} style={{ padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: editGender === g.v ? 600 : 400, background: editGender === g.v ? "rgba(143,124,255,0.2)" : "rgba(255,255,255,0.03)", color: editGender === g.v ? "#f0edf6" : "#8a87a0", border: "1px solid " + (editGender === g.v ? "rgba(143,124,255,0.3)" : "rgba(255,255,255,0.06)") }}>{g.l}</button>))}</div>
                </div>
                <div><label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 3 }}>个人简介</label><textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="介绍一下自己..." style={{ ...inp, minHeight: 60, resize: "vertical" } as any} /></div>
                <button onClick={saveProfile} style={{ padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Check size={16} /> 保存</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" style={{ width: 60, height: 60, borderRadius: 18, objectFit: "cover", border: "2px solid rgba(143,124,255,0.2)" }} />
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #8f7cff, #ff8ec7)", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 700, color: "#fff" }}>{getDisplayName()[0]?.toUpperCase()}</div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>{getDisplayName()}<button onClick={startEdit} style={{ padding: "2px 8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#8a87a0", display: "flex", alignItems: "center", gap: 2 }}><Edit3 size={12} /></button></div>
                  <div style={{ color: "#8a87a0", fontSize: 12, marginTop: 1 }}>{user.email}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}><span style={{ color: "#8a87a0", fontSize: 11 }}>{getGenderLabel()}</span>{user.bio && <span style={{ color: "#c0bdd6", fontSize: 11 }}>{user.bio.slice(0, 30)}</span>}</div>
                </div>
              </div>
              <button onClick={doLogout} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "1px solid rgba(255,123,147,0.15)", background: "rgba(255,123,147,0.06)", color: "#ff7b93", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LogOut size={16} /> 退出登录</button>
            </div>
          )
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.06)", display: "grid", placeItems: "center" }}><Edit3 size={26} style={{ color: "#8a87a0" }} /></div>
              <div><div style={{ fontWeight: 700, fontSize: 18 }}>未登录</div><div style={{ color: "#8a87a0", fontSize: 12 }}>注册账号以保存数据</div></div>
            </div>
            <button onClick={() => { setShowLogin(true); setMode("register"); }} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 700, fontSize: 15 }}>注册 / 登录</button>
          </div>
        )}
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: "rgba(18,18,40,0.5)", borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><Settings size={18} style={{ color: "#8f7cff" }} /><span style={{ fontWeight: 600, fontSize: 15 }}>设置</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SettingRow label="主题" value={theme} options={[{ v: "dark", l: "深色" }, { v: "warm", l: "暖色" }]} onChange={(v) => setTheme(v as Theme)} />
          <SettingRow label="音效" value={sound ? "on" : "off"} options={[{ v: "on", l: "开" }, { v: "off", l: "关" }]} onChange={(v) => { setSound(v === "on"); localStorage.setItem("nn_sound", v === "on" ? "1" : "0"); }} />
          <SettingRow label="通知" value={notify ? "on" : "off"} options={[{ v: "on", l: "开" }, { v: "off", l: "关" }]} onChange={(v) => { setNotify(v === "on"); localStorage.setItem("nn_notify", v === "on" ? "1" : "0"); }} />
        </div>
      </motion.div>

      {/* Model */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: "rgba(18,18,40,0.5)", borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={() => { setConfig(getLLMConfig()); setShowModel(!showModel); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,215,138,0.08)", display: "grid", placeItems: "center" }}><Key size={20} style={{ color: "#ffd78a" }} /></div>
          <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontWeight: 600, fontSize: 15 }}>模型设置</div><div style={{ color: "#8a87a0", fontSize: 12 }}>配置 API Key 和模型</div></div>
          <Settings size={18} style={{ color: "#8a87a0" }} />
        </button>
        {showModel && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div><label style={{ color: "#8a87a0", fontSize: 11 }}>API Key</label><input type="password" value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })} placeholder="sk-..." style={inp} /></div>
            <div><label style={{ color: "#8a87a0", fontSize: 11 }}>Base URL</label><input value={config.baseUrl} onChange={e => setConfig({ ...config, baseUrl: e.target.value })} placeholder="https://api.deepseek.com/v1" style={inp} /></div>
            <div><label style={{ color: "#8a87a0", fontSize: 11 }}>模型</label><input value={config.model} onChange={e => setConfig({ ...config, model: e.target.value })} placeholder="deepseek-chat" style={inp} /></div>
            <button onClick={() => { saveLLMConfig(config); setShowModel(false); }} style={{ padding: "10px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 14 }}>保存</button>
          </div>
        )}
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: "rgba(18,18,40,0.5)", borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><Trophy size={18} style={{ color: "#ffd78a" }} /><span style={{ fontWeight: 600, fontSize: 15 }}>成就徽章</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
          {achievements.map(a => { const Icon = a.icon; const unlocked = maxScore >= a.score; return (<div key={a.id} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 12, background: unlocked ? a.color + "12" : "rgba(255,255,255,0.02)", border: unlocked ? "1px solid " + a.color + "22" : "1px solid rgba(255,255,255,0.04)", opacity: unlocked ? 1 : 0.35, transition: "all 0.3s" }}><Icon size={22} style={{ color: unlocked ? a.color : "#8a87a0" }} /><div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: unlocked ? a.color : "#8a87a0" }}>{a.label}</div></div>); })}
        </div>
      </motion.div>

      {/* Export */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ background: "rgba(18,18,40,0.5)", borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><Download size={18} style={{ color: "#78dfff" }} /><span style={{ fontWeight: 600, fontSize: 15 }}>导出对话</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{characters.map(c => (<button key={c.id} onClick={() => exportChat(c.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#f0edf6", fontSize: 14, textAlign: "left" }}><img src={`/characters/${c.id}.png`} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} /><span style={{ flex: 1 }}>导出与{c.name}的对话</span><Download size={14} style={{ color: "#8a87a0" }} /></button>))}</div>
      </motion.div>

      {/* Login modal */}
      {cropFile && (
        <CropModal file={cropFile} onCrop={handleCropped} onCancel={() => setCropFile(null)} />
      )}

      {showLogin && (
        <div onClick={() => setShowLogin(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "rgba(20,20,50,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28, width: 340, maxWidth: "90vw", backdropFilter: "blur(40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <h3 style={{ marginBottom: 18, fontSize: 18, fontWeight: 700 }}>{mode === "login" ? "登录" : "注册"}</h3>
            {mode === "register" && (
              <div style={{ marginBottom: 10 }}>
                <label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 3 }}>昵称</label>
                <input value={regNickname} onChange={e => setRegNickname(e.target.value)} placeholder="你的昵称" style={inp} />
              </div>
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱" autoFocus style={inp} />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="密码" style={{ ...inp, marginTop: 10 }} onKeyDown={e => e.key === "Enter" && doLogin()} />
            {err && <p style={{ color: "#ff7b93", fontSize: 12, marginTop: 8 }}>{err}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={doLogin} style={{ flex: 1, padding: "14px", borderRadius: 16, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 700, fontSize: 15 }}>{mode === "login" ? "登录" : "注册"}</button>
              <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ padding: "12px 18px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", color: "#8a87a0", fontSize: 13 }}>{mode === "login" ? "去注册" : "去登录"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
