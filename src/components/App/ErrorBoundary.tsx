import React, { Component } from 'react';
import { t } from '../../locales';
import httpClient from '../../utils/httpClient';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    this.logErrorToBackend(error, errorInfo);
  }

  logErrorToBackend(error: Error, errorInfo: React.ErrorInfo) {
    const errObj = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };

    httpClient.post('/config/Log', errObj);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>💥 {t('common.crash')} 💥</h1>
          <button className="btn btn-primary" type="button" onClick={this.resetError}>
            Opnieuw Proberen
          </button>
        </>
      );
    }
    return this.props.children;
  }
}
