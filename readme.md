# Pexcera Tutor

A Socratic AI tutor for pre-college students learning AI concepts. Instead of explaining topics directly, it guides students to answers through targeted questions.

Built as a demonstration for the Pexcera Software Developer role.

**Live demo:** (https://ai-companion-4q55.vercel.app/)

---

## What it does

A student types any AI topic ("what is backpropagation"). The tutor responds with a probing question instead of an explanation. The student answers, the tutor corrects misconceptions gently and goes deeper. This continues until the student reaches understanding through their own reasoning.

This maps directly to Pexcera's education mission — the best learning happens when students think, not just consume.

---

## Tech decisions

**React + TypeScript** — strict mode on, no `any`. Types defined in `src/types/index.ts` and shared across components and hooks.

**Custom `useChat` hook** — all API communication and streaming state in one place. Components stay dumb. Makes it easy to swap the backend or add persistence later.

**SSE streaming** — the AI's response streams token by token via Server-Sent Events. `fetch` + `ReadableStream` on the client, `res.write()` on the server. No websocket dependency.

**Express rate limiting** — two layers. Per-IP limiter on `/api/chat` (30 req/10min) prevents abuse. Global limiter (200 req/min) protects the server. Uses `express-rate-limit` — zero config in production.

**Message history capped at 20** — prevents token overflow on long sessions while keeping enough context for coherent conversation.

**Mobile-first layout** — works at 320px. The chat input stays pinned to the bottom on mobile using `flex-col h-screen`. Tested at 320px, 375px, 768px, 1280px.

---

## Project structure

```
pexcera-tutor/
├── client/                   React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/
│       │   ├── ChatWindow.tsx      main chat interface
│       │   ├── MessageBubble.tsx   individual message
│       │   └── TopicInput.tsx      landing / topic entry
│       ├── hooks/
│       │   └── useChat.ts          streaming state + API calls
│       ├── types/index.ts          shared TypeScript types
│       └── App.tsx
└── server/                   Node.js + Express + groq-sdk
    └── src/
        ├── lib/groqClient.ts       Groq SDK + system prompt
        ├── middleware/rateLimit.ts  per-IP + global limiters
        ├── routes/chat.ts          POST /api/chat (streaming)
        └── index.ts
```

---

## Run locally

**Prerequisites:** Node.js 18+, a free Groq API key from [console.groq.com](https://console.groq.com)

```bash
# Clone
git clone <your-repo-url>
cd pexcera-tutor

# Backend
cd server
cp .env.example .env       # add your GROQ_API_KEY
npm install
npm run dev                 # runs on :3001

# Frontend (new terminal)
cd client
npm install
npm run dev                 # runs on :5173, proxies /api to :3001
```

Open `http://localhost:5173`.

---

## Deploy (free)

**Backend → Render**
- New Web Service → connect repo → root directory: `server`
- Build: `npm install && npm run build` | Start: `npm start`
- Add env: `GROQ_API_KEY`, `CLIENT_URL=https://your-vercel-url.vercel.app`

**Frontend → Vercel**
- Import repo → root directory: `client`
- Add env: `VITE_API_URL` (optional, Vite proxy handles local dev)

---

## Why I Built This

I built Pexcera Tutor as a demonstration project inspired by Pexcera's mission of helping students learn effectively. Instead of creating another AI chatbot that provides direct answers, I focused on a Socratic tutoring experience where the model guides students through questions and encourages reasoning before revealing conclusions.

The goal was not only to showcase AI integration, but also to demonstrate practical software engineering skills that are relevant to the role: React and TypeScript development, Express API design, streaming responses, rate limiting, deployment, debugging production issues, and building a complete application that works across desktop and mobile devices.

This project was designed, implemented, deployed, and documented independently as part of my application process for the Software Developer role.


## What I'd add next

- **PostgreSQL session persistence** — save chat history per student so they can resume sessions. Schema: `sessions(id, topic, created_at)` + `messages(id, session_id, role, content, created_at)`.
- **Topic validation** — detect off-topic input on the backend before sending to Groq.
- **Confidence scoring** — track how many hints a student needed and surface it as a progress indicator.
- **Auth** — simple JWT flow so students can track their learning history across devices.

---

## Model

`llama-3.3-70b-versatile` via Groq. Free tier, 14,400 req/day, sub-second latency. The 70B size matters here — smaller models struggle to maintain consistent Socratic behavior without breaking character.