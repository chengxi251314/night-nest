import { Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, desc }: { icon?: any; title: string; desc?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center", gap: 12 }}>
      <Icon size={48} style={{ color: "#8a87a0", opacity: 0.4 }} strokeWidth={1} />
      <div style={{ fontWeight: 600, fontSize: 16, color: "#8a87a0" }}>{title}</div>
      {desc && <div style={{ color: "#8a87a0", fontSize: 13, opacity: 0.6, maxWidth: 260 }}>{desc}</div>}
    </div>
  );
}
