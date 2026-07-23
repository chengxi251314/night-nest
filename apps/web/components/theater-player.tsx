"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, RotateCcw, X } from "lucide-react";

// Extended story type with branching endings
export type StoryScene = {
  id: string;
  title: string;
  narrative: string;
  characterLine: string;
  choices: { id: string; label: string; nextScene: string; effect: string }[];
  isEnding?: boolean;
  endingType?: "good" | "normal" | "dark";
};

type TheaterProps = {
  characterId: string;
  characterName: string;
  scenes: StoryScene[];
  startScene: string;
  onClose: () => void;
};

export default function TheaterPlayer({ characterName, scenes, startScene, onClose }: TheaterProps) {
  const [currentId, setCurrentId] = useState(startScene);
  const [history, setHistory] = useState<string[]>([]);
  const [showText, setShowText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const scene = scenes.find(s => s.id === currentId);

  // Typewriter effect
  useEffect(() => {
    if (!scene) return;
    setShowText("");
    setTextDone(false);
    setShowChoices(false);
    const full = scene.characterLine;
    let i = 0;
    const timer = setInterval(() => {
      setShowText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) { clearInterval(timer); setTextDone(true); setTimeout(() => setShowChoices(true), 400); }
    }, 40);
    return () => clearInterval(timer);
  }, [currentId, scene]);

  function choose(nextId: string) {
    setHistory(prev => [...prev, currentId]);
    setCurrentId(nextId);
  }

  function restart() { setCurrentId(startScene); setHistory([]); }

  if (!scene) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(3,3,16,0.96)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={16} style={{ color: "#ffd78a" }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>{scene.title}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={restart} style={{ color: "#8a87a0", padding: "4px 8px" }}><RotateCcw size={16} /></button>
          <button onClick={onClose} style={{ color: "#8a87a0", padding: "4px 8px" }}><X size={18} /></button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 20px", maxWidth: 500, margin: "0 auto", width: "100%", gap: 24 }}>
        {/* Narrative */}
        <motion.div key={currentId + "-nar"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#8a87a0", fontSize: 14, lineHeight: 1.8, fontStyle: "italic" }}>
          {scene.narrative}
        </motion.div>

        {/* Character line */}
        <motion.div key={currentId + "-line"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: "20px 24px", borderRadius: 20,
          background: scene.isEnding
            ? scene.endingType === "good" ? "rgba(116,228,174,0.08)" : scene.endingType === "dark" ? "rgba(255,123,147,0.08)" : "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${scene.isEnding ? (scene.endingType === "good" ? "rgba(116,228,174,0.15)" : scene.endingType === "dark" ? "rgba(255,123,147,0.15)" : "rgba(255,255,255,0.06)") : "rgba(255,255,255,0.06)"}`,
          fontSize: 16, lineHeight: 1.8, position: "relative",
        }}>
          <div style={{ color: "#ffd78a", fontSize: 11, fontWeight: 600, marginBottom: 8, letterSpacing: "0.1em" }}>{characterName}</div>
          {showText}
          {!textDone && <span style={{ animation: "glowPulse 1s ease-in-out infinite", opacity: 0.6 }}>|</span>}
        </motion.div>

        {/* Choices */}
        <AnimatePresence>
          {showChoices && !scene.isEnding && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {scene.choices.map(c => (
                <button key={c.id} onClick={() => choose(c.nextScene)} style={{
                  padding: "14px 18px", borderRadius: 16, textAlign: "left",
                  background: "rgba(143,124,255,0.08)", border: "1px solid rgba(143,124,255,0.12)",
                  color: "#f0edf6", fontSize: 14, cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span>{c.label}</span>
                  <ChevronRight size={16} style={{ color: "#8a87a0", opacity: 0.5 }} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ending */}
        {showChoices && scene.isEnding && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 24, marginBottom: 8,
              color: scene.endingType === "good" ? "#74e4ae" : scene.endingType === "dark" ? "#ff7b93" : "#ffd78a"
            }}>
              {scene.endingType === "good" ? "✦ 完美结局" : scene.endingType === "dark" ? "◆ 暗黑结局" : "◇ 普通结局"}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
              <button onClick={restart} style={{ padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "#f0edf6", fontSize: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
                <RotateCcw size={14} style={{ marginRight: 6 }} /> 重玩
              </button>
              <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 999, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                退出
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
