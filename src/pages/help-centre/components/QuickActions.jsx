import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'getting-started',
      title: 'Getting Started Guide',
      description: 'New to Evolve Health? Start here',
      icon: 'Play',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => onActionClick?.('getting-started', 'Getting Started Guide')
    },
    {
      id: 'video-tutorials',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: 'PlayCircle',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      action: () => onActionClick?.('video-tutorials', 'Video Tutorials')
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: 'MessageCircle',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      action: () => onActionClick?.('contact-support', 'Contact Support')
    },
    {
      id: 'system-status',
      title: 'System Status',
      description: 'Check service availability',
      icon: 'Activity',
      color: 'text-success',
      bgColor: 'bg-success/10',
      action: () => onActionClick?.('system-status', 'System Status')
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant="ghost"
            onClick={action?.action}
            className="h-auto p-4 flex flex-col items-center text-center hover:bg-muted transition-clinical group"
          >
            <div className={`w-12 h-12 rounded-lg ${action?.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <Icon name={action?.icon} size={24} className={action?.color} />
            </div>
            <h3 className="font-medium text-foreground mb-1">{action?.title}</h3>
            <p className="text-sm text-muted-foreground">{action?.description}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;