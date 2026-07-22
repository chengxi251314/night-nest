import CharacterGrid from "@/components/character-grid";

export default function CharactersPage() {
  return (
    <main style={{ display: "grid", gap: 20 }}>
      <div>
        <p style={{ color: "#ffd78a", letterSpacing: "0.28em", fontSize: 12, marginBottom: 4 }}>CHARACTER INDEX</p>
        <h1 style={{ margin: 0, fontSize: 32 }}>角色宇宙</h1>
      </div>
      <CharacterGrid />
    </main>
  );
}
