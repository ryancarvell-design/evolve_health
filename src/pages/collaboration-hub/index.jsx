import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConversationsList from './components/ConversationsList';
import MessageArea from './components/MessageArea';
import TeamDirectory from './components/TeamDirectory';
import SharedDocuments from './components/SharedDocuments';
import VideoCallModal from './components/VideoCallModal';

const CollaborationHub = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Initialize responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const breadcrumbItems = [
    { label: 'Collaboration Hub', href: '/collaboration-hub' }
  ];

  const tabs = [
    { id: 'conversations', label: 'Conversations', icon: 'MessageSquare', shortLabel: 'Chat' },
    { id: 'directory', label: 'Team Directory', icon: 'Users', shortLabel: 'Team' },
    { id: 'documents', label: 'Shared Documents', icon: 'FileText', shortLabel: 'Docs' },
    { id: 'meetings', label: 'Meetings', icon: 'Video', shortLabel: 'Meet' }
  ];

  const handleStartVideoCall = () => {
    setIsVideoCallOpen(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallOpen(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowMobileNav(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'conversations':
        return (
          <div className="flex h-full">
            <div className={`${isMobile ? 'w-full' : 'w-1/3'} ${isMobile && selectedConversation ? 'hidden' : ''}`}>
              <ConversationsList 
                onSelectConversation={setSelectedConversation}
                selectedConversation={selectedConversation}
                isMobile={isMobile}
              />
            </div>
            <div className={`${isMobile ? 'w-full' : 'flex-1'} ${isMobile && !selectedConversation ? 'hidden' : ''}`}>
              <MessageArea 
                conversation={selectedConversation}
                onStartVideoCall={handleStartVideoCall}
                onBack={isMobile ? () => setSelectedConversation(null) : null}
                isMobile={isMobile}
              />
            </div>
          </div>
        );
      case 'directory':
        return <TeamDirectory isMobile={isMobile} />;
      case 'documents':
        return <SharedDocuments isMobile={isMobile} />;
      case 'meetings':
        return (
          <div className="flex-1 flex items-center justify-center bg-card p-6">
            <div className="text-center max-w-md">
              <Icon name="Video" size={isMobile ? 40 : 48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-foreground mb-2`}>
                No Active Meetings
              </h3>
              <p className={`text-muted-foreground mb-6 ${isMobile ? 'text-sm' : ''}`}>
                Schedule a meeting or start an instant video call with your team.
              </p>
              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-3'}`}>
                <Button onClick={handleStartVideoCall} className={isMobile ? 'w-full' : ''}>
                  <Icon name="Video" size={16} className="mr-2" />
                  Start Video Call
                </Button>
                <Button variant="outline" className={isMobile ? 'w-full' : ''}>
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        {/* Header Section - Responsive */}
        <div className="p-3 sm:p-6 pb-0">
          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden sm:block mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  Collaboration Hub
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isMobile 
                    ? "Connect with your team" :"Connect and collaborate with your healthcare team in real-time."
                  }
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-3">
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {isMobile ? "12 online" : "12 team members online"}
                </div>
                <Button 
                  onClick={handleStartVideoCall}
                  size={isMobile ? "sm" : "default"}
                  className="text-sm sm:text-base"
                >
                  <Icon name="Video" size={16} className="mr-1 sm:mr-2" />
                  {isMobile ? "Call" : "Start Video Call"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Mobile Responsive */}
        <div className="border-b border-border bg-card">
          <div className="px-3 sm:px-6">
            {isMobile ? (
              /* Mobile Tab Navigation - Scrollable */
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`
                      flex flex-col items-center py-3 px-4 border-b-2 text-xs font-medium transition-colors whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={16} className="mb-1" />
                    {tab?.shortLabel}
                  </button>
                ))}
              </div>
            ) : (
              /* Desktop Tab Navigation */
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`
                      flex items-center py-4 px-2 border-b-2 text-sm font-medium transition-colors
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={16} className="mr-2" />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Tab Content - Responsive Height */}
        <div className={`${isMobile ? 'h-[calc(100vh-12rem)]' : 'h-[calc(100vh-16rem)]'} overflow-hidden`}>
          {renderTabContent()}
        </div>
      </main>

      {/* Video Call Modal */}
      {isVideoCallOpen && (
        <VideoCallModal 
          onClose={handleEndVideoCall} 
          isMobile={isMobile}
        />
      )}

      {/* Mobile floating action button for quick video call */}
      {isMobile && (
        <button
          onClick={handleStartVideoCall}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 z-40"
        >
          <Icon name="Video" size={24} />
        </button>
      )}
    </div>
  );
};

export default CollaborationHub;