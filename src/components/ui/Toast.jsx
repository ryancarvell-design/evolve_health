import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';

const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action = null,
  persistent = false,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto dismiss unless persistent
    let dismissTimer;
    if (!persistent && duration > 0) {
      dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [duration, persistent]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  const typeConfig = {
    success: {
      icon: 'CheckCircle',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      textColor: 'text-success',
      iconColor: 'text-success'
    },
    error: {
      icon: 'XCircle',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      textColor: 'text-error',
      iconColor: 'text-error'
    },
    warning: {
      icon: 'AlertTriangle',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      textColor: 'text-warning',
      iconColor: 'text-warning'
    },
    info: {
      icon: 'Info',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      textColor: 'text-primary',
      iconColor: 'text-primary'
    }
  };

  const config = typeConfig?.[type] || typeConfig?.info;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  if (!isVisible && !isRemoving) return null;

  return (
    <div 
      className={`fixed ${positionClasses?.[position]} z-50 max-w-sm w-full mx-4 sm:mx-0 transition-all duration-200 ${
        isVisible && !isRemoving 
          ? 'opacity-100 translate-y-0 scale-100' :'opacity-0 translate-y-2 scale-95'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`
        ${config?.bgColor} 
        ${config?.borderColor} 
        border rounded-lg shadow-lg p-4
        backdrop-blur-sm
      `}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <Icon 
              name={config?.icon} 
              size={20} 
              className={config?.iconColor} 
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`font-medium text-sm ${config?.textColor} mb-1`}>
                {title}
              </h4>
            )}
            {message && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
            )}
            
            {/* Action Button */}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action?.onClick}
                  className={`text-xs font-medium ${config?.textColor} hover:underline focus:outline-none focus:underline`}
                >
                  {action?.label}
                </button>
              </div>
            )}
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
            aria-label="Close notification"
          >
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        {/* Progress Bar for timed toasts */}
        {!persistent && duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-lg overflow-hidden">
            <div 
              className={`h-full ${config?.textColor?.replace('text-', 'bg-')} rounded-b-lg animate-shrink`}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Create Toast Context
const ToastContext = createContext(null);

// Toast Manager Component for handling multiple toasts
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now()?.toString();
    
    // Handle both string and object parameters for backward compatibility
    let toastConfig;
    if (typeof message === 'string') {
      toastConfig = {
        message,
        type,
        ...options,
        id,
        onClose: () => removeToast(id)
      };
    } else if (typeof message === 'object') {
      toastConfig = {
        ...message,
        id,
        onClose: () => removeToast(id)
      };
    }
    
    setToasts(prev => [...prev, toastConfig]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Toast context value
  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts
  };

  // Global toast functions for backward compatibility
  React.useEffect(() => {
    window.toast = {
      success: (title, message, options = {}) => 
        addToast({ type: 'success', title, message, ...options }),
      error: (title, message, options = {}) => 
        addToast({ type: 'error', title, message, ...options }),
      warning: (title, message, options = {}) => 
        addToast({ type: 'warning', title, message, ...options }),
      info: (title, message, options = {}) => 
        addToast({ type: 'info', title, message, ...options })
    };

    return () => {
      delete window.toast;
    };
  }, []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts?.map(toast => (
        <Toast key={toast?.id} {...toast} />
      ))}
    </ToastContext.Provider>
  );
};

// Custom hook for using toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    console.error('useToast must be used within a ToastProvider');
    // Return a fallback object to prevent destructuring errors
    return {
      addToast: (message, type = 'info') => {
        console.warn('Toast not available - add ToastProvider to your app root');
        console.log(`Toast: [${type?.toUpperCase()}] ${message}`);
      },
      removeToast: () => {},
      removeAllToasts: () => {},
      toasts: []
    };
  }
  
  return context;
};

// CSS for shrink animation (add to global styles)
export const toastStyles = `
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.animate-shrink {
  animation: shrink var(--duration) linear forwards;
}
`;

export default Toast;