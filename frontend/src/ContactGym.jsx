import React, { useState } from 'react';
import styled from 'styled-components';
import { Phone, Mail, Send, Calendar, MessageSquare, ChevronRight } from 'lucide-react';

const ContactGym = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Protocol Received! Our masters of fitness will respond shortly.");
    setMessage('');
  };

  return (
    <ContactWrapper>
      <div className="header">
        <h5>CONTACT <span className="text-warning">PROTOCOL</span></h5>
      </div>
      
      <div className="body-content">
        <TabStrip>
          <Tab 
            active={activeTab === 'contact'} 
            onClick={() => setActiveTab('contact')}
          >
            <Phone size={18} /> DIRECT
          </Tab>
          <Tab 
            active={activeTab === 'message'} 
            onClick={() => setActiveTab('message')}
          >
            <MessageSquare size={18} /> MESSAGE
          </Tab>
        </TabStrip>

        {activeTab === 'contact' ? (
          <div className="contact-info animate__animated animate__fadeIn">
            <InfoRow>
              <div className="icon-box"><Phone size={20} /></div>
              <div className="details">
                <label>SECURE LINE</label>
                <p>+91 84891 02133</p>
              </div>
            </InfoRow>
            <InfoRow>
              <div className="icon-box"><Mail size={20} /></div>
              <div className="details">
                <label>ENCRYPTED MAIL</label>
                <p>byfitness@gmail.com</p>
              </div>
            </InfoRow>
            <ActionButton>
              BOOK INITIALIZATION <Calendar size={18} />
            </ActionButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="message-form animate__animated animate__fadeIn">
            <div className="input-field">
              <input type="text" placeholder="SUBJECT PROTOCOL" required />
            </div>
            <div className="input-field">
              <textarea 
                placeholder="YOUR MESSAGE..." 
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <SubmitButton type="submit">
              SEND DATA <Send size={18} />
            </SubmitButton>
          </form>
        )}
      </div>
    </ContactWrapper>
  );
};

const ContactWrapper = styled.div`
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  overflow: hidden;
  color: #fff;

  .header {
    background: #1a1a1a;
    padding: 15px 20px;
    border-bottom: 1px solid #222;
    h5 { 
      font-family: 'Oswald', sans-serif; 
      margin: 0; 
      font-weight: 800; 
      letter-spacing: 2px; 
      font-size: 0.9rem;
    }
  }

  .body-content {
    padding: 20px;
  }
`;

const TabStrip = styled.div`
  display: flex;
  background: #0a0a0a;
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 25px;
  gap: 5px;
`;

const Tab = styled.button`
  flex: 1;
  background: ${props => props.active ? '#ffc107' : 'transparent'};
  color: ${props => props.active ? '#000' : '#888'};
  border: none;
  padding: 10px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: ${props => props.active ? '#000' : '#fff'};
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;

  .icon-box {
    background: rgba(255,193,7,0.1);
    color: #ffc107;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .details {
    label { font-size: 0.65rem; font-weight: 900; color: #555; letter-spacing: 1px; display: block; }
    p { font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0; }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  padding: 12px;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    border-color: #ffc107;
    color: #ffc107;
  }
`;

const message_form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #ffc107;
  color: #000;
  border: none;
  padding: 15px;
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fff;
    transform: translateY(-2px);
  }
`;

const InputField = styled.div`
  input, textarea {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #333;
    padding: 12px;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    &:focus { outline: none; border-color: #ffc107; }
  }
`;

// Fixing the styled components that were used as classes in the JSX
const InputWrapper = styled.div`
  .input-field {
    margin-bottom: 15px;
    input, textarea {
      width: 100%;
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 12px;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      &:focus { outline: none; border-color: #ffc107; }
    }
  }
`;

export default ContactGym;
