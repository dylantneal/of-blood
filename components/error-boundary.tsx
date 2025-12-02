"use client";

import React, { Component, ReactNode } from "react";
import { Container } from "./ui/container";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error reporting service (e.g., Sentry)
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Container className="py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Something Went Wrong
              </h1>
              <p className="text-foreground/70 text-lg mb-8">
                We encountered an unexpected error. This has been logged and we'll look into it.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-6 bg-muted border border-line rounded-lg text-left">
                <h2 className="font-display text-xl font-semibold mb-4 text-primary">
                  Error Details (Development Only)
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Error:</p>
                    <pre className="text-sm bg-background p-4 rounded overflow-x-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <p className="font-semibold mb-2">Stack Trace:</p>
                      <pre className="text-xs bg-background p-4 rounded overflow-x-auto max-h-64">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={this.handleReset} variant="primary" size="lg">
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="ghost"
                size="lg"
              >
                Go Home
              </Button>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

/**
 * Simpler error fallback for smaller components
 */
export function SimpleErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void;
}) {
  return (
    <div className="p-6 border border-primary/30 bg-primary/5 rounded-lg text-center">
      <p className="font-display text-lg font-semibold mb-2 text-primary">
        Error Loading Content
      </p>
      <p className="text-sm text-foreground/70 mb-4">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button onClick={resetError} variant="ghost" size="sm">
        Try Again
      </Button>
    </div>
  );
}

