"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, AlertCircle, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function ToastContainer() {
  const [mounted, setMounted] = useState(false);
  const toasts = useCartStore((state) => state.toasts);
  const removeToast = useCartStore((state) => state.removeToast);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-55 flex flex-col gap-3 max-w-sm w-full no-print pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = "bg-white border-slate-100 text-slate-800 shadow-lg";
          let icon = <Info className="w-5 h-5 text-blue-500" />;
          
          if (toast.type === "success") {
            bgClass = "bg-emerald-50 border-emerald-100 text-emerald-800 shadow-md";
            icon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
          } else if (toast.type === "error") {
            bgClass = "bg-red-50 border-red-100 text-red-800 shadow-md";
            icon = <AlertCircle className="w-5 h-5 text-red-500" />;
          } else if (toast.type === "info") {
            bgClass = "bg-blue-50 border-blue-100 text-blue-800 shadow-md";
            icon = <Info className="w-5 h-5 text-blue-600" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              layout
              className={`p-4 rounded-2xl border flex items-start gap-3 pointer-events-auto ${bgClass}`}
            >
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <p className="text-xs font-bold leading-relaxed flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-650 hover:bg-slate-200/50 p-1 rounded-lg transition-all cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
