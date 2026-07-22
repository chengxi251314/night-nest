import CreatorStudio from "@/components/creator-studio";

export default function CreatorPage() {
  return (
    <main style={{ display: "grid", gap: 20 }}>
      <div>
        <p style={{ color: "#ffd78a", letterSpacing: "0.28em", fontSize: 12, marginBottom: 4 }}>CREATOR STUDIO</p>
        <h1 style={{ margin: 0, fontSize: 32 }}>创作后台</h1>
      </div>
      <CreatorStudio />
    </main>
  );
}
