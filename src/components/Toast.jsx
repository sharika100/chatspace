import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-fade-in pointer-events-none">
      <div
        className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all ${
          isError
            ? "bg-rose-950/90 border-rose-700/60 text-rose-100"
            : isInfo
            ? "bg-sky-950/90 border-sky-700/60 text-sky-100"
            : "bg-emerald-950/90 border-emerald-700/60 text-emerald-100"
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-sky-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <div className="flex-1 text-sm leading-relaxed">{toast.message}</div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
