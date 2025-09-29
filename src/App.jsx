import React, { useEffect } from 'react';
import Routes from './Routes';
import { ToastProvider } from './components/ui/Toast';

function App() {
  useEffect(() => {
    // Add global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event?.reason);
      
      // Show user-friendly error message
      if (window.toast) {
        window.toast?.error(
          'Connection Error',
          'Unable to connect to our servers. Please check your internet connection.',
          { persistent: true }
        );
      }
    };

    // Add global error handler for JavaScript errors
    const handleError = (event) => {
      console.error('Global error:', event?.error);
      
      // Don't show toast for ErrorBoundary caught errors
      if (!event?.error?.__ErrorBoundary && window.toast) {
        window.toast?.error(
          'Something went wrong',
          'An unexpected error occurred. Please refresh the page.',
          { 
            action: {
              label: 'Refresh',
              onClick: () => window.location?.reload()
            }
          }
        );
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

export default App;