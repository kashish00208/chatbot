"use client";
import React, { useRef, useState } from "react";


const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [message,setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnd = useRef(null);

  const scroll = () => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: prompt }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setResponse(data.output);
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {response && (
        <div>
          <h3>Response:</h3>
          <p className="text-black">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
