import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  background-color: #0f172a;
  color: #fff;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: #3b82f6;
  text-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #cbd5e1;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 500px;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const HomeButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Description>
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Description>
      <HomeButton onClick={() => navigate('/')}>
        Return to Home
      </HomeButton>
    </Container>
  );
};

export default NotFound;
