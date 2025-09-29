import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingDeadlines = ({ deadlines }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-error',
      'medium': 'text-warning',
      'low': 'text-success'
    };
    return colors?.[priority] || 'text-muted-foreground';
  };

  const getPriorityBg = (priority) => {
    const colors = {
      'high': 'bg-error/10',
      'medium': 'bg-warning/10',
      'low': 'bg-success/10'
    };
    return colors?.[priority] || 'bg-muted';
  };

  const formatDeadline = (date) => {
    const deadline = new Date(date);
    const now = new Date();
    const diffInDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 0) return 'Overdue';
    return `${diffInDays} days`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
          <Icon name="Clock" size={20} className="text-muted-foreground" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {deadlines?.map((deadline) => (
            <div key={deadline?.id} className={`p-3 rounded-lg border ${getPriorityBg(deadline?.priority)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {deadline?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {deadline?.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{deadline?.assignee}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${getPriorityColor(deadline?.priority)}`}>
                    {formatDeadline(deadline?.dueDate)}
                  </span>
                  <div className={`w-2 h-2 rounded-full mt-1 ml-auto ${getPriorityColor(deadline?.priority)?.replace('text-', 'bg-')}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-clinical">
            View all deadlines
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlines;