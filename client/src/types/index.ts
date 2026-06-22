export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export type ChatStatus = "idle" | "streaming" | "error";