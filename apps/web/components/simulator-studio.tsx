"use client";

import { useMemo, useState } from "react";
import { buildOpeningMessages, generateCharacterReply } from "@/lib/simulator/engine";
import { extractSimulationProject } from "@/lib/simulator/extract";
import { sampleScript } from "@/lib/simulator/sample-script";
import type { CharacterProfile, ChatMessage } from "@/lib/simulator/types";

const panel = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 20
} as const;

export function SimulatorStudio() {
  const initialProject = useMemo(() => extractSimulationProject(sampleScript), []);
  const [script, setScript] = useState(sampleScript);
  const [project, setProject] = useState(initialProject);
  const [activeCharacterId, setActiveCharacterId] = useState(initialProject.characters[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const first = initialProject.characters[0];
    return first ? buildOpeningMessages(initialProject, first) : [];
  });
  const [copyHint, setCopyHint] = useState("导出角色卡 JSON");

  const activeCharacter = useMemo(
    () => project.characters.find((item) => item.id === activeCharacterId) ?? project.characters[0],
    [activeCharacterId, project.characters]
  );

  function rebuild(nextScript: string) {
    const nextProject = extractSimulationProject(nextScript);
    const nextCharacter = nextProject.characters[0];
    setProject(nextProject);
    setActiveCharacterId(nextCharacter?.id ?? "");
    setMessages(nextCharacter ? buildOpeningMessages(nextProject, nextCharacter) : []);
  }

  function handleGenerate() {
    rebuild(script);
  }

  function handleSwitchCharacter(character: CharacterProfile) {
    setActiveCharacterId(character.id);
    setMessages(buildOpeningMessages(project, character));
  }

  function handleSend() {
    if (!draft.trim() || !activeCharacter) return;

    const trimmed = draft.trim();
    const userMessage: ChatMessage = { role: "user", text: trimmed };
    const reply = generateCharacterReply(project, activeCharacter, trimmed, [...messages, userMessage]);
    setMessages((current) => [...current, userMessage, reply]);
    setDraft("");
  }

  async function handleCopyJson() {
    await navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    setCopyHint("已复制 JSON");
    window.setTimeout(() => setCopyHint("导出角色卡 JSON"), 1500);
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 10 }}>
        <p style={{ color: "#ffd78a", letterSpacing: "0.2em", fontSize: 12, margin: 0 }}>SCRIPT SIMULATOR</p>
        <h1 style={{ margin: 0, fontSize: 40 }}>剧本角色模拟器</h1>
        <p style={{ color: "#b5abcf", lineHeight: 1.8, margin: 0 }}>
          把剧本贴进来，系统会自动抽出角色、性格、关系和说话方式，然后立刻进入文字游戏试玩。
        </p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 20, alignItems: "start" }}>
        <article style={{ ...panel, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>1. 贴入剧本</h2>
              <p style={{ color: "#b5abcf", margin: "8px 0 0" }}>支持“角色设定 + 对话台词”混合文本。</p>
            </div>
            <button onClick={() => setScript(sampleScript)} style={secondaryButton}>载入示例</button>
          </div>
          <textarea
            value={script}
            onChange={(event) => setScript(event.target.value)}
            style={textareaStyle}
          />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={handleGenerate} style={primaryButton}>生成角色模拟</button>
            <button onClick={handleCopyJson} style={secondaryButton}>{copyHint}</button>
          </div>
        </article>

        <article style={{ ...panel, display: "grid", gap: 14 }}>
          <div>
            <h2 style={{ margin: 0 }}>2. 剧本分析结果</h2>
            <p style={{ color: "#b5abcf", lineHeight: 1.8, margin: "8px 0 0" }}>{project.synopsis}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <InfoCard title="标题" value={project.title} />
            <InfoCard title="世界" value={project.world} />
            <InfoCard title="场景" value={project.scene.title} />
            <InfoCard title="气氛" value={project.scene.tension} />
          </div>
          <div>
            <p style={{ color: "#ffd78a", margin: "0 0 8px" }}>主题标签</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {project.themes.map((theme) => <Tag key={theme} label={theme} active />)}
            </div>
          </div>
          <div>
            <p style={{ color: "#ffd78a", margin: "0 0 8px" }}>已识别角色</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {project.characters.map((character) => (
                <button key={character.id} onClick={() => handleSwitchCharacter(character)} style={chip(character.id === activeCharacter?.id)}>
                  {character.name}
                </button>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "0.88fr 1.12fr", gap: 20, alignItems: "start" }}>
        <article style={{ ...panel, display: "grid", gap: 14 }}>
          <h2 style={{ margin: 0 }}>3. 角色卡</h2>
          {activeCharacter ? (
            <>
              <div>
                <p style={{ color: "#ffd78a", margin: 0 }}>{activeCharacter.role}</p>
                <h3 style={{ fontSize: 28, margin: "8px 0 0" }}>{activeCharacter.name}</h3>
              </div>
              <Field title="核心性格" items={activeCharacter.corePersonality} />
              <Field title="说话方式" text={activeCharacter.speakingStyle} />
              <Field title="角色动机" text={activeCharacter.motivation} />
              <Field title="禁区" items={activeCharacter.taboos} />
              <Field title="情绪触发点" items={activeCharacter.emotionalTriggers} />
              <Field title="隐藏信息" items={activeCharacter.secrets} />
              <Field title="代表台词" items={activeCharacter.sampleLines} />
            </>
          ) : (
            <p style={{ color: "#b5abcf" }}>还没有识别到角色，请补一点对白或角色设定。</p>
          )}
        </article>

        <article style={{ ...panel, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>4. 开始试玩</h2>
              <p style={{ color: "#b5abcf", margin: "8px 0 0" }}>你发一句，角色按刚生成的人设回一句。</p>
            </div>
            {activeCharacter ? <Tag label={`当前扮演：${activeCharacter.name}`} active /> : null}
          </div>

          <div style={{ ...panel, minHeight: 360, display: "grid", gap: 12, alignContent: "start" }}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} style={bubble(message.role)}>
                {message.text}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="比如：你为什么总想替我做决定？"
              style={{ ...textareaStyle, minHeight: 96 }}
            />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["你为什么总想替我做决定？", "如果我现在需要你，你会站哪边？", "把真相告诉我。"].map((idea) => (
                <button key={idea} onClick={() => setDraft(idea)} style={secondaryButton}>{idea}</button>
              ))}
              <button onClick={handleSend} style={primaryButton}>发送并生成回复</button>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 14 }}>
      <p style={{ color: "#ffd78a", margin: "0 0 6px", fontSize: 12 }}>{title}</p>
      <strong style={{ lineHeight: 1.6 }}>{value}</strong>
    </div>
  );
}

function Field({ title, text, items }: { title: string; text?: string; items?: string[] }) {
  return (
    <div>
      <p style={{ color: "#ffd78a", margin: "0 0 8px" }}>{title}</p>
      {text ? <p style={{ color: "#f5f1ff", lineHeight: 1.8, margin: 0 }}>{text}</p> : null}
      {items ? <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{items.map((item) => <Tag key={item} label={item} />)}</div> : null}
    </div>
  );
}

function Tag({ label, active = false }: { label: string; active?: boolean }) {
  return <span style={chip(active)}>{label}</span>;
}

const primaryButton = {
  padding: "12px 18px",
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg,#ff89c6,#8e72ff)",
  color: "white",
  cursor: "pointer"
} as const;

const secondaryButton = {
  padding: "12px 18px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f1ff",
  cursor: "pointer"
} as const;

const textareaStyle = {
  width: "100%",
  minHeight: 340,
  resize: "vertical" as const,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(8,8,20,0.9)",
  color: "#f5f1ff",
  padding: 18,
  lineHeight: 1.8,
  boxSizing: "border-box" as const
};

const chip = (active: boolean) => ({
  padding: "10px 14px",
  borderRadius: 999,
  border: `1px solid ${active ? "rgba(255,215,138,0.45)" : "rgba(255,255,255,0.08)"}`,
  background: active ? "rgba(255,215,138,0.08)" : "rgba(255,255,255,0.04)",
  color: "#f5f1ff",
  cursor: "pointer"
}) as const;

const bubble = (role: ChatMessage["role"]) => ({
  padding: "14px 16px",
  borderRadius: 18,
  color: role === "system" ? "#ffd78a" : "#f5f1ff",
  background: role === "user" ? "rgba(142,114,255,0.18)" : role === "system" ? "rgba(255,215,138,0.08)" : "rgba(255,255,255,0.04)",
  maxWidth: role === "system" ? "100%" : "88%",
  justifySelf: role === "user" ? "end" : "start",
  lineHeight: 1.8
}) as const;

