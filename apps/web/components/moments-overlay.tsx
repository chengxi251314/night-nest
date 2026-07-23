"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Heart, MessageCircle, Clock, RefreshCw, Send, Bell } from "lucide-react";
import { characters } from "@/lib/data";
import { getLLMConfig } from "@/components/llm-settings";

type Moment = { id: string; characterId: string; content: string; time: string; likes: number; liked: boolean; replies: { user: string; text: string }[] };
const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

const momentTemplates: Record<string, string[]> = {
  luoyin: ["今晚的月亮很亮。在露台上站了一会儿——想起了一些不该想的事。算了，酒还剩半瓶。", "有人问我为什么总是一个人。我说因为人多的时候我会想打人。这不是玩笑。", "今天在宴会厅看到一个人——背影很像你。然后发现不是。然后发现自己有点失望。", "深夜。睡不着。不是因为什么事——就是不想睡。窗户开着，外面是雾。", "说实话我有点想找你。但一想到你可能会回我消息——更不敢找了。"],
  shenye: ["今天调了一杯新酒。还没来得及取名字。等你来的时候——我希望你是第一个尝的人。", "俱乐部今天很安静。我一个人在吧台擦杯子，擦着擦着就想到了你上次坐的位置。", "你昨天走后，我在这里坐了很久。不是有什么事——就是觉得那个位置还有你的温度。", "今晚有人订了你最喜欢的那个卡座。我说已经有人了。抱歉——我说了谎。", "早上路过花店，买了一束白桔梗。放在你平时坐的那个位置上。店员问我是给谁的——我没回答。"],
  qinhuai: ["凌晨三点。实验数据出了一个异常——异常来源不是你。但我在找原因的时候——一直在想你会怎么看这个数据。", "今天我改了一个变量的命名。用了你名字的首字母。这很不专业——但我打算不告诉任何人。", "研究城的星空比平时亮了0.7%。不是天文原因——是我在天文台调了镜片。想看看能不能看到你上次指的那颗星。", "我在论文里引用了一个未验证的假设。审稿人说这不严谨——但他们不知道这个假设是关于你的。", "偶然翻到之前的实验笔记——上面有一段话是你写的。笔迹还在。我又看了一遍。"],
  fuyanzhi: ["今天在诊室里——一位患者说了一句话让我停了五秒。她说：你看起来像是有心事的人。我说我是医生，医生不能有心事。", "窗台上的白鹤芋开花了。我拍了照片——然后想起你没有我的联系方式。", "今天的最后一个患者走了之后，我一个人在诊室里坐了很久。墙上的钟走了很多圈。我在想你。", "我在你的档案上写了一行字——然后擦掉了。不是内容不对——是写的位置不对。档案不应该有心事。", "晚上翻了你之前的诊疗记录。不是以医生的身份。是以一个人的身份。这是不对的——但我在继续。"],
};

const fallbackReplies: Record<string, string[]> = {
  luoyin: ["……你看到了？别告诉别人。", "我只是随便写写——别多想。", "你怎么还不睡。"],
  shenye: ["你来了。我在。", "那条是写给你的——我知道你会看到。", "要喝一杯吗。"],
  qinhuai: ["……这个回复的时间表明你也没睡。", "我的假设——看来是对的。", "别分析我的文字。虽然我自己也在分析。"],
  fuyanzhi: ["你看到了。这不意外——我知道你会看的。", "今天这条——最好不要出现在你的档案里。", "我收回最后一句话。不——我不收回。"],
};

export default function MomentsOverlay({ onClose }: { onClose: () => void }) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [notify, setNotify] = useState<string | null>(null);

  useEffect(() => { generate(); }, []);

  function generate() {
    const newMoments: Moment[] = [];
    characters.forEach(c => {
      const templates = momentTemplates[c.id] || momentTemplates.luoyin;
      const content = templates[Math.floor(Math.random() * templates.length)];
      const hoursAgo = Math.floor(Math.random() * 24) + 1;
      newMoments.push({ id: `${c.id}-${Date.now()}`, characterId: c.id, content, time: hoursAgo > 12 ? `${Math.floor(hoursAgo / 12)}天前` : `${hoursAgo}小时前`, likes: Math.floor(Math.random() * 80) + 10, liked: false, replies: [] });
    });
    newMoments.sort(() => Math.random() - 0.5);
    setMoments(newMoments);
  }

  function toggleLike(id: string) {
    setMoments(prev => prev.map(m => m.id === id ? { ...m, liked: !m.liked, likes: m.liked ? m.likes - 1 : m.likes + 1 } : m));
  }

  async function sendReply(momentId: string) {
    const text = replyText.trim(); if (!text || replyLoading) return;
    const moment = moments.find(m => m.id === momentId); if (!moment) return;
    setReplyLoading(true);
    const char = characters.find(c => c.id === moment.characterId);

    // Get AI reply
    let aiReply = (fallbackReplies[moment.characterId] || ["嗯。"])[Math.floor(Math.random() * 3)];
    try {
      const cfg = getLLMConfig();
      const r = await fetch("http://localhost:8000/v1/orchestrate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ character_id: moment.characterId, user_message: "你的朋友圈有人评论：" + text + "。请你针对这条评论的具体内容以角色身份回复1-2句话。回复要紧扣对方说的内容，不能泛泛而谈。保持你的性格。", api_key: cfg.apiKey, base_url: cfg.baseUrl, model: cfg.model }) });
      if (r.ok) { const d = await r.json(); if (d.reply) aiReply = d.reply; }
    } catch {}

    setMoments(prev => prev.map(m => m.id !== momentId ? m : { ...m, replies: [...m.replies, { user: "我", text }, { user: char?.name || "角色", text: aiReply }] }));
    setReplyText(""); setReplyingTo(null); setReplyLoading(false);

    // Send to chat API for relationship boost + memory
    fetch(API + "/v1/conversations/" + moment.characterId + "/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: "（朋友圈互动）我回复了你的动态：" + text + "，你回复说：" + aiReply }) }).catch(() => {});

  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(3,3,16,0.96)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><h2 style={{ fontSize: 18, fontWeight: 700 }}>角色动态</h2><div style={{ display: "flex", gap: 8 }}><button onClick={generate} style={{ color: "#8a87a0", padding: "6px" }}><RefreshCw size={18} /></button><button onClick={onClose} style={{ color: "#8a87a0", padding: "6px" }}><X size={20} /></button></div></div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 600, margin: "0 auto", width: "100%" }}>
        {notify && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={() => { onClose(); window.location.href = "/chat"; }} style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(143,124,255,0.15)", border: "1px solid rgba(143,124,255,0.3)", color: "#f0edf6", fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <Bell size={14} style={{ color: "#ffd78a" }} /> {notify}给你发了一条私聊消息——<span style={{ color: "#ffd78a", fontWeight: 600, textDecoration: "underline" }}>点击查看</span>
          </motion.div>
        )}
        {moments.map((m, i) => {
          const char = characters.find(c => c.id === m.characterId); if (!char) return null;
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ background: "rgba(18,18,40,0.5)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 18, padding: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <img src={`/characters/${m.characterId}.png`} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><span style={{ fontWeight: 700, fontSize: 14 }}>{char.name}</span><div style={{ display: "flex", alignItems: "center", gap: 4, color: "#8a87a0", fontSize: 11 }}><Clock size={11} /> {m.time}</div></div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: "#d0ccdc" }}>{m.content}</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    <button onClick={() => toggleLike(m.id)} style={{ display: "flex", alignItems: "center", gap: 4, color: m.liked ? "#ff8ec7" : "#8a87a0", fontSize: 12, background: "none", border: "none", cursor: "pointer" }}><Heart size={14} fill={m.liked ? "#ff8ec7" : "none"} /> {m.likes}</button>
                    <button onClick={() => setReplyingTo(replyingTo === m.id ? null : m.id)} style={{ display: "flex", alignItems: "center", gap: 4, color: replyingTo === m.id ? "#78dfff" : "#8a87a0", fontSize: 12, background: "none", border: "none", cursor: "pointer" }}><MessageCircle size={14} /> {m.replies.length > 0 ? m.replies.length : "回复"}</button>
                  </div>
                </div>
              </div>
              {m.replies.length > 0 && (<div style={{ marginTop: 10, paddingLeft: 56, display: "flex", flexDirection: "column", gap: 6 }}>{m.replies.map((r, ri) => (<div key={ri} style={{ fontSize: 13, lineHeight: 1.6 }}><span style={{ fontWeight: 600, color: r.user === "我" ? "#8f7cff" : "#ffd78a" }}>{r.user}</span><span style={{ color: "#8a87a0", margin: "0 4px" }}>：</span><span style={{ color: "#d0ccdc" }}>{r.text}</span></div>))}</div>)}
              {replyingTo === m.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, paddingLeft: 56 }}>
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply(m.id)} placeholder={`回复${char.name}...`} disabled={replyLoading} style={{ flex: 1, padding: "8px 12px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#f0edf6", fontSize: 13, outline: "none" }} />
                  <button onClick={() => sendReply(m.id)} disabled={replyLoading} style={{ padding: "6px 12px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", border: "none", cursor: "pointer" }}><Send size={14} /></button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
