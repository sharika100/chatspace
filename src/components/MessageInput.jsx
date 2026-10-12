import React, { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";

const MAX_CHARS = 1000;

export default function MessageInput({ onSendMessage, disabled, roomName }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    if (trimmed.length > MAX_CHARS) return;

    setIsSending(true);
    try {
      await onSendMessage(trimmed);
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const trimmedLength = text.trim().length;
  const isTooLong = text.length > MAX_CHARS;
  const canSend = trimmedLength > 0 && !isTooLong && !isSending && !disabled;

  return (
    <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="relative flex items-end gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "Connecting..."
                : `Message #${roomName || "room"} (Enter to send, Shift+Enter for newline)`
            }
            disabled={disabled || isSending}
            maxLength={MAX_CHARS + 50}
            className="flex-1 max-h-36 resize-none bg-transparent text-sm text-slate-100 placeholder-slate-500 px-3 py-1.5 focus:outline-none custom-scrollbar"
          />

          <div className="flex items-center gap-2 shrink-0 pb-0.5 pr-1">
            {/* Character count warning */}
            {text.length > 0 && (
              <span
                className={`text-[11px] font-mono transition-colors ${
                  isTooLong
                    ? "text-rose-400 font-bold"
                    : text.length > MAX_CHARS * 0.85
                    ? "text-amber-400"
                    : "text-slate-500"
                }`}
              >
                {text.length}/{MAX_CHARS}
              </span>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!canSend}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                canSend
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-100"
                  : "bg-slate-800/80 text-slate-500 cursor-not-allowed"
              }`}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input hint */}
        <div className="flex items-center justify-between mt-1.5 px-2 text-[11px] text-slate-400">
          <span className="hidden sm:inline">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Shift + Enter</kbd> for new line
          </span>
          {isTooLong && (
            <span className="text-rose-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" /> Message exceeds {MAX_CHARS} character limit
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
