import { useEffect } from "react";
import httpClient from "../httpClient";

export const useErrorHandling = () => {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const errObj = {
        message: `${event.filename}:${event.lineno}:${event.colno}: ${event.message}`,
        stack: event.error?.stack,
        componentStack: null,
      };
      httpClient.post('/config/Log', errObj);
    };

    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errObj = {
        message: event.reason?.message || 'Unhandled rejection',
        stack: event.reason?.stack,
        componentStack: null,
      };
      httpClient.post('/config/Log', errObj);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
};
