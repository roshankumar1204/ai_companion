import { useState, FormEvent } from "react";

interface Props {
  onStart: (topic: string) => void;
}

const SUGGESTIONS = [
  "What is a neural network?",
  "How does gradient descent work?",
  "What is overfitting?",
  "Explain backpropagation",
  "What is a transformer?",
];

export default function TopicInput({ onStart }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onStart(trimmed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Pexcera Tutor
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 leading-tight mb-3">
            Learn AI by thinking,
            <br className="hidden sm:block" /> not just reading
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            Ask about any AI concept. Your tutor will guide you to the answer
            through questions — not lectures.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask about any AI topic..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              autoFocus
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition active:scale-95"
            >
              Start
            </button>
          </div>
        </form>

        <div>
          <p className="text-xs text-gray-400 mb-2 text-center">Try one of these</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onStart(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-600 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}