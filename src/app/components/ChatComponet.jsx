"use client";
import React, { useRef, useState, useEffect } from "react";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnd = useRef(null);

  const scroll = () => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scroll();
  }, [message]);

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
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
      setMessage((prevMessages) => [
        ...prevMessages,
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
    <div className="Main-conatiner bg-black bg-opacity-90 w-full h-auto ">
      <div className="left-bar w-1/4 h-auto ">
      
      </div>
      <div className="chat">
        <div className="md:w-3/4 p-6 flex flex-col h-screen lg:mx-40 md:mx-20">
          <div className="messages overflow-y-auto flex-grow pl-5 mb-4 ">
            {message.map((msg, index) => (
              <p key={index}>
                <span
                  className={`m-2 relative shadow-lg rounded-md ${
                    msg.sender === "user"
                      ? "bg-purple-600 inline-block bg-opacity-60 p-2 text-black"
                      : " p-2 bg-white inline-block opacity-60 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </p>
            ))}
            <div ref={msgEnd} />
          </div>
          <form onSubmit={handleSubmit} className="w-full flex pl-3 md:pl-12">
            <input
              className="flex-grow rounded-sm rounded-r-none h-10 text-white text-lg p-4 bg-black bg-opacity-0 border border-white"
              type="text"
              value={prompt}
              onChange={handleInputChange}
              placeholder="Ask anything"
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#474747" }}
              className=" text-white rounded-r-sm h-10 pr-3 text-base bg-black bg-opacity-0 border border-white"
            >
              {loading ? "Generating" : "Submit"}
            </button>
          </form>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
