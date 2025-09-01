import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
   componentDidCatch(error, info) {
    console.error('ErrorBoundary Caught:', error, info);
   
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-secondary text-primary">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Something went wrong 😢</h1>
            <p className="mt-2">Please refresh or go back to Home.</p>
            <a href="/" className="btn-luxury mt-4 inline-block">
              Go Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
