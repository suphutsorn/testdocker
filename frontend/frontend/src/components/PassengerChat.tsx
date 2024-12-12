import React, { useState, useEffect } from 'react';
import './PassengerChat.css'; // เพิ่ม CSS

const PassengerChat: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws?room=booking123');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // เพิ่มข้อความจากเซิร์ฟเวอร์ลงใน messages
      if (msg.sender !== 'You') {
        setMessages((prev) => [...prev, { sender: msg.sender, content: msg.content }]);
      }
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      const msg = { room: 'booking123', sender: 'Passenger', content: message };
      socket.send(JSON.stringify(msg));
      setMessage(''); // ล้างช่องข้อความ
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Passenger Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message received">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default PassengerChat;
