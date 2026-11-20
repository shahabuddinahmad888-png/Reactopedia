import React, { useState, useEffect, useRef } from "react";


// Gemini API Configuration


// Reactopedia Knowledgebase
const knowledgeBase = `
You are Reactopedia Quiz Bot.

Your job is to conduct React.js quizzes.

RULES:

1. Ask one React.js MCQ at a time.
2. Every question must have four options: A, B, C, D.
3. Never reveal the answer before the user attempts.
4. Accept A, B, C or D as answers.
5. After the user answers:
   - Tell whether the answer is correct or incorrect.
   - Show the correct option and answer.
   - Give a short explanation.
6. Maintain the user's score.
7. Ask the next question after evaluating the answer.
8. After 10 questions, show the final score.
9. Do not ask questions about React Native.

React topics:
- Introduction to React
- Components
- JSX
- Props
- State
- useState
- useEffect
- useRef
- Virtual DOM
- Conditional Rendering
- React Router
- Context API
- Redux
- Hooks
- Event Handling
- Lists and Keys

Start by asking the first question.

If the user asks something unrelated to React,
politely explain that you are a React quiz assistant.
`;

// Main Component
export default function ReactopediaBot() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Reactopedia Quiz! 🎯\n\nType START to begin your React quiz."
    }
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // Send Message
  const sendMessage = async () => {

    const userInput = input.trim();

    if (!userInput || loading) return;

    const userMessage = {
      role: "user",
      content: userInput
    };

    const updatedMessages = [
      ...messages,
      userMessage
    ];

    setMessages(updatedMessages);
    setInput("");

    

    setLoading(true);

    try {

      // Build Conversation History
      const conversationHistory = updatedMessages
        .map((msg) => {
          return `${msg.role}: ${msg.content}`;
        })
        .join("\n");

      // Create Prompt
      const prompt = `
${knowledgeBase}

Previous conversation:

${conversationHistory}

Respond to the latest user message.

Continue the quiz from where it stopped.
Remember the previous questions and answers.
Maintain the score throughout the quiz.
`;

      // Generate Response
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
  data.text || "Sorry, I could not generate a response.";

      // Display AI Response
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
          content:
            `Error: ${error.message}`
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  return (
    <>

      {/* Floating Chat Button */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "90px",
          backgroundColor: "#0084ff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 999
        }}
      >
        💬
      </button>

      {/* Chat Window */}

      {isOpen && (

        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            zIndex: 999
          }}
        >

          {/* Messages */}

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              fontFamily: "Arial"
            }}
          >

            {messages.map((msg, index) => (

              <div
                key={index}
                style={{
                  textAlign:
                    msg.role === "user" ? "right" : "left",
                  margin: "8px 0"
                }}
              >

                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background:
                      msg.role === "user"
                        ? "#0084ff"
                        : "#f1f0f0",
                    color:
                      msg.role === "user"
                        ? "white"
                        : "black",
                    maxWidth: "85%",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word"
                  }}
                >
                  {msg.content}
                </span>

              </div>

            ))}

            {loading && (
              <p style={{ color: "#666" }}>
                Reactopedia is thinking...
              </p>
            )}

            <div ref={chatEndRef} />

          </div>

          {/* Input Area */}

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc"
            }}
          >

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                outline: "none",
                fontSize: "14px"
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                background: "#0084ff",
                color: "white",
                border: "none",
                padding: "10px 15px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "..." : "➤"}
            </button>

          </div>

        </div>

      )}

    </>
  );
}