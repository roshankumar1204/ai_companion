import { Router, Request, Response } from "express";
import { groq, MODEL, SYSTEM_PROMPT } from "../lib/groqClient";
import { chatRateLimit } from "../middleware/rateLimit";

const router = Router();

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: Message[];
}

router.post(
  "/",
  chatRateLimit,
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const isValid = messages.every(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    );

    if (!isValid) {
      res.status(400).json({ error: "Invalid message format" });
      return;
    }

    // Cap history to last 20 messages to avoid token overflow
    const trimmedMessages = messages.slice(-20);

    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmedMessages,
        ],
        max_tokens: 300,
        temperature: 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err: unknown) {
      console.error("Groq error:", err);
      if (res.headersSent) {
        res.end();
        return;
      }
      res.status(500).json({ error: "AI service error. Please try again." });
    }
  }
);

export default router;