"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, Tag, User, Clock, ChevronRight, ArrowLeft, Send } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

type Topic = { id: string; title: string; content: string; authorId: string; tag: string; replyCount: number; createdAt: string };
type Reply = { id: string; topicId: string; authorId: string; content: string; createdAt: string };

const inp = { padding: "10px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "#f0edf6", fontSize: 14, outline: "none", width: "100%" } as const;

const tags = [
  { key: "general", label: "综合", color: "#8f7cff" },
  { key: "script", label: "剧本", color: "#ff8ec7" },
  { key: "character", label: "角色", color: "#ffd78a" },
  { key: "guide", label: "攻略", color: "#74e4ae" },
  { key: "feedback", label: "反馈", color: "#78dfff" },
];

export default function ForumBoard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [nf, setNf] = useState({ title: "", content: "", tag: "general" });
  const [replyContent, setReplyContent] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("nn-username") || "";
    setAuthorName(stored);
    refresh();
  }, []);

  async function refresh() {
    fetch(API + "/v1/forum/topics").then(r => r.json()).then(d => setTopics(d.items || []));
  }

  async function openTopic(t: Topic) {
    setSelected(t);
    const r = await fetch(API + "/v1/forum/topics/" + t.id);
    if (r.ok) {
      const d = await r.json();
      setReplies(d.replies || []);
    }
  }

  async function createTopic() {
    if (!nf.title.trim()) return;
    const author = authorName.trim() || "匿名";
    localStorage.setItem("nn-username", author);
    await fetch(API + "/v1/forum/topics", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nf, authorId: author })
    });
    setShowCreate(false);
    setNf({ title: "", content: "", tag: "general" });
    refresh();
  }

  async function postReply() {
    if (!replyContent.trim() || !selected) return;
    const author = authorName.trim() || "匿名";
    localStorage.setItem("nn-username", author);
    const r = await fetch(API + "/v1/forum/topics/" + selected.id + "/replies", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId: author, content: replyContent })
    });
    if (r.ok) {
      setReplyContent("");
      openTopic(selected);
    }
  }

  function fmtDate(d: string) {
    try {
      const date = new Date(d);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      if (diff < 3600000) return Math.floor(diff / 60000) + "分钟前";
      if (diff < 86400000) return Math.floor(diff / 3600000) + "小时前";
      return date.toLocaleDateString("zh-CN");
    } catch { return ""; }
  }

  // TOPIC DETAIL
  if (selected) {
    return (
      <div style={{ paddingTop: 8 }}>
        <button onClick={() => setSelected(null)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={13} /> 返回
        </button>

        {/* Topic header */}
        <div style={{ background: "rgba(18,18,40,0.5)", borderRadius: 18, padding: 18, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
            {tags.map(t => t.key === selected.tag && <span key={t.key} style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, background: t.color + "18", color: t.color, border: "1px solid " + t.color + "22" }}>{t.label}</span>)}
            <span style={{ color: "#8a87a0", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><User size={11} /> {selected.authorId}</span>
            <span style={{ color: "#8a87a0", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {fmtDate(selected.createdAt)}</span>
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{selected.title}</h2>
          <div style={{ color: "#c0bdd6", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selected.content}</div>
        </div>

        {/* Replies */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {replies.length === 0 && (
            <div style={{ textAlign: "center", padding: 20, color: "#8a87a0", fontSize: 13 }}>暂无回复，来说两句吧</div>
          )}
          {replies.map((r, i) => (
            <div key={r.id || i} style={{ background: "rgba(18,18,40,0.4)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#ffd78a", fontSize: 12, fontWeight: 600 }}>#{i + 1} {r.authorId}</span>
                <span style={{ color: "#8a87a0", fontSize: 11 }}>{fmtDate(r.createdAt)}</span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "#c0bdd6", whiteSpace: "pre-wrap" }}>{r.content}</div>
            </div>
          ))}
        </div>

        {/* Reply input */}
        <div style={{ display: "flex", gap: 8, paddingTop: 14 }}>
          <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="昵称" style={{ ...inp, width: 100, flexShrink: 0 }} />
          <input value={replyContent} onChange={e => setReplyContent(e.target.value)} onKeyDown={e => e.key === "Enter" && postReply()} placeholder="写回复..." style={inp} />
          <button onClick={postReply} style={{ padding: "10px 16px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 14, flexShrink: 0 }}><Send size={15} /></button>
        </div>
      </div>
    );
  }

  // CREATE
  if (showCreate) {
    return (
      <div style={{ paddingTop: 8 }}>
        <button onClick={() => setShowCreate(false)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13, marginBottom: 14 }}>← 返回</button>
        <div style={{ background: "rgba(18,18,40,0.5)", borderRadius: 18, padding: 18, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>发布新话题</h3>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {tags.map(t => (
              <button key={t.key} onClick={() => setNf({ ...nf, tag: t.key })} style={{
                padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: nf.tag === t.key ? 600 : 400,
                background: nf.tag === t.key ? t.color + "20" : "rgba(255,255,255,0.03)",
                color: nf.tag === t.key ? t.color : "#8a87a0",
                border: "1px solid " + (nf.tag === t.key ? t.color + "33" : "rgba(255,255,255,0.06)"),
                cursor: "pointer"
              }}>{t.label}</button>
            ))}
          </div>
          <input value={nf.title} onChange={e => setNf({ ...nf, title: e.target.value })} placeholder="话题标题" style={{ ...inp, marginBottom: 10 }} />
          <textarea value={nf.content} onChange={e => setNf({ ...nf, content: e.target.value })} placeholder="详细内容..." style={{ ...inp, minHeight: 100, resize: "vertical", marginBottom: 10 } as any} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="昵称" style={{ ...inp, width: 120 }} />
            <button onClick={createTopic} style={{ flex: 1, padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 700, fontSize: 14 }}>发布</button>
          </div>
        </div>
      </div>
    );
  }

  // LIST
  return (
    <div style={{ paddingTop: 8, animation: "fadeIn 0.4s ease" }}>
      {/* Username */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <input value={authorName} onChange={e => { setAuthorName(e.target.value); localStorage.setItem("nn-username", e.target.value); }} placeholder="你的昵称" style={{ ...inp, width: 120, padding: "8px 14px", borderRadius: 12, fontSize: 13 }} />
        <span style={{ color: "#8a87a0", fontSize: 12 }}>{topics.length} 个话题</span>
        <button onClick={() => setShowCreate(true)} style={{ fontSize: 13, padding: "8px 16px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer", marginLeft: "auto" }}>+ 发帖</button>
      </div>

      {topics.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#8a87a0", fontSize: 14 }}>
          还没有话题。来发第一个帖子吧！
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {topics.map(t => (
          <div key={t.id} onClick={() => openTopic(t)} style={{
            display: "flex", gap: 12, alignItems: "center", cursor: "pointer",
            background: "rgba(18,18,40,0.5)", padding: "14px 16px",
            borderRadius: 14, border: "1px solid rgba(255,255,255,0.04)",
            transition: "all 0.15s"
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: (tags.find(tg => tg.key === t.tag)?.color || "#8f7cff") + "15",
              display: "grid", placeItems: "center", flexShrink: 0
            }}>
              <MessageSquare size={17} style={{ color: tags.find(tg => tg.key === t.tag)?.color || "#8f7cff" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                {tags.map(tg => tg.key === t.tag && (
                  <span key={tg.key} style={{ padding: "1px 8px", borderRadius: 8, fontSize: 10, background: tg.color + "14", color: tg.color }}>{tg.label}</span>
                ))}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
              <div style={{ color: "#8a87a0", fontSize: 11, marginTop: 2, display: "flex", gap: 10 }}>
                <span>{t.authorId}</span>
                <span>{fmtDate(t.createdAt)}</span>
                <span>{t.replyCount} 回复</span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "#8a87a0", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
