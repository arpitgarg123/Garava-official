import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MdCheckCircle, 
  MdError, 
  MdWarning, 
  MdInfo, 
  MdClose 
} from 'react-icons/md';

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
};

// Individual Toast Component
const Toast = ({ 
  id,
  type = TOAST_TYPES.INFO,
  title,
  message,
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          icon: MdCheckCircle,
          iconColor: 'text-emerald-600',
          borderColor: 'border-l-emerald-500',
          bgColor: 'bg-emerald-50',
          titleColor: 'text-emerald-900',
          messageColor: 'text-emerald-700'
        };
      case TOAST_TYPES.ERROR:
        return {
          icon: MdError,
          iconColor: 'text-red-600',
          borderColor: 'border-l-red-500',
          bgColor: 'bg-red-50',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700'
        };
      case TOAST_TYPES.WARNING:
        return {
          icon: MdWarning,
          iconColor: 'text-amber-600',
          borderColor: 'border-l-amber-500',
          bgColor: 'bg-amber-50',
          titleColor: 'text-amber-900',
          messageColor: 'text-amber-700'
        };
      case TOAST_TYPES.INFO:
      default:
        return {
          icon: MdInfo,
          iconColor: 'text-blue-600',
          borderColor: 'border-l-blue-500',
          bgColor: 'bg-blue-50',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        toast-item relative mb-3 transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 
          position.includes('right') ? 'translate-x-full opacity-0 scale-95' : 
          'translate-x-[-100%] opacity-0 scale-95'}
      `}
    >
      <div className={`
        min-w-80 max-w-md mx-auto bg-white ${config.bgColor} 
        border-l-4 ${config.borderColor} rounded-lg shadow-lg 
        hover:shadow-xl transition-shadow duration-200
        backdrop-blur-sm border border-white/20
      `}>
        <div className="p-4 pr-12">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 ${config.iconColor} mt-0.5`}>
              <IconComponent size={20} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`
                  font-semibold text-[1.0625rem] font-playfair ${config.titleColor} 
                  mb-1 leading-tight
                `}>
                  {title}
                </h4>
              )}
              <p className={`
                text-[1.0625rem] ${config.messageColor} leading-relaxed
                ${!title ? 'font-medium' : ''}
              `}>
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="
            absolute top-3 right-3 p-1 rounded-full
            text-gray-400 hover:text-gray-600 hover:bg-white/50
            transition-colors duration-200 focus:outline-none
          "
          aria-label="Close notification"
        >
          <MdClose size={16} />
        </button>

        {/* Progress Bar */}
        {duration && duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-lg overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${
                type === TOAST_TYPES.SUCCESS ? 'from-emerald-400 to-emerald-600' :
                type === TOAST_TYPES.ERROR ? 'from-red-400 to-red-600' :
                type === TOAST_TYPES.WARNING ? 'from-amber-400 to-amber-600' :
                'from-blue-400 to-blue-600'
              } animate-progress`}
              style={{
                animation: `progress ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, position = 'top-right', onClose }) => {
  const getContainerPosition = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
    }
  };

  return createPortal(
    <div className={`
      fixed ${getContainerPosition()} z-50 max-h-screen overflow-hidden
      pointer-events-none
    `}>
      <div className="pointer-events-auto space-y-0">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            position={position}
            onClose={onClose}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

// Toast Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    // Convenience methods
    success: (message, title, options = {}) => 
      addToast({ type: TOAST_TYPES.SUCCESS, message, title, ...options }),
    error: (message, title, options = {}) => 
      addToast({ type: TOAST_TYPES.ERROR, message, title, ...options }),
    warning: (message, title, options = {}) => 
      addToast({ type: TOAST_TYPES.WARNING, message, title, ...options }),
    info: (message, title, options = {}) => 
      addToast({ type: TOAST_TYPES.INFO, message, title, ...options }),
  };
};

// Main ToastMessage Component (Provider)
const ToastMessage = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToast();

  return (
    <ToastContainer 
      toasts={toasts} 
      position={position} 
      onClose={removeToast} 
    />
  );
};

// CSS for progress animation (add to your global CSS or index.css)
const ToastStyles = () => (
  <style jsx global>{`
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
    
    .animate-progress {
      animation-fill-mode: forwards;
    }
    
    /* Smooth scrolling for toast container */
    .toast-container {
      scroll-behavior: smooth;
    }
  `}</style>
);

export { Toast, ToastContainer, ToastStyles };
export default ToastMessage;