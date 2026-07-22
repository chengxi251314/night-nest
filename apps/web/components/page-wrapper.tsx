"use client";

import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 16px", paddingBottom: "calc(88px + var(--safe))", position: "relative", zIndex: 1 }}>
      {children}
    </div>
  );
}
