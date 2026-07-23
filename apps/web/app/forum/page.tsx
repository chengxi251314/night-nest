import ForumBoard from "@/components/forum-board";

export default function ForumPage() {
  return (
    <main style={{ display: "grid", gap: 20 }}>
      <div>
        <p style={{ color: "#ffd78a", letterSpacing: "0.28em", fontSize: 12, marginBottom: 4 }}>COMMUNITY</p>
        <h1 style={{ margin: 0, fontSize: 32 }}>讨论区</h1>
      </div>
      <ForumBoard />
    </main>
  );
}
