import { useState, useEffect } from "react";
import TopicInput from "./components/TopicInput";
import ChatWindow from "./components/ChatWindow";
import { useChat } from "./hooks/useChat";

export default function App() {
  const [topic, setTopic] = useState<string | null>(null);
  const { messages, status, sendMessage, reset } = useChat();

  // When topic is set, fire the first message immediately
  useEffect(() => {
    if (topic) {
      sendMessage(topic);
    }
  }, [topic]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    reset();
    setTopic(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backend Notice Banner */}
      <div className="fixed top-4 left-4 bg-blue-100 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-800 z-50 max-w-xs shadow-md">
        <p className="font-semibold">⚡ Backend Startup Notice</p>
        <p className="text-xs mt-1">Backend may take ~30s to wake up from free server sleep. Once active, it runs smoothly!</p>
      </div>

      {!topic ? (
        <TopicInput onStart={setTopic} />
      ) : (
        <ChatWindow
          topic={topic}
          messages={messages}
          status={status}
          onSend={sendMessage}
          onReset={handleReset}
        />
      )}
    </div>
  );
}