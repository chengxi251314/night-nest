"use client";

import { useState, useRef } from "react";
import { Upload, Plus, Trash2, Save, X, ImageIcon } from "lucide-react";
import { ds } from "@/lib/design-system";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

const formStyle = {
  display: "flex", flexDirection: "column", gap: 14,
  background: "rgba(14,14,36,0.85)", borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.06)", padding: 22,
  maxWidth: 520, margin: "0 auto", backdropFilter: "blur(20px)"
} as const;

const labelStyle = { color: "#8a87a0", fontSize: 11, fontWeight: 500, marginBottom: 3, letterSpacing: "0.04em" } as const;
const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#f0edf6", fontSize: 14, outline: "none" } as const;

type Stage = { max: number; label: string; hint: string };
type Choice = { id: string; label: string; effect: { relationship: number; mood: string; memory: string } };
type StoryNode = { id: string; title: string; body: string; choices: Choice[] };

export default function CreateCharacterForm({ onClose, onCreated }: { onClose: () => void; onCreated: (char: any) => void }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [intro, setIntro] = useState("");
  const [world, setWorld] = useState("");
  const [traits, setTraits] = useState<string[]>([""]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [stages, setStages] = useState<Stage[]>([
    { max: 29, label: "试探期", hint: "" },
    { max: 59, label: "熟悉期", hint: "" },
    { max: 84, label: "亲密期", hint: "" },
    { max: 100, label: "沉沦期", hint: "" },
  ]);

  const [storyNodes, setStoryNodes] = useState<StoryNode[]>([]);
  const [quickActions, setQuickActions] = useState<string[]>([""]);
  const [memories, setMemories] = useState<string[]>([""]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await fetch(`${API}/v1/characters/upload`, { method: "POST", body: form });
      const d = await r.json();
      if (d.imageUrl) setImageUrl(d.imageUrl);
      else setError(d.error || "上传失败");
    } catch { setError("上传失败，请检查网络"); }
    setUploading(false);
  }

  function addTrait() { setTraits([...traits, ""]); }
  function updateTrait(i: number, v: string) { const a = [...traits]; a[i] = v; setTraits(a); }
  function removeTrait(i: number) { setTraits(traits.filter((_, idx) => idx !== i)); }

  function addQuickAction() { setQuickActions([...quickActions, ""]); }
  function updateQuickAction(i: number, v: string) { const a = [...quickActions]; a[i] = v; setQuickActions(a); }
  function removeQuickAction(i: number) { setQuickActions(quickActions.filter((_, idx) => idx !== i)); }

  function addMemory() { setMemories([...memories, ""]); }
  function updateMemory(i: number, v: string) { const a = [...memories]; a[i] = v; setMemories(a); }
  function removeMemory(i: number) { setMemories(memories.filter((_, idx) => idx !== i)); }

  function addStoryNode() {
    setStoryNodes([...storyNodes, {
      id: "node-" + Date.now(),
      title: "",
      body: "",
      choices: []
    }]);
  }
  function updateStoryNode(i: number, field: string, v: string) {
    const a = [...storyNodes];
    (a[i] as any)[field] = v;
    setStoryNodes(a);
  }
  function removeStoryNode(i: number) { setStoryNodes(storyNodes.filter((_, idx) => idx !== i)); }
  function addChoice(nodeIdx: number) {
    const a = [...storyNodes];
    a[nodeIdx].choices.push({ id: "c-" + Date.now(), label: "", effect: { relationship: 0, mood: "", memory: "" } });
    setStoryNodes(a);
  }
  function updateChoice(nodeIdx: number, cIdx: number, field: string, v: any) {
    const a = [...storyNodes];
    if (field === "relationship") {
      a[nodeIdx].choices[cIdx].effect.relationship = parseInt(v) || 0;
    } else if (field === "mood" || field === "memory") {
      (a[nodeIdx].choices[cIdx].effect as any)[field] = v;
    } else {
      (a[nodeIdx].choices[cIdx] as any)[field] = v;
    }
    setStoryNodes(a);
  }
  function removeChoice(nodeIdx: number, cIdx: number) {
    const a = [...storyNodes];
    a[nodeIdx].choices = a[nodeIdx].choices.filter((_, i) => i !== cIdx);
    setStoryNodes(a);
  }

  async function handleSave() {
    if (!name.trim()) { setError("请输入角色名称"); return; }
    setSaving(true);
    setError("");
    try {
      const body = {
        name: name.trim(),
        title: title.trim(),
        tagline: tagline.trim(),
        intro: intro.trim(),
        world: world.trim(),
        traits: traits.filter(t => t.trim()),
        stages: stages.filter(s => s.label.trim()),
        quickActions: quickActions.filter(q => q.trim()),
        memories: memories.filter(m => m.trim()),
        story: storyNodes.map(n => ({
          ...n,
          choices: n.choices.filter(c => c.label.trim())
        })).filter(n => n.title.trim()),
        imageUrl,
      };
      const r = await fetch(`${API}/v1/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d.success) {
        onCreated({ id: d.id, name: d.name, ...body });
        onClose();
      } else {
        setError(d.error || "创建失败");
      }
    } catch {
      setError("网络错误，请重试");
    }
    setSaving(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(3,3,16,0.92)", backdropFilter: "blur(12px)", overflow: "auto", padding: "20px 16px 40px" }}>
      <div style={formStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#ffd78a" }}>创建角色</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "none", color: "#8a87a0", cursor: "pointer" }}><X size={18} /></button>
        </div>

        {error && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,123,147,0.1)", color: "#ff7b93", fontSize: 13 }}>{error}</div>}

        {/* Avatar upload */}
        <div>
          <div style={labelStyle}>角色立绘</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {imageUrl ? (
              <div style={{ position: "relative" }}>
                <img src={imageUrl} alt="" style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover", border: "2px solid rgba(255,215,138,0.2)" }} />
                <button onClick={() => setImageUrl("")} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: 11, background: "#ff7b93", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }}><X size={12} color="#fff" /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: 80, height: 80, borderRadius: 16, border: "2px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)", display: "grid", placeItems: "center", cursor: "pointer", color: "#8a87a0" }}>
                {uploading ? <span style={{ fontSize: 11 }}>上传中</span> : <ImageIcon size={24} />}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
            <span style={{ color: "#8a87a0", fontSize: 11 }}>建议 1:1 比例，PNG/JPG</span>
          </div>
        </div>

        {/* Basic info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={labelStyle}>角色名称 *</div>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="如：白露" />
          </div>
          <div>
            <div style={labelStyle}>称号</div>
            <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="如：冰霜女巫" />
          </div>
        </div>

        <div>
          <div style={labelStyle}>Tagline / 口头禅</div>
          <input value={tagline} onChange={e => setTagline(e.target.value)} style={inputStyle} placeholder="一句让人记住的话" />
        </div>

        <div>
          <div style={labelStyle}>简介</div>
          <textarea value={intro} onChange={e => setIntro(e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: "vertical" } as any} placeholder="角色的背景故事简介" />
        </div>

        <div>
          <div style={labelStyle}>世界观</div>
          <input value={world} onChange={e => setWorld(e.target.value)} style={inputStyle} placeholder="如：赛博朋克都市" />
        </div>

        {/* Traits */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={labelStyle}>性格标签</span>
            <button onClick={addTrait} style={{ padding: "2px 10px", borderRadius: 8, fontSize: 11, background: "rgba(143,124,255,0.12)", color: "#8f7cff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}><Plus size={12} /> 添加</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {traits.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6 }}>
                <input value={t} onChange={e => updateTrait(i, e.target.value)} style={inputStyle} placeholder="如：傲娇" />
                {traits.length > 1 && <button onClick={() => removeTrait(i)} style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,123,147,0.1)", border: "none", color: "#ff7b93", cursor: "pointer" }}><X size={14} /></button>}
              </div>
            ))}
          </div>
        </div>

        {/* Stages */}
        <div>
          <div style={labelStyle}>关系阶段</div>
          {stages.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={s.max} type="number" onChange={e => { const a = [...stages]; a[i].max = parseInt(e.target.value) || 0; setStages(a); }} style={{ ...inputStyle, width: 60, textAlign: "center" }} />
              <input value={s.label} onChange={e => { const a = [...stages]; a[i].label = e.target.value; setStages(a); }} style={inputStyle} placeholder="阶段名" />
              <input value={s.hint} onChange={e => { const a = [...stages]; a[i].hint = e.target.value; setStages(a); }} style={inputStyle} placeholder="提示文字" />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={labelStyle}>快捷回复</span>
            <button onClick={addQuickAction} style={{ padding: "2px 10px", borderRadius: 8, fontSize: 11, background: "rgba(143,124,255,0.12)", color: "#8f7cff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}><Plus size={12} /> 添加</button>
          </div>
          {quickActions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <input value={q} onChange={e => updateQuickAction(i, e.target.value)} style={inputStyle} placeholder="如：你今天看起来很开心" />
              {quickActions.length > 1 && <button onClick={() => removeQuickAction(i)} style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,123,147,0.1)", border: "none", color: "#ff7b93", cursor: "pointer" }}><X size={14} /></button>}
            </div>
          ))}
        </div>

        {/* Memories */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={labelStyle}>初始记忆</span>
            <button onClick={addMemory} style={{ padding: "2px 10px", borderRadius: 8, fontSize: 11, background: "rgba(143,124,255,0.12)", color: "#8f7cff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}><Plus size={12} /> 添加</button>
          </div>
          {memories.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <input value={m} onChange={e => updateMemory(i, e.target.value)} style={inputStyle} placeholder="角色关于玩家的记忆" />
              {memories.length > 1 && <button onClick={() => removeMemory(i)} style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,123,147,0.1)", border: "none", color: "#ff7b93", cursor: "pointer" }}><X size={14} /></button>}
            </div>
          ))}
        </div>

        {/* Story Nodes */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={labelStyle}>剧情节点</span>
            <button onClick={addStoryNode} style={{ padding: "4px 12px", borderRadius: 10, fontSize: 12, background: "rgba(255,215,138,0.1)", color: "#ffd78a", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Plus size={14} /> 添加剧情</button>
          </div>
          {storyNodes.map((n, ni) => (
            <div key={ni} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 12, marginBottom: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#ffd78a", fontSize: 12, fontWeight: 600 }}>剧情 #{ni + 1}</span>
                <button onClick={() => removeStoryNode(ni)} style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(255,123,147,0.1)", border: "none", color: "#ff7b93", cursor: "pointer", fontSize: 11 }}>删除</button>
              </div>
              <input value={n.title} onChange={e => updateStoryNode(ni, "title", e.target.value)} style={{ ...inputStyle, marginBottom: 6 }} placeholder="剧情标题" />
              <textarea value={n.body} onChange={e => updateStoryNode(ni, "body", e.target.value)} style={{ ...inputStyle, minHeight: 50, resize: "vertical", marginBottom: 8 } as any} placeholder="剧情描述" />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#8a87a0", fontSize: 11 }}>选项</span>
                <button onClick={() => addChoice(ni)} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, background: "rgba(143,124,255,0.1)", color: "#8f7cff", border: "none", cursor: "pointer" }}>+ 添加选项</button>
              </div>
              {n.choices.map((c, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 6, padding: 8, borderRadius: 8, background: "rgba(0,0,0,0.15)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input value={c.label} onChange={e => updateChoice(ni, ci, "label", e.target.value)} style={inputStyle} placeholder="选项文字" />
                    <button onClick={() => removeChoice(ni, ci)} style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(255,123,147,0.1)", border: "none", color: "#ff7b93", cursor: "pointer" }}><X size={12} /></button>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" value={c.effect.relationship} onChange={e => updateChoice(ni, ci, "relationship", e.target.value)} style={{ ...inputStyle, width: 60 }} placeholder="好感" />
                    <input value={c.effect.mood} onChange={e => updateChoice(ni, ci, "mood", e.target.value)} style={inputStyle} placeholder="心情变化" />
                    <input value={c.effect.memory} onChange={e => updateChoice(ni, ci, "memory", e.target.value)} style={inputStyle} placeholder="新增记忆" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#8a87a0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>取消</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "13px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #8f7cff, #ff8ec7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", boxShadow: "0 4px 20px rgba(143,124,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Save size={16} /> {saving ? "创建中..." : "创建角色"}
          </button>
        </div>
      </div>
    </div>
  );
}
