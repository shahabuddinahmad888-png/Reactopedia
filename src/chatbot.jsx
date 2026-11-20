import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

// ⚠️ For development only — use environment variable in production (.env)
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = geminiApiKey
  ? new GoogleGenAI({ apiKey: geminiApiKey })
  : null;

// Knowledgebase for Reactopedia
const knowledgeBase = `

repply to every message in a polite way and if anything is out of this knowledgebase tell that also

You are an assistant for a website called Reactopedia.
Reactopedia is a platform to learn React, practice concepts, and track progress.
It acts like an interactive mentor and knowledge hub for React developers.

Always prioritize answers from this knowledgebase:
- React is a JavaScript library for building user interfaces.
- Components are the building blocks of React.
- Props are used to pass data between components.
- State represents dynamic data that changes over time.
- Hooks like useState and useEffect are core to managing logic and side effects.
- React uses a virtual DOM for efficient UI rendering.
- JSX allows writing HTML-like syntax in JavaScript.
- useRef is used for DOM references or persisting values between renders.
 reactBasics: {
    keywords: ["what is react", "define react", "reactjs"],
    responses: [
      "React is a JavaScript library for building user interfaces, developed by Facebook.",
      "React helps you build reusable UI components efficiently using a declarative approach.",
    ],
  },

  components: {
    keywords: ["component", "functional component", "class component"],
    responses: [
      "Components are the building blocks of React apps. They describe a part of the UI.",
      "Functional components are simple JavaScript functions that return JSX.",
      "Class components are ES6 classes that extend React.Component and include lifecycle methods.",
    ],
  },

  hooks: {
    keywords: ["hooks", "useState", "useEffect", "custom hook"],
    responses: [
      "Hooks let you use state and other React features in functional components.",
      "useState allows you to add state to a functional component.",
      "useEffect runs side effects (like API calls or event listeners) after render.",
      "You can create custom hooks to reuse logic between components.",
    ],
  },

  stateAndProps: {
    keywords: ["state", "props", "difference between state and props"],
    responses: [
      "Props are inputs passed to components, while state is data managed inside a component.",
      "Props are read-only, while state can change over time using setState or useState.",
    ],
  },

  advanced: {
    keywords: ["context api", "redux", "router", "performance optimization"],
    responses: [
      "Context API helps share data globally without prop drilling.",
      "Redux is a state management library often used with React for predictable state handling.",
      "React Router allows navigation between different pages or components.",
      "Performance optimization in React can be done using memoization, lazy loading, and pure components.",
    ],
  },

  farewell: {
    keywords: ["bye", "goodbye", "see you", "thank you"],
    responses: [
      "Goodbye! 👋 Hope you learned something new!",
      "See you soon! Keep building amazing React apps! 💻",
    ],
  },
};
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 Ask me anything about React." },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message function (fixed)
  const sendMessage = async () => {
  if (!input.trim()) return;

  const userInput = input.trim();

  const userMessage = {
    role: "user",
    content: userInput,
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setInput("");

  if (!genAI) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "AI is not configured. Please check your Gemini API key.",
      },
    ]);
    return;
  }

  try {
    // Create context-aware prompt
    const prompt = `
You are Reactopedia AI, a polite and helpful React learning assistant.

Your knowledge base:
${knowledgeBase}

Instructions:
1. Answer politely.
2. Prioritize information from the knowledge base.
3. Explain React concepts with simple examples.
4. If a question is outside your knowledge base, clearly mention that.
5. Never give irrelevant answers.

User Question:
${userInput}
`;

    // Generate Gemini response
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =
      result.text || "Sorry, I couldn't generate a response.";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: reply,
      },
    ]);

  } catch (err) {
    console.error("Gemini API Error:", err);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Sorry, something went wrong: ${err.message}`,
      },
    ]);
  }
};

  return (
    <>
      {/* 💬 Floating Chat Button */}
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
          zIndex: 999,
        }}
      >
        💬
      </button>

      {/* 🧠 Chat Window */}
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
            zIndex: 999,
          }}
        >
          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              fontFamily: "sans-serif",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: msg.role === "user" ? "#0084ff" : "#f1f0f0",
                    color: msg.role === "user" ? "#fff" : "#000",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              backgroundColor: "#fafafa",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about React..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                outline: "none",
                borderBottomLeftRadius: "12px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderBottomRightRadius: "12px",
                cursor: "pointer",
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
