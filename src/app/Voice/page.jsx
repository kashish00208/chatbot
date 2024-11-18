"use client";
import React, { useState, useEffect } from "react";

const ChatWithVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Voice recognition started");
      };

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setSpeechText(speechResult);
        sendToChatbot(speechResult); // Send speech-to-text to the bot
      };

      // recognition.onerror = (event) => {
      //   console.error("Speech recognition error:", event.error);
      // };

      setRecognition(recognition);
    } else {
      alert("Speech recognition not supported");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const sendToChatbot = async (text) => {
    const response = `You said: ${text}. How can I assist you?`;
    setBotResponse(response);
    speakText(response);
  };

  const speakText = (text) => {
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech not supported in this browser.");
    }
  };

  return (
    <div>
      <div>
        <button
          className="border-2 "
          onClick={startListening}
          disabled={isListening}
        >
          Start Listening
        </button>
      </div>
      <div>
        <button onClick={stopListening} disabled={!isListening}>
          Stop Listening
        </button>
      </div>
      <div>
        <p>Recognized: {speechText}</p>
        <p>Bot says: {botResponse}</p>
      </div>
    </div>
  );
};

export default ChatWithVoice;
