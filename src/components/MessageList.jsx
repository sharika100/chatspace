import React, { useEffect, useRef } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/useAuth";

export default function MessageList({
  messages,
  loading,
  selectedRoom,
}) {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        <LoadingSpinner message={`Loading #${selectedRoom?.name || "chat"} messages...`} />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 select-none">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          Welcome to #{selectedRoom?.name || "the room"}!
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
          {selectedRoom?.description ||
            "This room is ready for conversation. Say hello or share your thoughts with other participants!"}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time instant synchronization</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 custom-scrollbar flex flex-col justify-start">
      {/* Intro header in the message stream */}
      <div className="text-center py-6 border-b border-slate-900 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 mb-2">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-white">
          Beginning of #{selectedRoom?.name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          {selectedRoom?.description || "Messages sent here are visible to all members."}
        </p>
      </div>

      {/* Message stream */}
      <div className="space-y-1">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={currentUser?.uid === message.senderId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
