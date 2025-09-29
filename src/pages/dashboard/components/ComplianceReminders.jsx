import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceReminders = ({ reminders }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'text-error',
      'warning': 'text-warning',
      'info': 'text-primary'
    };
    return colors?.[severity] || 'text-muted-foreground';
  };

  const getSeverityBg = (severity) => {
    const colors = {
      'critical': 'bg-error/10 border-error/20',
      'warning': 'bg-warning/10 border-warning/20',
      'info': 'bg-primary/10 border-primary/20'
    };
    return colors?.[severity] || 'bg-muted border-border';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      'critical': 'AlertTriangle',
      'warning': 'AlertCircle',
      'info': 'Info'
    };
    return icons?.[severity] || 'Bell';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Compliance Reminders</h3>
          <Icon name="Shield" size={20} className="text-accent" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {reminders?.map((reminder) => (
            <div key={reminder?.id} className={`p-4 rounded-lg border ${getSeverityBg(reminder?.severity)}`}>
              <div className="flex items-start space-x-3">
                <Icon 
                  name={getSeverityIcon(reminder?.severity)} 
                  size={20} 
                  className={getSeverityColor(reminder?.severity)}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {reminder?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {reminder?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(reminder.dueDate)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Icon name="ExternalLink" size={14} className="mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {reminders?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">All compliance requirements are up to date</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Shield" size={16} className="mr-2" />
            View Compliance Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReminders;