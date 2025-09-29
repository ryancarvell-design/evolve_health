import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead, onUpdatePreferences }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // Filter notifications based on current filter
  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification?.read;
    return notification?.type === filter;
  }) || [];

  // Get notification count by type
  const getCounts = () => {
    const total = notifications?.length || 0;
    const unread = notifications?.filter(n => !n?.read)?.length || 0;
    const patient = notifications?.filter(n => n?.type === 'patient')?.length || 0;
    const document = notifications?.filter(n => n?.type === 'document')?.length || 0;
    const team = notifications?.filter(n => n?.type === 'team')?.length || 0;
    const system = notifications?.filter(n => n?.type === 'system')?.length || 0;
    const appointment = notifications?.filter(n => n?.type === 'appointment')?.length || 0;
    const compliance = notifications?.filter(n => n?.type === 'compliance')?.length || 0;

    return { total, unread, patient, document, team, system, appointment, compliance };
  };

  const counts = getCounts();

  const getNotificationIcon = (type) => {
    const iconMap = {
      patient: 'UserCheck',
      document: 'FileText',
      team: 'Users',
      system: 'AlertTriangle',
      appointment: 'Calendar',
      compliance: 'Shield'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-500';
    if (priority === 'medium') return 'text-amber-500';
    
    const colorMap = {
      patient: 'text-blue-500',
      document: 'text-green-500',
      team: 'text-purple-500',
      system: 'text-red-500',
      appointment: 'text-indigo-500',
      compliance: 'text-orange-500'
    };
    return colorMap?.[type] || 'text-gray-500';
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

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    onMarkAsRead?.(notification?.id);

    // Navigate to relevant section based on notification type
    switch (notification?.type) {
      case 'patient': navigate('/dashboard?tab=patients');
        break;
      case 'document':
        navigate('/document-library');
        break;
      case 'team': navigate('/collaboration-hub');
        break;
      case 'appointment': navigate('/dashboard?tab=appointments');
        break;
      case 'compliance': navigate('/dashboard?tab=compliance');
        break;
      default:
        navigate('/dashboard');
    }
    onClose?.();
  };

  const handlePreferencesClick = () => {
    navigate('/user-profile-and-settings?tab=notifications');
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-20 z-150" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-16 w-96 h-[calc(100vh-4rem)] bg-popover border-l border-border shadow-clinical-xl z-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} />
            <h2 className="text-lg font-semibold text-popover-foreground">Notifications</h2>
            {counts?.unread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {counts?.unread}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMarkAllAsRead}
              disabled={counts?.unread === 0}
            >
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-4 gap-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'all' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              All ({counts?.total})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'unread' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              Unread ({counts?.unread})
            </button>
            <button
              onClick={() => setFilter('patient')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'patient' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              Patients ({counts?.patient})
            </button>
            <button
              onClick={() => setFilter('document')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'document' 
                  ? 'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              Docs ({counts?.document})
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs mt-1">
            <button
              onClick={() => setFilter('team')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'team' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              Team ({counts?.team})
            </button>
            <button
              onClick={() => setFilter('appointment')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'appointment' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              Appts ({counts?.appointment})
            </button>
            <button
              onClick={() => setFilter('compliance')}
              className={`p-2 rounded text-center transition-clinical ${
                filter === 'compliance' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-popover-foreground hover:bg-muted'
              }`}
            >
              Comp ({counts?.compliance})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Icon name="Bell" size={48} className="mb-4 opacity-50" />
              <p className="text-sm">No notifications found</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="text-xs text-primary hover:underline mt-2"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications?.map((notification) => (
                <div
                  key={notification?.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-muted transition-clinical ${
                    !notification?.read ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-background ${getNotificationColor(notification?.type, notification?.priority)}`}>
                      <Icon name={getNotificationIcon(notification?.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${
                          !notification?.read ? 'text-popover-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification?.title}
                        </p>
                        <div className="flex items-center space-x-2 ml-2">
                          {notification?.priority === 'high' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                          {!notification?.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification?.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification?.timestamp)}
                        </span>
                        {notification?.actionLabel && (
                          <span className="text-xs text-primary font-medium">
                            {notification?.actionLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreferencesClick}
            className="w-full"
          >
            <Icon name="Settings" size={16} className="mr-2" />
            Notification Preferences
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;