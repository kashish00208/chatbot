"use client";
import React, { useRef, useState, useEffect } from "react";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnd = useRef(null);

  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => setPrompt(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: prompt }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: prompt },
        { sender: "bot", text: data.output },
      ]);
      setPrompt("");
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl flex flex-col h-[90vh] bg-gray-800 rounded-lg shadow-lg">
        <div className="py-4 px-6 border-b border-gray-700 text-white text-lg font-semibold">
          AI Chat
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-900">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col">
              <span className={`text-sm ${msg.sender === "user" ? "text-blue-400" : "text-green-400"}`}>
              </span>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-md shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-700 text-gray-300 self-start"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex bg-gray-800">
          <input
            className="flex-grow px-4 py-2 text-white bg-gray-700 rounded-md outline-none focus:ring focus:ring-blue-500"
            type="text"
            value={prompt}
            onChange={handleInputChange}
            placeholder="Send a message..."
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
