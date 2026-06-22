import { useState, useCallback } from "react";
import type { Message, ChatStatus } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (status === "streaming") return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
      };

      const assistantId = generateId();

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: "assistant", content: "", streaming: true },
      ]);
      setStatus("streaming");
      setError(null);

      try {
        const history = [...messages, userMessage].map(({ role, content }) => ({
          role,
          content,
        }));

        const res = await fetch(`${API_URL}/api/chat`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Server error");
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") break;

            try {
              const { delta } = JSON.parse(raw) as { delta: string };
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + delta }
                    : m
                )
              );
            } catch {
              // Malformed chunk — skip
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
        setStatus("idle");
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setStatus("error");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Something went wrong. Try again.",
                  streaming: false,
                }
              : m
          )
        );
      }
    },
    [messages, status]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  return { messages, status, error, sendMessage, reset };
}