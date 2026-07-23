"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, RotateCcw, X, Heart } from "lucide-react";
import type { Invitation, InvitationScene } from "@/lib/invitations";

type Props = {
  invitation: Invitation;
  characterName: string;
  accentColor: string;
  onClose: () => void;
  onScoreChange: (delta: number) => void;
};

export default function InvitationFlow({ invitation, characterName, accentColor, onClose, onScoreChange }: Props) {
  const [phase, setPhase] = useState<"preview" | "playing">("preview");
  const [sceneId, setSceneId] = useState(invitation.acceptScene);
  const [showText, setShowText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [scoreApplied, setScoreApplied] = useState(false);

  const scene = invitation.scenes.find(s => s.id === sceneId);

  useEffect(() => {
    if (!scene) return;
    setShowText(""); setTextDone(false); setShowChoices(false); setScoreApplied(false);
    const full = scene.characterLine;
    let i = 0;
    const timer = setInterval(() => { setShowText(full.slice(0, i + 1)); i++; if (i >= full.length) { clearInterval(timer); setTextDone(true); setTimeout(() => setShowChoices(true), 400); } }, 35);
    return () => clearInterval(timer);
  }, [sceneId, scene]);

  // Apply score delta when ending is reached
  useEffect(() => {
    if (scene?.isEnding && showChoices && !scoreApplied) {
      setScoreApplied(true);
      const label = scene.endingLabel || "";
      const delta = label.startsWith("🔥") ? 8 : label.startsWith("✦") ? 6 : label.startsWith("◆") ? -3 : 2;
      setTimeout(() => onScoreChange(delta), 600);
    }
  }, [scene?.isEnding, showChoices, scoreApplied]);

  function choose(nextId: string) { setSceneId(nextId); }

  function handleReject() { setPhase("playing"); setSceneId("__reject__"); }
  function handleAccept() { setPhase("playing"); }
  function handleCloseReject() { onScoreChange(-2); onClose(); }

  if (sceneId === "__reject__") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(3,3,16,0.96)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, gap: 20 }}>
        <Heart size={48} style={{ color: "#8a87a0", opacity: 0.3 }} />
        <div style={{ color: "#f0edf6", fontSize: 18, fontWeight: 600, textAlign: "center" }}>{invitation.rejectLine}</div>
        <button onClick={handleCloseReject} style={{ padding: "10px 24px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 14, marginTop: 8 }}>返回对话 (亲密度 -2)</button>
      </div>
    );
  }

  if (!scene) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(3,3,16,0.96)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} style={{ color: "#ffd78a" }} /><span style={{ fontWeight: 600, fontSize: 15 }}>{invitation.title}</span></div>
        <button onClick={onClose} style={{ color: "#8a87a0" }}><X size={18} /></button>
      </div>

      {phase === "preview" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, gap: 24, maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center" }}>
            <Sparkles size={32} style={{ color: accentColor, marginBottom: 16 }} />
            <div style={{ color: "#8a87a0", fontSize: 14, lineHeight: 1.8, marginBottom: 16, fontStyle: "italic" }}>{invitation.preview}</div>
            <div style={{ padding: "18px 20px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: `1px solid ${accentColor}30`, fontSize: 16, lineHeight: 1.8, color: "#f0edf6", marginBottom: 24 }}>
              <div style={{ color: "#ffd78a", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>{characterName}</div>
              {invitation.characterLine}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAccept} style={{ flex: 1, padding: "14px", borderRadius: 16, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#fff", fontWeight: 700, fontSize: 15 }}>✓ 接受</button>
              <button onClick={handleReject} style={{ padding: "14px 24px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#8a87a0", fontSize: 14 }}>✕ 拒绝</button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 20px", maxWidth: 500, margin: "0 auto", width: "100%", gap: 24 }}>
          <motion.div key={sceneId + "-nar"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#8a87a0", fontSize: 14, lineHeight: 1.8, fontStyle: "italic" }}>{scene.narrative}</motion.div>
          <motion.div key={sceneId + "-line"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "20px 24px", borderRadius: 20, background: scene.isEnding ? "rgba(255,215,138,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${scene.isEnding ? "rgba(255,215,138,0.12)" : "rgba(255,255,255,0.06)"}`, fontSize: 16, lineHeight: 1.8 }}>
            <div style={{ color: "#ffd78a", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>{characterName}</div>
            {showText}{!textDone && <span style={{ animation: "glowPulse 1s ease-in-out infinite", opacity: 0.6 }}>|</span>}
          </motion.div>
          <AnimatePresence>
            {showChoices && !scene.isEnding && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {scene.choices?.map(c => <button key={c.id} onClick={() => choose(c.nextScene)} style={{ padding: "14px 18px", borderRadius: 16, textAlign: "left", background: "rgba(143,124,255,0.06)", border: `1px solid ${accentColor}20`, color: "#f0edf6", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>{c.label}<ChevronRight size={16} style={{ color: "#8a87a0" }} /></button>)}
              </motion.div>
            )}
          </AnimatePresence>
          {showChoices && scene.isEnding && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#ffd78a", marginBottom: 6 }}>{scene.endingLabel}</div>
              <div style={{ fontSize: 14, color: "#74e4ae", marginBottom: 12 }}>
                {scene.endingLabel?.startsWith("🔥") ? "亲密度 +8" : scene.endingLabel?.startsWith("✦") ? "亲密度 +6" : scene.endingLabel?.startsWith("◆") ? "亲密度 -3" : "亲密度 +2"}
              </div>
              <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 14 }}>返回聊天</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
