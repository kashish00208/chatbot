"use client";
import React, { useRef, useState } from "react";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState([]);
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
    <div className= "w-screen h-screen bg-slate-500">
      <div className="w-3/4 px-40 py-24">
        <div className="">
          <form onSubmit={handleSubmit} className="w-full bottom-0 fixed px-10 py-14 ">
            <input
              className="w-2/4 rounded-2xl"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your prompt here"
              required
            />
            <button type="submit" disabled={loading} className="ml-8">
              {loading ? "Generating..." : "Submit"}
            </button>
          </form>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {response && (
          <div>
            <h3>Response:</h3>
            <p className="text-black">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
