import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import AppImage from '../AppImage';
import Button from './Button';
import NotificationPanel from './NotificationPanel';
import { performLogout, getCurrentUser, updateLastActivity } from '../../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Load current user data
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Update last activity on user interaction
  useEffect(() => {
    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events?.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events?.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, []);

  // Sample healthcare notifications data
  useEffect(() => {
    const sampleNotifications = [
      {
        id: '1',
        type: 'patient',
        priority: 'high',
        title: 'Critical Patient Alert',
        message: 'Patient John Smith (ID: 12345) requires immediate attention. Latest vitals show concerning trends.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)?.toISOString(),
        read: false,
        actionLabel: 'View Patient'
      },
      {
        id: '2',
        type: 'document',
        priority: 'medium',
        title: 'Document Review Required',
        message: 'Treatment plan for Maria Rodriguez needs your approval before implementation.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)?.toISOString(),
        read: false,
        actionLabel: 'Review Now'
      },
      {
        id: '3',
        type: 'team',
        priority: 'low',
        title: 'Team Message',
        message: 'Dr. Williams shared new research findings in Cardiology team chat.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)?.toISOString(),
        read: true,
        actionLabel: 'View Message'
      },
      {
        id: '4',
        type: 'system',
        priority: 'medium',
        title: 'System Update',
        message: 'Scheduled maintenance will occur tonight at 11 PM EST. Please save your work.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)?.toISOString(),
        read: false,
        actionLabel: 'Learn More'
      },
      {
        id: '5',
        type: 'appointment',
        priority: 'medium',
        title: 'Appointment Reminder',
        message: 'You have 3 appointments scheduled for tomorrow starting at 9:00 AM.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)?.toISOString(),
        read: false,
        actionLabel: 'View Calendar'
      },
      {
        id: '6',
        type: 'compliance',
        priority: 'high',
        title: 'Compliance Reminder',
        message: 'Annual HIPAA training deadline is approaching (Due: Dec 15, 2024).',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
        read: false,
        actionLabel: 'Start Training'
      },
      {
        id: '7',
        type: 'patient',
        priority: 'low',
        title: 'Patient Update',
        message: 'Emily Johnson has uploaded new health metrics to her patient portal.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)?.toISOString(),
        read: true,
        actionLabel: 'View Metrics'
      },
      {
        id: '8',
        type: 'document',
        priority: 'low',
        title: 'Document Shared',
        message: 'New clinical guidelines for diabetes management have been added to the library.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)?.toISOString(),
        read: true,
        actionLabel: 'View Document'
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
    // Close profile dropdown if open
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleSearch = (e) => {
    if (e?.key === 'Enter' && searchQuery?.trim()) {
      navigate(`/document-library?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleHelp = () => {
    navigate('/help-centre');
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to sign out? Any unsaved work will be lost.'
    );
    
    if (!confirmLogout) return;
    
    setIsLoggingOut(true);
    setIsProfileOpen(false);
    
    try {
      // Perform logout with cleanup
      const logoutSuccess = await performLogout(true); // preserve preferences
      
      if (logoutSuccess) {
        // Show success message briefly before redirect
        const successMessage = document.createElement('div');
        successMessage.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9999;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Successfully signed out
          </div>
        `;
        
        document.body?.appendChild(successMessage);
        
        // Navigate to login after brief delay
        setTimeout(() => {
          document.body?.removeChild(successMessage);
          navigate('/login', { replace: true });
        }, 1500);
        
      } else {
        // Show error message
        alert('Error occurred during logout. You will be redirected to the login page.');
        navigate('/login', { replace: true });
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred while signing out. You will be redirected to the login page.');
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileAction = (action) => {
    setIsProfileOpen(false);
    
    switch (action) {
      case 'profile': navigate('/user-profile-and-settings');
        break;
      case 'preferences': navigate('/user-profile-and-settings?tab=notifications');
        break;
      case 'security': navigate('/user-profile-and-settings?tab=security');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleNotificationAction = (notificationId, action) => {
    // Handle notification actions like viewing patient, reviewing documents, etc.
    console.log(`Notification ${notificationId} action: ${action}`);
    // Mark as read when action is taken
    handleMarkAsRead(notificationId);
  };

  const handleUpdatePreferences = (preferences) => {
    // Handle notification preferences update
    console.log('Updating notification preferences:', preferences);
    // This could navigate to preferences page or update local state
    navigate('/user-profile-and-settings?tab=notifications');
  };

  const displayName = currentUser?.data?.name || 'Lauren Carvell';
  const displayEmail = currentUser?.email || 'lauren.carvell@evolvehealth.com';
  const unreadCount = notifications?.filter(n => !n?.read)?.length || 0;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 lg:h-20 bg-card border-b border-border z-100">
        <div className="flex items-center justify-between h-full px-3 sm:px-6">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <AppImage
                src="/assets/images/Evolve_Health_Logo_Design-1756189279084.png"
                alt="Evolve Health Logo"
                className="h-8 sm:h-12 lg:h-16 w-auto"
              />
            </div>
          </div>

          {/* Center Section - Search (Hidden on small screens) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search documents, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-clinical"
              />
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Mobile Search Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileSearch}
                className="w-8 h-8 sm:w-10 sm:h-10"
              >
                <Icon name={isMobileSearchOpen ? "X" : "Search"} size={18} />
              </Button>
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative w-8 h-8 sm:w-10 sm:h-10" 
              onClick={toggleNotificationPanel}
            >
              <Icon name="Bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Help - Hidden on small screens */}
            <div className="hidden sm:block">
              <Button variant="ghost" size="icon" onClick={handleHelp} className="w-8 h-8 sm:w-10 sm:h-10">
                <Icon name="HelpCircle" size={18} />
              </Button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                onClick={toggleProfile}
                className="flex items-center space-x-1 sm:space-x-2 px-1 sm:px-2 lg:px-3 py-1"
                disabled={isLoggingOut}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={12} className="sm:w-4 sm:h-4" color="white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground hidden lg:block max-w-20 xl:max-w-24 truncate">
                  {displayName}
                </span>
                <Icon name="ChevronDown" size={12} className="text-muted-foreground hidden sm:block sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-popover border border-border rounded-md shadow-clinical-lg z-200">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                  </div>
                  <div className="py-2">
                    <button 
                      onClick={() => handleProfileAction('profile')}
                      className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                    >
                      <Icon name="User" size={16} className="mr-3" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => handleProfileAction('preferences')}
                      className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                    >
                      <Icon name="Settings" size={16} className="mr-3" />
                      Preferences
                    </button>
                    <button 
                      onClick={() => handleProfileAction('security')}
                      className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                    >
                      <Icon name="Shield" size={16} className="mr-3" />
                      Security
                    </button>
                    {/* Mobile Help Link */}
                    <div className="sm:hidden">
                      <button 
                        onClick={handleHelp}
                        className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                      >
                        <Icon name="HelpCircle" size={16} className="mr-3" />
                        Help Centre
                      </button>
                    </div>
                    <div className="border-t border-border my-2"></div>
                    <button 
                      onClick={() => handleProfileAction('logout')}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-muted transition-clinical disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-3"></div>
                          Signing Out...
                        </>
                      ) : (
                        <>
                          <Icon name="LogOut" size={16} className="mr-3" />
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden border-t border-border px-3 py-3 bg-card">
            <div className="relative">
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search documents, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-clinical"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onUpdatePreferences={handleUpdatePreferences}
        onNotificationAction={handleNotificationAction}
      />
    </>
  );
};

export default Header;