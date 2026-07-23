"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: string };

const ToastCtx = createContext<{ toast: (type: ToastType, message: string) => void }>({
  toast: () => {},
});

export function useToast() { return useContext(ToastCtx); }

const icons = { success: CheckCircle, error: XCircle, info: Info };
const colors = { success: "#74e4ae", error: "#ff7b93", info: "#78dfff" };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast: add }}>
      {children}
      <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type];
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.9 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 16,
                  background: "rgba(18,18,40,0.95)", border: `1px solid ${colors[t.type]}30`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.5)`, backdropFilter: "blur(20px)",
                  pointerEvents: "auto", maxWidth: "90vw",
                }}>
                <Icon size={18} color={colors[t.type]} />
                <span style={{ color: "#f0edf6", fontSize: 14 }}>{t.message}</span>
                <button onClick={() => setToasts(prev => prev.filter(to => to.id !== t.id))} style={{ color: "#8a87a0", marginLeft: 8 }}>
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
