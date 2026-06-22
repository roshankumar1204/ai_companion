import rateLimit from "express-rate-limit";

// Per-IP: 30 messages per 10 minutes
// Prevents abuse while keeping the demo usable
export const chatRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many messages. Please wait a few minutes before continuing.",
  },
});

// Stricter global limiter: 200 req/min across all IPs
export const globalRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});