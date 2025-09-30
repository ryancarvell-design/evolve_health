import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast?.persistent) {
      const timer = setTimeout(() => {
        onClose(toast?.id);
      }, toast?.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg transform transition-all duration-300 ease-in-out max-w-sm w-full";
    
    switch (toast?.type) {
      case 'error':
        return `${baseStyles} text-red-800 bg-red-50 border border-red-200`;
      case 'warning':
        return `${baseStyles} text-yellow-800 bg-yellow-50 border border-yellow-200`;
      case 'success':
        return `${baseStyles} text-green-800 bg-green-50 border border-green-200`;
      case 'info':
      default:
        return `${baseStyles} text-blue-800 bg-blue-50 border border-blue-200`;
    }
  };

  const getIcon = () => {
    switch (toast?.type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg mr-3">
        <span className="text-lg">{getIcon()}</span>
      </div>
      <div className="flex-1 min-w-0">
        {toast?.title && (
          <div className="font-semibold mb-1">{toast?.title}</div>
        )}
        <div>{toast?.message}</div>
        {toast?.action && (
          <button
            onClick={toast?.action?.onClick}
            className="mt-2 text-xs underline hover:no-underline font-medium"
          >
            {toast?.action?.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(toast?.id)}
        className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center"
      >
        <span className="sr-only">Close</span>
        <span className="text-lg">×</span>
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type,
      title: typeof title === 'string' ? title : message,
      message: typeof title === 'string' ? message : title,
      persistent: options?.persistent || false,
      duration: options?.duration || 5000,
      action: options?.action
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Create toast methods
  const toast = {
    success: (title, message, options) => addToast('success', title, message, options),
    error: (title, message, options) => addToast('error', title, message, options),
    warning: (title, message, options) => addToast('warning', title, message, options),
    info: (title, message, options) => addToast('info', title, message, options),
    remove: removeToast,
    clear: clearAllToasts
  };

  // Make toast methods available globally for error handlers
  useEffect(() => {
    window.toast = toast;
    return () => {
      delete window.toast;
    };
  }, [toast]);

  const contextValue = {
    toasts,
    ...toast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts?.map(toast => (
            <Toast
              key={toast?.id}
              toast={toast}
              onClose={removeToast}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export default { ToastProvider, useToast };