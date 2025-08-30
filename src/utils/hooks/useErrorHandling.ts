import { useEffect } from "react";
import StackTrace from "stacktrace-js";
import httpClient from "../httpClient";

export const useErrorHandling = () => {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      StackTrace.fromError(event.error).then(err => {
        const errObj = {
          message: `handleGlobalError: ${event.filename}:${event.lineno}:${event.colno}: ${event.message}`,
          stack: event.error?.stack,
          componentStack: null,
          url: document.location.pathname,
          parsedStack: JSON.stringify(err, null, 2),
        };
        httpClient.post('/config/Log', errObj);
      }).catch(err => {
        const errObj = {
          message: `handleGlobalError: ${event.filename}:${event.lineno}:${event.colno}: ${event.message}. Err from stacktrace-js: ${err}`,
          stack: event.error?.stack,
          componentStack: null,
          url: document.location.pathname,
        };
        httpClient.post('/config/Log', errObj);
      });
    };

    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errObj = {
        message: `handleRejection: ${event.reason?.message || 'Unhandled rejection'}`,
        stack: event.reason?.stack,
        componentStack: null,
        url: document.location.pathname,
      };
      httpClient.post('/config/Log', errObj);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
};
