"use client";

export function Skeleton({ width, height, radius = 12 }: { width?: string; height?: string; radius?: number }) {
  return (
    <div style={{
      width: width || "100%", height: height || "20px", borderRadius: radius,
      background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    }} />
  );
}

export function CardSkeleton() {
  return (
    <div style={{ background: "rgba(18,18,40,0.4)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
      <Skeleton width="68px" height="68px" radius={16} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="80%" height="12px" />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>
  );
}
