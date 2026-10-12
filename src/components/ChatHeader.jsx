import React from "react";
import { Menu, Hash, ShieldCheck } from "lucide-react";

export default function ChatHeader({
  selectedRoom,
  messageCount = 0,
  onOpenMobileSidebar,
}) {
  return (
    <header className="h-16 px-4 md:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Open chat rooms menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Room Header Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-white truncate">
                {selectedRoom?.name || "Select a Room"}
              </h2>
              {selectedRoom?.isDefault && (
                <span className="hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Public
                </span>
              )}
            </div>
            {selectedRoom?.description && (
              <p className="text-xs text-slate-400 truncate hidden sm:block max-w-md">
                {selectedRoom.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Header Actions & Live Counter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden xs:inline text-slate-400">Messages:</span>
          <span className="font-semibold text-white">{messageCount}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1 rounded-lg bg-slate-800/40 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Firestore Real-Time</span>
        </div>
      </div>
    </header>
  );
}
