import React from "react";

// Generate a deterministic gradient color for avatar initials
const AVATAR_GRADIENTS = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-teal-500 to-emerald-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-500",
];

function getAvatarGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function formatMessageTime(createdAt) {
  if (!createdAt) return "Just now";

  let date;
  if (createdAt && typeof createdAt.toDate === "function") {
    date = createdAt.toDate();
  } else if (createdAt instanceof Date) {
    date = createdAt;
  } else if (typeof createdAt === "number") {
    date = new Date(createdAt);
  } else if (typeof createdAt === "string") {
    date = new Date(createdAt);
  } else {
    return "Just now";
  }

  if (isNaN(date.getTime())) return "Just now";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return timeString;
  }

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} · ${timeString}`;
}

export default function MessageBubble({ message, isCurrentUser }) {
  const senderName = message.senderName || "Unknown User";
  const initials = senderName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const formattedTime = formatMessageTime(message.createdAt);
  const avatarGradient = getAvatarGradient(senderName);

  return (
    <div
      className={`flex items-end gap-2.5 mb-3 px-2 group ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Other user avatar */}
      {!isCurrentUser && (
        <div
          title={senderName}
          className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${avatarGradient} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
        >
          {initials}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {/* Sender Name for other users */}
        {!isCurrentUser && (
          <span className="text-[11px] font-semibold text-slate-400 mb-1 ml-1">
            {senderName}
          </span>
        )}

        {/* Message Card */}
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all ${
            isCurrentUser
              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-xs shadow-indigo-600/20"
              : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-xs"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
            {message.text}
          </p>
        </div>

        {/* Timestamp */}
        <span
          className={`text-[10px] mt-1 px-1 text-slate-400 transition-opacity ${
            isCurrentUser ? "text-right" : "text-left"
          }`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
