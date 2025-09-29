import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'document_created': 'FileText',
      'document_updated': 'Edit',
      'document_approved': 'CheckCircle',
      'template_used': 'Layout',
      'file_uploaded': 'Upload',
      'team_invite': 'UserPlus'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'document_created': 'text-success',
      'document_updated': 'text-warning',
      'document_approved': 'text-accent',
      'template_used': 'text-primary',
      'file_uploaded': 'text-secondary',
      'team_invite': 'text-primary'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Team Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity?.user}</span> {activity?.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(activity?.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-clinical">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;