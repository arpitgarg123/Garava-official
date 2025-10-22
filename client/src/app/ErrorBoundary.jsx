import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary Caught:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report authentication errors differently
    if (error.message?.includes('auth') || error.message?.includes('token')) {
      console.error('Authentication Error in ErrorBoundary:', error.message);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Allow parent component to handle retry logic
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  }

  render() {
    if (this.state.hasError) {
      // Check if this is an auth-related error
      const isAuthError = this.state.error?.message?.includes('auth') || 
                         this.state.error?.message?.includes('token') ||
                         this.state.error?.message?.includes('session');

      return (
        <div className="flex h-screen items-center justify-center bg-secondary text-primary">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold">
              {isAuthError ? 'Authentication Error 🔐' : 'Something went wrong 😢'}
            </h1>
            <p className="mt-2">
              {isAuthError 
                ? 'There was an issue with your session. Please try logging in again.'
                : 'Please refresh or go back to Home.'
              }
            </p>
            
            <div className="mt-4 space-y-2">
              {this.props.onRetry && (
                <button 
                  onClick={this.handleRetry}
                  className="btn-luxury inline-block w-full"
                >
                  Try Again
                </button>
              )}
              <a href="/" className="btn-luxury inline-block w-full">
                Go Home
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left text-[1.0625rem]">
                <summary className="cursor-pointer text-gray-600">
                  Error Details (Dev)
                </summary>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-[1.0625rem] overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
