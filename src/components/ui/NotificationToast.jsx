import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationToast = ({ 
  message, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  duration = 4000,
  onClose,
  isVisible = true
}) => {
  const [show, setShow] = useState(isVisible);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setShow(false);
      onClose?.();
    }, 300); // Animation duration
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-emerald-50/95 border-emerald-200 text-emerald-800`;
      case 'error':
        return `${baseStyles} bg-red-50/95 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-amber-50/95 border-amber-200 text-amber-800`;
      default:
        return `${baseStyles} bg-blue-50/95 border-blue-200 text-blue-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={20} className="text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <Icon name="XCircle" size={20} className="text-red-600 flex-shrink-0" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={20} className="text-amber-600 flex-shrink-0" />;
      default:
        return <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0" />;
    }
  };

  if (!show) return null;

  return (
    <div 
      className={`${getToastStyles()} ${
        isLeaving 
          ? 'transform translate-x-full opacity-0' 
          : 'transform translate-x-0 opacity-100'
      }`}
      role="alert"
      aria-live="polite"
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-5">
          {message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className={`ml-2 p-1 rounded-lg transition-colors hover:bg-black/10 ${
          type === 'success' ? 'hover:bg-emerald-200' :
          type === 'error' ? 'hover:bg-red-200' :
          type === 'warning'? 'hover:bg-amber-200' : 'hover:bg-blue-200'
        }`}
        aria-label="Close notification"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts = [], onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-md">
      {toasts?.map((toast) => (
        <NotificationToast
          key={toast?.id}
          message={toast?.message}
          type={toast?.type}
          duration={toast?.duration}
          onClose={() => onRemoveToast?.(toast?.id)}
          isVisible={true}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  };
};

export default NotificationToast;