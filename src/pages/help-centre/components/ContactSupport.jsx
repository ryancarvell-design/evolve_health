import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactSupport = () => {
  const supportChannels = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      description: 'Get instant help',
      icon: 'MessageCircle',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      status: 'Online',
      statusColor: 'text-success',
      action: () => alert('Live chat would open here')
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Response within 4 hours',
      icon: 'Mail',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      status: 'Available',
      statusColor: 'text-success',
      action: () => window.location.href = 'mailto:support@evolvehealth.com'
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: '24/7 emergency line',
      icon: 'Phone',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      status: 'Available',
      statusColor: 'text-success',
      action: () => window.location.href = 'tel:+1-800-EVOLVE'
    }
  ];

  const emergencyContact = {
    title: 'Emergency Support',
    description: 'For critical healthcare situations',
    phone: '+1-800-EVOLVE-911',
    email: 'emergency@evolvehealth.com',
    available: '24/7'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Contact Support</h3>
      <div className="space-y-3 mb-6">
        {supportChannels?.map((channel) => (
          <Button
            key={channel?.id}
            variant="ghost"
            onClick={channel?.action}
            className="w-full justify-start p-3 h-auto hover:bg-muted"
          >
            <div className={`w-10 h-10 rounded-lg ${channel?.bgColor} flex items-center justify-center mr-3`}>
              <Icon name={channel?.icon} size={18} className={channel?.color} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{channel?.title}</span>
                <span className={`text-xs ${channel?.statusColor}`}>{channel?.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">{channel?.description}</p>
            </div>
          </Button>
        ))}
      </div>
      {/* Emergency Contact Section */}
      <div className="border-t border-border pt-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
            <Icon name="AlertCircle" size={18} className="text-error" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{emergencyContact?.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{emergencyContact?.description}</p>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Icon name="Phone" size={14} className="mr-2 text-muted-foreground" />
                <a 
                  href={`tel:${emergencyContact?.phone}`}
                  className="text-primary hover:underline"
                >
                  {emergencyContact?.phone}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Mail" size={14} className="mr-2 text-muted-foreground" />
                <a 
                  href={`mailto:${emergencyContact?.email}`}
                  className="text-primary hover:underline"
                >
                  {emergencyContact?.email}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Clock" size={14} className="mr-2 text-muted-foreground" />
                <span className="text-success">{emergencyContact?.available}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Submit Ticket Button */}
      <Button className="w-full mt-4" onClick={() => alert('Support ticket form would open here')}>
        <Icon name="Plus" size={16} className="mr-2" />
        Submit Support Ticket
      </Button>
    </div>
  );
};

export default ContactSupport;