import "dotenv/config";
import express from "express";
import cors from "cors";
import { globalRateLimit } from "./middleware/rateLimit";
import chatRouter from "./routes/chat";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(globalRateLimit);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" })); // Prevent huge payloads

app.use("/api/chat", chatRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: "llama-3.3-70b-versatile" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});