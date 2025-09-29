import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    lastUpdated: new Date(),
    services: []
  });

  // Simulate real-time system status
  useEffect(() => {
    const services = [
      {
        name: 'Authentication Service',
        status: 'operational',
        uptime: '99.98%'
      },
      {
        name: 'Document Storage',
        status: 'operational',
        uptime: '99.95%'
      },
      {
        name: 'AI Assistant',
        status: 'operational',
        uptime: '99.92%'
      },
      {
        name: 'Voice Transcription',
        status: 'operational',
        uptime: '99.89%'
      },
      {
        name: 'Real-time Collaboration',
        status: 'operational',
        uptime: '99.96%'
      },
      {
        name: 'API Services',
        status: 'maintenance',
        uptime: '99.94%',
        note: 'Scheduled maintenance in progress'
      }
    ];

    setSystemStatus({
      overall: 'operational',
      lastUpdated: new Date(),
      services
    });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'maintenance':
        return { icon: 'Settings', color: 'text-warning' };
      case 'degraded':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'outage':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'maintenance':
        return 'Maintenance';
      case 'degraded':
        return 'Degraded';
      case 'outage':
        return 'Outage';
      default:
        return 'Unknown';
    }
  };

  const getOverallStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'maintenance':
        return 'text-warning';
      case 'degraded':
        return 'text-warning';
      case 'outage':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleViewDetails = () => {
    alert('Full system status page would open here with:\n• Detailed service metrics\n• Historical uptime data\n• Planned maintenance schedule\n• Real-time incident updates');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">System Status</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="text-muted-foreground hover:text-foreground"
        >
          View Details
          <Icon name="ExternalLink" size={14} className="ml-1" />
        </Button>
      </div>
      {/* Overall Status */}
      <div className="mb-4 p-3 bg-muted/50 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(systemStatus?.overall)?.icon} 
              size={20} 
              className={getOverallStatusColor(systemStatus?.overall)} 
            />
            <span className="font-medium text-foreground">
              All Systems {getStatusText(systemStatus?.overall)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {systemStatus?.lastUpdated?.toLocaleTimeString()}
          </div>
        </div>
      </div>
      {/* Individual Services */}
      <div className="space-y-2">
        {systemStatus?.services?.map((service, index) => {
          const statusInfo = getStatusIcon(service?.status);
          return (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3 flex-1">
                <Icon 
                  name={statusInfo?.icon} 
                  size={16} 
                  className={statusInfo?.color} 
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {service?.name}
                  </div>
                  {service?.note && (
                    <div className="text-xs text-muted-foreground">
                      {service?.note}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {service?.uptime}
              </div>
            </div>
          );
        })}
      </div>
      {/* Status Page Link */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleViewDetails}
        >
          <Icon name="Activity" size={16} className="mr-2" />
          View Full Status Page
        </Button>
      </div>
    </div>
  );
};

export default SystemStatus;