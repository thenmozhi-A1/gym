import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this
import "bootstrap/dist/css/bootstrap.min.css";

const Myprofile= () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Read logged-in user details from localStorage
  const userName  = localStorage.getItem("userName")  || "Guest User";
  const userEmail = localStorage.getItem("userEmail") || "Not logged in";

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // ✅ Logout + Redirect Handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Clear login flag
    window.location.href = "/gymsite/"; // Force redirect to home and refresh
  };

  return (
    <div className="container mt-5 pt-4" style={{ paddingBottom: "40px" }}>
      <div className="row justify-content-center">
        {/* User Profile Card */}
        <div className="col-12 col-lg-8">
          <div className="card p-4 shadow-lg rounded-4 mb-4">
            <div className="d-flex align-items-center flex-wrap gap-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-acbOrarjzvKY4qPDNFDguOLOSe0UiByl_A&s"
                alt="User"
                className="rounded-circle border border-3 border-warning"
                style={{ width: "90px", height: "90px", objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <h4 className="mb-1" style={{ wordBreak: "break-word" }}>{userName}</h4>
                <p className="text-muted mb-1" style={{ fontSize: "0.9rem", wordBreak: "break-all" }}>
                  <i className="me-1">✉</i> {userEmail}
                </p>
                <p className="text-muted mb-0">Membership: <span className="text-warning fw-bold">Gold</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="row">
        {/* Contact Section */}
        <div className="col-12 col-md-4 mb-4">
          <div className="card p-4 shadow-lg rounded-4 h-100">
            <h5 className="mb-3 text-primary">Contact Us</h5>
            <p className="mb-1"><strong>Email:</strong> contact@gym.com</p>
            <p className="mb-3"><strong>Phone:</strong> +123 456 7890</p>
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              Logout &amp; Go Home
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="col-12 col-md-8 mb-4">
          <div className="card p-4 shadow-lg rounded-4">
            <h5 className="mb-3 text-primary">Chat with Us</h5>
            <div
              className="chat-box border rounded-3 p-3 mb-3"
              style={{ height: "220px", overflowY: "auto", backgroundColor: "#f9f9f9" }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-muted">Start the conversation...</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <span className={`badge ${msg.sender === "user" ? "bg-primary" : "bg-secondary"}`}
                      style={{ maxWidth: "80%", whiteSpace: "normal", textAlign: "left" }}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
