import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "discount";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

// Global toast store (simple singleton without a lib)
type ToastListener = (toasts: Toast[]) => void;
let _toasts: Toast[] = [];
const _listeners = new Set<ToastListener>();

const notify = () => _listeners.forEach((l) => l([..._toasts]));

export const addToast = (toast: Omit<Toast, "id">, duration = 4000) => {
  const id = `toast-${Date.now()}-${Math.random()}`;
  _toasts = [..._toasts, { ...toast, id }];
  notify();
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id);
    notify();
  }, duration);
};

export const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([..._toasts]);
  useEffect(() => {
    _listeners.add(setToasts);
    return () => { _listeners.delete(setToasts); };
  }, []);
  const dismiss = useCallback((id: string) => {
    _toasts = _toasts.filter((t) => t.id !== id);
    notify();
  }, []);
  return { toasts, dismiss };
};

// ── Toast UI ──────────────────────────────────────────────────────────────
const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
  discount: <span className="text-lg">🎟️</span>,
};

const borders: Record<ToastType, string> = {
  success: "border-green-500/30 bg-green-500/10",
  error: "border-red-500/30 bg-red-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
  discount: "border-yellow-500/40 bg-yellow-500/15",
};

export const ToastContainer = () => {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-xl shadow-2xl ${borders[t.type]}`}
          >
            <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{t.title}</p>
              {t.description && (
                <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
