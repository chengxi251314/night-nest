"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { characters } from "@/lib/data";

type Moment = {
  id: string;
  characterId: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
};

// Character-specific moment generators
const momentTemplates: Record<string, string[]> = {
  luoyin: [
    "今晚的月亮很亮。在露台上站了一会儿——想起了一些不该想的事。算了，酒还剩半瓶。",
    "有人问我为什么总是一个人。我说因为人多的时候我会想打人。这不是玩笑。",
    "今天在宴会厅看到一个人——背影很像你。然后发现不是。然后发现自己有点失望。",
    "深夜。睡不着。不是因为什么事——就是不想睡。窗户开着，外面是雾。",
    "说实话我有点想找你。但一想到你可能会回我消息——更不敢找了。",
  ],
  shenye: [
    "今天调了一杯新酒。还没来得及取名字。等你来的时候——我希望你是第一个尝的人。",
    "俱乐部今天很安静。我一个人在吧台擦杯子，擦着擦着就想到了你上次坐的位置。",
    "你昨天走后，我在这里坐了很久。不是有什么事——就是觉得那个位置还有你的温度。",
    "早上路过花店，买了一束白桔梗。放在你平时坐的那个位置上。店员问我是给谁的——我没回答。",
    "今晚有人订了你最喜欢的那个卡座。我说已经有人了。抱歉——我说了谎。",
  ],
  qinhuai: [
    "凌晨三点。实验数据出了一个异常——异常来源不是你。但我在找原因的时候——一直在想你会怎么看这个数据。",
    "今天我改了一个变量的命名。用了你名字的首字母。这很不专业——但我打算不告诉任何人。",
    "偶然翻到之前的实验笔记——上面有一段话是你写的。笔迹还在。我又看了一遍。",
    "研究城的星空比平时亮了0.7%。不是天文原因——是我在天文台调了镜片。想看看能不能看到你上次指的那颗星。",
    "我在论文里引用了一个未验证的假设。审稿人说这不严谨——但他们不知道这个假设是关于你的。",
  ],
  fuyanzhi: [
    "今天在诊室里——一位患者说了一句话让我停了五秒。她说：你看起来像是有心事的人。我说我是医生，医生不能有心事。",
    "窗台上的白鹤芋开花了。我拍了照片——然后想起你没有我的联系方式。",
    "今天的最后一个患者走了之后，我一个人在诊室里坐了很久。墙上的钟走了很多圈。我在想你。",
    "我在你的档案上写了一行字——然后擦掉了。不是内容不对——是写的位置不对。档案不应该有心事。",
    "晚上翻了你之前的诊疗记录。不是以医生的身份。是以一个人的身份。这是不对的——但我在继续。",
  ],
};

const STORAGE_KEY = "nn_moments";

export default function MomentsFeed() {
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    // Load existing moments or generate new ones
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const existing = JSON.parse(saved) as Moment[];
      setMoments(existing);
    } else {
      generateMoments();
    }
  }, []);

  function generateMoments() {
    const newMoments: Moment[] = [];
    characters.forEach(c => {
      const templates = momentTemplates[c.id] || momentTemplates.luoyin;
      const content = templates[Math.floor(Math.random() * templates.length)];
      const hoursAgo = Math.floor(Math.random() * 6) + 1;
      newMoments.push({
        id: `${c.id}-${Date.now()}-${Math.random()}`,
        characterId: c.id,
        content,
        time: `${hoursAgo}小时前`,
        likes: Math.floor(Math.random() * 50) + 10,
        liked: false,
      });
    });
    // Shuffle
    newMoments.sort(() => Math.random() - 0.5);
    setMoments(newMoments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMoments));
  }

  function toggleLike(id: string) {
    setMoments(prev => prev.map(m => m.id === id ? { ...m, liked: !m.liked, likes: m.liked ? m.likes - 1 : m.likes + 1 } : m));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>角色动态</h2>
        <button onClick={generateMoments} style={{ color: "#8a87a0", fontSize: 12, padding: "4px 8px" }}>刷新</button>
      </div>
      {moments.map((m, i) => {
        const char = characters.find(c => c.id === m.characterId);
        if (!char) return null;
        return (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: "rgba(18,18,40,0.5)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 18, padding: 16, display: "flex", gap: 12 }}>
            <img src={`/characters/${m.characterId}.png`} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{char.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#8a87a0", fontSize: 11 }}>
                  <Clock size={11} /> {m.time}
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#d0ccdc" }}>{m.content}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                <button onClick={() => toggleLike(m.id)} style={{ display: "flex", alignItems: "center", gap: 4, color: m.liked ? "#ff8ec7" : "#8a87a0", fontSize: 12 }}>
                  <Heart size={14} fill={m.liked ? "#ff8ec7" : "none"} /> {m.likes}
                </button>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#8a87a0", fontSize: 12 }}>
                  <MessageCircle size={14} /> 回复
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
