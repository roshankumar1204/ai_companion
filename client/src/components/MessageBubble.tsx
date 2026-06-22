import type { Message } from "../types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium mr-2 mt-1 shrink-0">
          T
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gray-900 text-white rounded-tr-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
        }`}
      >
        {message.content}
        {message.streaming && (
          <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    </div>
  );
}