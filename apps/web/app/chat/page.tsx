import ChatRoom from "@/components/chat-room";

export default function ChatPage() {
  return (
    <main style={{ display: "grid", gap: 20 }}>
      <div>
        <p style={{ color: "#ffd78a", letterSpacing: "0.28em", fontSize: 12, marginBottom: 4 }}>CHAT ROOM</p>
        <h1 style={{ margin: 0, fontSize: 32 }}>沉浸对话</h1>
      </div>
      <ChatRoom />
    </main>
  );
}
