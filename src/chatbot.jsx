import React, { useState, useRef, useEffect } from "react";


const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;



const knowledgeBase = `
You are Reactopedia AI, a polite and helpful React learning assistant.

Reactopedia is a platform to learn React, practice concepts, and track progress.

React knowledge:
- React is a JavaScript library for building user interfaces.
- Components are the building blocks of React applications.
- Props pass data between components.
- State represents dynamic data that changes over time.
- useState manages state in functional components.
- useEffect handles side effects.
- useRef references DOM elements and stores values between renders.
- JSX allows HTML-like syntax inside JavaScript.
- React uses a virtual DOM.
- Context API helps share data without prop drilling.
- React Router handles navigation.
- Redux is used for state management.

Instructions:
1. Always answer politely.
2. Prioritize React-related questions.
3. Explain concepts in simple language.
4. Provide code examples when useful.
5. If a question is unrelated to React, politely mention that it is outside Reactopedia's main knowledge area.
6. Never give irrelevant answers.
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 Welcome to Reactopedia. Ask me anything about React!"
    }
  ]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userInput
      }
    ]);

    setInput("");
    setIsLoading(true);

    if (!genAI) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Gemini API key is missing. Please configure VITE_GEMINI_API_KEY."
        }
      ]);

      setIsLoading(false);
      return;
    }

    try {
      const prompt = `
${knowledgeBase}

User Question:
${userInput}

Answer clearly and politely.
`;

      const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ prompt })
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Gemini API request failed");
}

const reply =
  data.text || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply
        }
      ]);

    } catch (error) {
      console.error("Gemini API Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, something went wrong: ${error.message}`
        }
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#0084ff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex: 999
        }}
      >
        💬
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            border: "1px solid #ccc",
            borderRadius: "12px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            zIndex: 999
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              fontFamily: "sans-serif"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "6px 0"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background:
                      msg.role === "user" ? "#0084ff" : "#f1f0f0",
                    color: msg.role === "user" ? "#fff" : "#000",
                    maxWidth: "80%",
                    wordWrap: "break-word"
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}

            {isLoading && (
              <div style={{ padding: "8px", color: "#555" }}>
                Reactopedia AI is typing...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              backgroundColor: "#fafafa",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about React..."
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                outline: "none",
                borderBottomLeftRadius: "12px",
                fontSize: "14px"
              }}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderBottomRightRadius: "12px",
                cursor: "pointer"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}