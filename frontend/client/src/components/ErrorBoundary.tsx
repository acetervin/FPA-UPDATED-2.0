import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Something Went Wrong</h3>
              <p className="text-neutral-600 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
