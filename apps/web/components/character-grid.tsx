"use client";

import { useState, useEffect } from "react";
import { characters, type Character } from "@/lib/data";
import { Plus, Edit3, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";
import CreateCharacterForm from "@/components/create-character-form";
import { ds } from "@/lib/design-system";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function CharacterGrid() {
  const [editing, setEditing] = useState<Character | null>(null);
  const [list, setList] = useState<Character[]>(characters);
  const [apiChars, setApiChars] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetch(`${API}/v1/characters`).then(r => r.json()).then(d => {
      if (d.items && Array.isArray(d.items)) {
        const custom = d.items.filter((c: any) => !c.id.startsWith("char-") || !characters.find(hc => hc.id === c.id));
        setApiChars(custom);
      }
    }).catch(() => {});
  }, []);

  const allChars = [...list, ...apiChars.filter((c: any) => !list.find(h => h.id === c.id))];

  function saveEdit() {
    if (!editing) return;
    setList(prev => prev.map(c => c.id === editing.id ? editing : c));
    setEditing(null);
  }

  async function deleteCustom(id: string) {
    if (!confirm("确定要删除这个角色吗？")) return;
    try {
      await fetch(`${API}/v1/characters/${id}`, { method: "DELETE" });
      setApiChars(prev => prev.filter(c => c.id !== id));
    } catch { /* */ }
  }

  function handleCreated(char: any) {
    setApiChars(prev => [{
      id: char.id,
      name: char.name,
      title: char.title || "",
      tagline: char.tagline || "",
      intro: char.intro || "",
      world: char.world || "",
      traits: char.traits || [],
      stages: char.stages || [],
      quickActions: char.quickActions || [],
      memories: char.memories || [],
      story: char.story || [],
      imageUrl: char.imageUrl || "",
    }, ...prev]);
  }

  if (editing) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 4 }}>
        <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#8a87a0", fontSize: 13, alignSelf: "flex-start" }}>返回</button>
        <div className="card" style={{ background: "rgba(18,18,40,0.5)" }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <img src={`/characters/${editing.id}.png`} alt="" style={{ width: 80, height: 80, borderRadius: 18, objectFit: "cover", border: "2px solid rgba(255,215,138,0.2)" }} />
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>{editing.name}</h3>
              <p style={{ color: "#8a87a0", fontSize: 12 }}>编辑角色信息</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Field label="角色名" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <Field label="Title" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
            <Field label="Tagline" value={editing.tagline} onChange={v => setEditing({ ...editing, tagline: v })} />
            <Field label="简介" value={editing.intro} onChange={v => setEditing({ ...editing, intro: v })} textarea />
            <Field label="世界观" value={editing.world} onChange={v => setEditing({ ...editing, world: v })} />
            <Field label="标签" value={editing.traits.join(",")} onChange={v => setEditing({ ...editing, traits: v.split(",").map(t => t.trim()) })} />
            <Field label="快捷回复" value={editing.quickActions.join(",")} onChange={v => setEditing({ ...editing, quickActions: v.split(",").map(t => t.trim()) })} />
            <button onClick={saveEdit} className="btn-primary" style={{ width: "100%", marginTop: 4 }}>保存修改</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8, animation: "fadeIn 0.4s ease" }}>
      {/* Create button */}
      <button onClick={() => setShowCreate(true)} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "14px", borderRadius: 16, border: "2px dashed rgba(143,124,255,0.25)",
        background: "rgba(143,124,255,0.04)", color: "#8f7cff", fontSize: 14, fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s"
      }}>
        <Plus size={18} /> 创建新角色
      </button>

      {allChars.map(c => {
        const isCustom = c.id.startsWith("char-") || apiChars.some(a => a.id === c.id);
        return (
          <div key={c.id} className="card" style={{ display: "flex", gap: 14, alignItems: "center", background: "rgba(18,18,40,0.5)" }}>
            <img
              src={c.imageUrl || `/characters/${c.id}.png`}
              alt={c.name}
              style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", border: "2px solid rgba(255,255,255,0.06)", flexShrink: 0 }}
              onError={(e: any) => { e.target.src = "/characters/luoyin.png"; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
              <div style={{ color: "#ff8ec7", fontSize: 13, margin: "2px 0" }}>{c.tagline}</div>
              <div style={{ color: "#8a87a0", fontSize: 12, lineHeight: 1.5 }}>{(c.intro || "").slice(0, 40)}...</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                {c.traits?.map((t: string) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Link href="/chat" style={{ padding: "8px 16px", borderRadius: 16, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <MessageCircle size={13} /> 对话
              </Link>
              {!isCustom && (
                <button onClick={() => setEditing(c)} style={{ padding: "6px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", color: "#8a87a0", fontSize: 12, background: "transparent", cursor: "pointer" }}>编辑</button>
              )}
              {isCustom && (
                <button onClick={() => deleteCustom(c.id)} style={{ padding: "6px 12px", borderRadius: 12, border: "1px solid rgba(255,123,147,0.2)", color: "#ff7b93", fontSize: 12, background: "transparent", cursor: "pointer" }}>删除</button>
              )}
            </div>
          </div>
        );
      })}

      {showCreate && (
        <CreateCharacterForm onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const style = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "#f0edf6", fontSize: 14, outline: "none" } as const;
  return (
    <div>
      <label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 3 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} style={{ ...style, minHeight: 50, resize: "vertical" } as any} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={style} />}
    </div>
  );
}
