import React from 'react';


const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  showText = true,
  variant = 'primary',
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-secondary border-t-transparent',
    muted: 'border-muted-foreground border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Spinner */}
      <div 
        className={`animate-spin rounded-full border-2 ${sizeClasses?.[size]} ${variantClasses?.[variant]}`}
        role="status"
        aria-label="Loading"
      />
      
      {/* Loading Text */}
      {showText && text && (
        <p className={`${textSizes?.[size]} text-muted-foreground animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

// Specialized loading components for different contexts
export const PageLoadingSpinner = ({ text = 'Loading page...' }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const FormLoadingSpinner = ({ text = 'Processing...' }) => (
  <LoadingSpinner size="md" text={text} variant="primary" />
);

export const TableLoadingSpinner = ({ text = 'Loading data...' }) => (
  <div className="p-8 text-center">
    <LoadingSpinner size="md" text={text} />
  </div>
);

export const ButtonLoadingSpinner = () => (
  <LoadingSpinner size="sm" showText={false} variant="white" />
);

export default LoadingSpinner;