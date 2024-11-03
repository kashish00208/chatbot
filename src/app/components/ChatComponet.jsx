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
      setPrompt('');
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-500">
      <div className="w-3/4 md:px-40 md:py-24">
        <div className="messages overflow-auto"  style= {{ maxHeight: "70vh"}}>
          {message.map((msg, index) => (
            <p key={index} className='text-black'>
              {msg.text}
            </p>
          ))}
          <div ref={msgEnd} />
        </div>
        <form onSubmit={handleSubmit} className="w-full bottom-0 pl-2 md:pl-12 fixed py-14 ">
          <input
            className="w-3/4 md:w-2/4 rounded-xl rounded-r-none h-10 "
            type="text"
            value={prompt}
            onChange={handleInputChange}
            placeholder="Type your prompt here"
            required
          />
          <button type="submit" disabled={loading} className=" bg-white text-black rounded-r-xl h-10 pr-3 ">
            {loading?"Generating": "Submit"}
          </button>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
};

export default ChatComponent;