import React, { Component } from 'react';
import StackTrace from 'stacktrace-js';
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
    StackTrace.fromError(error).then(err => {
      const errObj = {
        message: `ErrorBoundary: ${error.message}.`,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: document.location.pathname,
        parsedStack: JSON.stringify(err, null, 2),
      };
      httpClient.post('/config/Log', errObj);
    }).catch(err => {
      const errObj = {
        message: `ErrorBoundary: ${error.message}. Err from stacktrace-js: ${err}`,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: document.location.pathname,
      };
      httpClient.post('/config/Log', errObj);
    });
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
