import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuthStore from "./store/authStore";

const ProfileContainer = styled.div`
  background: #0f172a;
  min-height: 100vh;
  padding: 100px 20px 40px;
  color: #fff;
  font-family: 'Inter', sans-serif;
`;

const ContainerInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #1e293b;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  display: flex;
  flex-direction: ${(props) => (props.$row ? "row" : "column")};
  gap: ${(props) => (props.$gap ? props.$gap : "20px")};
  align-items: ${(props) => (props.$alignCenter ? "center" : "stretch")};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffc107;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;

  h4 {
    margin: 0 0 5px 0;
    font-size: 1.5rem;
    font-weight: 700;
    word-break: break-word;
  }

  p {
    margin: 0 0 5px 0;
    color: #cbd5e1;
    font-size: 0.95rem;
    word-break: break-all;
  }

  .membership {
    color: #ffc107;
    font-weight: bold;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h5`
  color: #3b82f6;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 15px 0;
`;

const ContactInfo = styled.div`
  p {
    margin: 0 0 10px 0;
    color: #cbd5e1;
    font-size: 0.95rem;

    strong {
      color: #fff;
    }
  }

  hr {
    border: 0;
    height: 1px;
    background: #334155;
    margin: 20px 0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;

  ${(props) =>
    props.$variant === "outline"
      ? `
    background: transparent;
    color: #3b82f6;
    border: 2px solid #3b82f6;
    &:hover { background: #3b82f6; color: #fff; }
  `
      : props.$variant === "danger"
      ? `
    background: #ef4444;
    color: #fff;
    border: none;
    &:hover { background: #dc2626; }
  `
      : `
    background: #3b82f6;
    color: #fff;
    border: none;
    &:hover { background: #2563eb; }
  `}
`;

const Myprofile = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user) || {};
  const logout = useAuthStore((state) => state.logout);

  const userName = user.fullName || localStorage.getItem("userName") || "User";
  const userEmail = user.email || localStorage.getItem("userEmail") || "Not logged in";
  const membershipType = user.membershipType || "Standard";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    logout();
  };

  return (
    <ProfileContainer>
      <ContainerInner>
        {/* User Profile Card */}
        <Card $row $alignCenter $gap="30px">
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-acbOrarjzvKY4qPDNFDguOLOSe0UiByl_A&s" alt="User" />
          <ProfileInfo>
            <h4>{userName}</h4>
            <p>✉ {userEmail}</p>
            <p>Membership: <span className="membership">{membershipType}</span></p>
          </ProfileInfo>
        </Card>

        {/* Bottom Section */}
        <GridContainer>
          {/* Contact & Settings Section */}
          <Card>
            <SectionTitle>Contact Us</SectionTitle>
            <ContactInfo>
              <p><strong>Email:</strong> contact@gym.com</p>
              <p><strong>Phone:</strong> +123 456 7890</p>
            </ContactInfo>
            <Button $variant="danger" onClick={handleLogout} style={{ marginTop: "10px" }}>
              Logout & Go Home
            </Button>
          </Card>

          {/* Support Section */}
          <Card>
            <SectionTitle>Need Help?</SectionTitle>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "20px" }}>
              Our support team is ready to assist you. Reach out to us directly through WhatsApp or Email for the fastest response.
            </p>
            <Button 
              style={{ background: "#25D366", color: "#fff", marginBottom: "15px" }} 
              onClick={() => window.open("https://wa.me/1234567890", "_blank")}
            >
              Message on WhatsApp
            </Button>
            <Button 
              $variant="outline" 
              onClick={() => window.location.href = "mailto:support@byfitness.com"}
            >
              Send an Email
            </Button>
          </Card>
        </GridContainer>
      </ContainerInner>
    </ProfileContainer>
  );
};

export default Myprofile;
