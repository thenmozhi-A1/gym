import React, { useState } from 'react';

const ChatSection = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "trainer",
      senderName: "Mike Thompson",
      senderAvatar: "https://i.pravatar.cc/150?img=52",
      content: "Hey Sarah! How was your HIIT session yesterday?",
      time: "10:30 AM"
    },
    {
      id: 2,
      sender: "user",
      senderName: "Sarah Johnson",
      senderAvatar: "https://i.pravatar.cc/150?img=23",
      content: "It was intense but really good! My endurance is definitely improving.",
      time: "10:35 AM"
    },
    {
      id: 3,
      sender: "trainer",
      senderName: "Mike Thompson",
      senderAvatar: "https://i.pravatar.cc/150?img=52",
      content: "That's great to hear! Ready for tomorrow's session? We'll be focusing on upper body.",
      time: "10:37 AM"
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        senderName: "Sarah Johnson",
        senderAvatar: "https://i.pravatar.cc/150?img=23",
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...messages, newMessage]);
      setMessage("");

      setTimeout(() => {
        const trainerResponse = {
          id: messages.length + 2,
          sender: "trainer",
          senderName: "Mike Thompson",
          senderAvatar: "https://i.pravatar.cc/150?img=52",
          content: "I'll make a note of that and adjust your plan accordingly. See you tomorrow!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, trainerResponse]);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto mb-3">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            {msg.sender !== 'user' && (
              <img 
                src={msg.senderAvatar} 
                alt={msg.senderName} 
                className="rounded-circle me-2" 
                width="32" 
                height="32" 
              />
            )}

            <div
              className={`p-3 rounded ${msg.sender === 'user' 
                ? 'bg-primary text-white rounded-end' 
                : 'bg-light text-dark rounded-start'}`}
              style={{ maxWidth: '75%' }}
            >
              <div className="small">{msg.content}</div>
              <div className="text-muted small text-end mt-1">{msg.time}</div>
            </div>

            {msg.sender === 'user' && (
              <img 
                src={msg.senderAvatar} 
                alt={msg.senderName} 
                className="rounded-circle ms-2" 
                width="32" 
                height="32" 
              />
            )}
          </div>
        ))}
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
