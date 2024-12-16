import React, { useState, useEffect } from "react";
import "./DriverChat.css";

interface Message {
  sender: string;
  content: string;
  isUser: boolean;
}

const DriverChat: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws?room=booking123");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // Add messages only if they are not from the current user
      if (msg.sender !== "Driver") {
        setMessages((prev) => [
          ...prev,
          { sender: msg.sender, content: msg.content, isUser: false },
        ]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const msg = { room: "booking123", sender: "Driver", content: message };

      // Send the message to the WebSocket server
      socket.send(JSON.stringify(msg));

      // Add the message to the local state for the current user
      setMessages((prev) => [
        ...prev,
        { sender: "Driver", content: message, isUser: true },
      ]);

      setMessage(""); // Clear the input field
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src="https://via.placeholder.com/50"
          alt="Driver Avatar"
          className="chat-avatar"
        />
        <div className="chat-user-details">
          <span className="chat-name">Driver Chat</span>
          <span className="chat-status">Online</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.isUser ? "user" : "other"}`}
            >
              <span className="message-sender">{msg.sender}</span>
              <p className="message-content">{msg.content}</p>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages yet</p>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default DriverChat;
