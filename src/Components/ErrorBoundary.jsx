import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`;

const Card = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 48px 40px;
  max-width: 560px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.5s ease both;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const IconCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 2.5rem;
`;

const Title = styled.h2`
  color: #f1f5f9;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 12px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 32px;
`;

const ErrorDetails = styled.details`
  text-align: left;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 28px;
  cursor: pointer;

  summary {
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 600;
    user-select: none;
  }

  pre {
    margin: 10px 0 0;
    color: #ef4444;
    font-size: 0.78rem;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.$primary
      ? `
    background: #3b82f6;
    color: #fff;
    &:hover { background: #2563eb; transform: translateY(-1px); }
  `
      : `
    background: transparent;
    color: #94a3b8;
    border: 1px solid #334155;
    &:hover { background: #334155; color: #f1f5f9; }
  `}
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production you could send to Sentry/LogRocket here:
    // console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Card>
            <IconCircle>⚠️</IconCircle>
            <Title>Something went wrong</Title>
            <Subtitle>
              An unexpected error occurred in this section.
              {this.props.fallbackMessage
                ? ` ${this.props.fallbackMessage}`
                : " You can try refreshing or go back to the home page."}
            </Subtitle>

            {this.state.error && (
              <ErrorDetails>
                <summary>Show error details</summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </ErrorDetails>
            )}

            <ButtonGroup>
              <Button $primary onClick={this.handleRetry}>
                Try Again
              </Button>
              <Button onClick={this.handleGoHome}>Go to Home</Button>
            </ButtonGroup>
          </Card>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
