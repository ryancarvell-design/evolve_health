import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, change, changeType, icon, color }) => {
  const navigate = useNavigate();

  // Updated color mapping to use consistent theme colors
  const colorClasses = {
    blue: 'text-primary bg-primary/5 border-primary/20',
    green: 'text-accent bg-accent/5 border-accent/20',
    yellow: 'text-warning bg-warning/5 border-warning/20',
    purple: 'text-primary bg-primary/10 border-primary/30',
    red: 'text-error bg-error/5 border-error/20'
  };

  const getTrendIcon = () => {
    if (!change) return null;
    
    return changeType === 'increase' ? (
      <TrendingUp className="h-4 w-4 text-accent" />
    ) : (
      <TrendingDown className="h-4 w-4 text-error" />
    );
  };

  const getTrendColor = () => {
    if (!change) return '';
    return changeType === 'increase' ? 'text-accent' : 'text-error';
  };

  const handleCardClick = () => {
    // Navigate based on metric type or use default fallback
    switch (title?.toLowerCase()) {
      case 'documents created':
        navigate('/document-library');
        break;
      case 'patient records': navigate('/patient-registry');
        break;
      case 'ai interactions': navigate('/document-creation-hub');
        break;
      case 'team collaborations': navigate('/collaboration-hub');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div 
      className={`card-mobile ${colorClasses?.[color] || colorClasses?.blue} cursor-pointer transition-clinical hover:shadow-clinical-lg transform hover:scale-105`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e?.key === 'Enter' || e?.key === ' ') {
          e?.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${title}: ${value}. Click to view details.`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground/70 mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center">
              <span className="text-lg">{icon}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;