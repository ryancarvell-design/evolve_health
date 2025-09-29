import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PersonalInformationTab from './components/PersonalInformationTab';
import AccountSecurityTab from './components/AccountSecurityTab';
import NotificationPreferencesTab from './components/NotificationPreferencesTab';
import PrivacyControlsTab from './components/PrivacyControlsTab';
import HealthcareSettingsTab from './components/HealthcareSettingsTab';
import SystemPreferencesTab from './components/SystemPreferencesTab';

const UserProfileAndSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['personal', 'security', 'notifications', 'privacy', 'healthcare', 'system']?.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: 'User' },
    { id: 'security', label: 'Account Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notification Preferences', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy Controls', icon: 'Lock' },
    { id: 'healthcare', label: 'Healthcare Settings', icon: 'Stethoscope' },
    { id: 'system', label: 'System Preferences', icon: 'Settings' }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile & Settings' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInformationTab />;
      case 'security':
        return <AccountSecurityTab />;
      case 'notifications':
        return <NotificationPreferencesTab />;
      case 'privacy':
        return <PrivacyControlsTab />;
      case 'healthcare':
        return <HealthcareSettingsTab />;
      case 'system':
        return <SystemPreferencesTab />;
      default:
        return <PersonalInformationTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <main className={`pt-16 transition-clinical ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              User Profile & Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account information, security settings, and healthcare professional preferences.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-clinical-sm overflow-hidden">
            {/* Tab Navigation - Desktop */}
            <div className="hidden md:block border-b border-border">
              <nav className="flex">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-clinical ${
                      activeTab === tab?.id
                        ? 'border-b-2 border-primary text-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="w-5 h-5 mr-2">
                      {tab?.icon === 'User' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {tab?.icon === 'Shield' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                      {tab?.icon === 'Bell' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      )}
                      {tab?.icon === 'Lock' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      {tab?.icon === 'Stethoscope' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )}
                      {tab?.icon === 'Settings' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Navigation - Mobile */}
            <div className="md:hidden border-b border-border p-4">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e?.target?.value)}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {tabs?.map((tab) => (
                  <option key={tab?.id} value={tab?.id}>
                    {tab?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileAndSettings;