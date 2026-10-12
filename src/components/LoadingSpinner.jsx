import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading ChatSpace..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[240px] p-6 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-300">{message}</p>
    </div>
  );
}
