import React from "react";
import {
  Hash,
  MessageSquare,
  Cpu,
  Code2,
  Globe,
  Sparkles,
  Terminal,
} from "lucide-react";

// Helper to pick an intuitive icon based on room name or tag
function getRoomIcon(roomName = "") {
  const lower = roomName.toLowerCase();
  if (lower.includes("general")) return MessageSquare;
  if (lower.includes("tech")) return Cpu;
  if (lower.includes("program") || lower.includes("dev")) return Code2;
  if (lower.includes("web") || lower.includes("react")) return Globe;
  if (lower.includes("random") || lower.includes("fun")) return Sparkles;
  if (lower.includes("cli") || lower.includes("sys")) return Terminal;
  return Hash;
}

export default function RoomList({ rooms, selectedRoom, onSelectRoom }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No rooms found. Create one using the button below!
      </div>
    );
  }

  return (
    <div className="space-y-1 px-2">
      {rooms.map((room) => {
        const IconComponent = getRoomIcon(room.name);
        const isSelected = selectedRoom?.id === room.id;

        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`w-full group flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
              isSelected
                ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
            }`}
            aria-selected={isSelected}
            role="tab"
          >
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800/80 text-slate-400 group-hover:text-indigo-300 group-hover:bg-slate-800"
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-sm font-semibold truncate ${isSelected ? "text-indigo-200" : "text-slate-200"}`}>
                  {room.name}
                </span>
                {room.isDefault && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    Default
                  </span>
                )}
              </div>
              {room.description && (
                <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                  {room.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
