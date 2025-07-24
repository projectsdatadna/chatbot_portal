import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { chat } from './ApiService';

interface ChatConfig {
  customerId: string | null;
  themeColor: string;
  logoUrl: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

const App: React.FC = () => {
  const params = new URLSearchParams(window.location.search);

  const [config] = useState<ChatConfig>({
    customerId: params.get("customerId"),
    themeColor: params.get("themeColor") || "#0066ff",
    logoUrl: params.get("logoUrl") || "https://www.gstatic.com/webp/gallery3/1.png"
  });


  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi there! How can I help you today?" }
  ]);
  const [input, setInput] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);


  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const response = await chat({
        query: input,
        customerID: config.customerId
      });

      if (response.data?.answer) {
        const reply: Message = {
          sender: "bot",
          text: response.data.answer
        };
        setMessages(prev => [...prev, reply]);
      } else {
        const fallback: Message = {
          sender: "bot",
          text: "Sorry, I couldn't understand that."
        };
        setMessages(prev => [...prev, fallback]);
      }
    } catch (error) {
      console.error("Chat API failed", error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Please try again." }
      ]);
    }
    finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header" style={{ backgroundColor: config.themeColor }}>
        <img src={config.logoUrl} alt="Logo" className="chat-logo" />
        <span>Customer: {config.customerId || "Guest"}</span>
      </div>

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
          {loading && (
            <div className="message bot typing-indicator">
              <span className="dot" /> <span className="dot" /> <span className="dot" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

      </div>

      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
