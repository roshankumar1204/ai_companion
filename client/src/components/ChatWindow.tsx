import { useEffect, useRef, FormEvent, useState } from "react";
import MessageBubble from "./MessageBubble";
import type { Message, ChatStatus } from "../types";

interface Props {
  topic: string;
  messages: Message[];
  status: ChatStatus;
  onSend: (content: string) => void;
  onReset: () => void;
}

export default function ChatWindow({
  topic,
  messages,
  status,
  onSend,
  onReset,
}: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status === "streaming") return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <p className="text-sm font-medium text-gray-800 truncate">{topic}</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600 transition shrink-0 ml-2"
        >
          New topic
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Starting your session...</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 bg-white border-t border-gray-100 shrink-0"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              status === "streaming" ? "Tutor is thinking..." : "Your answer..."
            }
            disabled={status === "streaming"}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            className="px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 transition active:scale-95"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}