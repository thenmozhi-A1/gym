import React, { useState } from 'react';

const ContactGym = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!\nWe'll get back to you as soon as possible.");
    setMessage('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Contact Gym</h5>
      </div>
      <div className="card-body">
        <div className="d-flex mb-3 border rounded overflow-hidden">
          <button
            className={`flex-fill btn ${activeTab === 'contact' ? 'btn-success text-white' : 'btn-light'}`}
            onClick={() => setActiveTab('contact')}
          >
            📞 Direct Contact
          </button>
          <button
            className={`flex-fill btn ${activeTab === 'message' ? 'btn-success text-white' : 'btn-light'}`}
            onClick={() => setActiveTab('message')}
          >
            💬 Message
          </button>
        </div>

        {activeTab === 'contact' ? (
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <span className="me-3">📞</span>
              <div>
                <strong>Phone</strong>
                <p className="mb-0 text-muted">(555) 123-4567</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="me-3">📧</span>
              <div>
                <strong>Email</strong>
                <p className="mb-0 text-muted">support@gymlife.com</p>
              </div>
            </div>
            <button className="btn btn-primary w-100">Book Appointment</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="What would you like to ask?"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactGym;
