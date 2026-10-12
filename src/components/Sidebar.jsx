import React, { useState, useMemo } from "react";
import {
  MessageSquareCode,
  Plus,
  Search,
  LogOut,
  X,
  Compass,
} from "lucide-react";
import RoomList from "./RoomList";
import { useAuth } from "../context/useAuth";

export default function Sidebar({
  rooms,
  selectedRoom,
  onSelectRoom,
  onOpenCreateModal,
  isOpen,
  onCloseMobile,
}) {
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    const q = searchQuery.toLowerCase();
    return rooms.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [rooms, searchQuery]);

  const userInitials = useMemo(() => {
    if (!currentUser) return "??";
    const name = currentUser.displayName || currentUser.email || "User";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header: App Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-white text-base tracking-tight">ChatSpace</h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Real-Time Chat Rooms</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Action Bar */}
        <div className="p-3 space-y-2 border-b border-slate-800/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search chat rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              onOpenCreateModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Room</span>
          </button>
        </div>

        {/* Chat Rooms Section */}
        <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
          <div className="px-4 pb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Chat Rooms ({filteredRooms.length})
            </span>
          </div>

          <RoomList
            rooms={filteredRooms}
            selectedRoom={selectedRoom}
            onSelectRoom={(room) => {
              onSelectRoom(room);
              if (onCloseMobile) onCloseMobile();
            }}
          />
        </div>

        {/* Current User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.displayName || "Anonymous User"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email || "online"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
