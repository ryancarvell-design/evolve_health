import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import RecentDocumentsTable from './components/RecentDocumentsTable';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import ProductivityChart from './components/ProductivityChart';
import ComplianceReminders from './components/ComplianceReminders';
import { getPersonalizedDashboardData } from '../../utils/dashboardData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Load personalized dashboard data on component mount
  useEffect(() => {
    try {
      const personalizedData = getPersonalizedDashboardData();
      setDashboardData(personalizedData);
    } catch (error) {
      console.error('Error loading personalized dashboard data:', error);
      // Fallback to default data structure
      setDashboardData({
        userName: 'User',
        userEmail: '',
        metrics: [],
        recentDocuments: [],
        teamActivity: [],
        upcomingDeadlines: [],
        productivityData: [],
        complianceReminders: []
      });
    }
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' }
  ];

  // Show loading state while data is being fetched
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={handleSidebarToggle} 
        />
        <main className={`pt-16 transition-clinical ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your personalized dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <main className={`pt-16 transition-layout ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        <div className="p-3 sm:p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Personalized Welcome Section - Mobile Optimized */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back, {dashboardData?.userName}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Here's what's happening with your healthcare documentation today.
            </p>
            {dashboardData?.userEmail && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Signed in as: {dashboardData?.userEmail}
              </p>
            )}
          </div>

          {/* Personalized Metrics Grid - Enhanced Mobile Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {dashboardData?.metrics?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Main Content Grid - Mobile-First Responsive */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 mb-6 sm:mb-8">
            {/* Left Column - User's Recent Documents */}
            <div className="lg:col-span-2">
              <RecentDocumentsTable documents={dashboardData?.recentDocuments || []} />
            </div>

            {/* Right Column - Quick Actions & Activity */}
            <div className="space-y-4 sm:space-y-6">
              <QuickActions />
              <ActivityFeed activities={dashboardData?.teamActivity || []} />
            </div>
          </div>

          {/* Secondary Content Grid - Mobile-First */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* User's Productivity Chart */}
            <div className="lg:col-span-2">
              <ProductivityChart data={dashboardData?.productivityData || []} />
            </div>

            {/* Right Column - User's Deadlines & Compliance */}
            <div className="space-y-4 sm:space-y-6">
              <UpcomingDeadlines deadlines={dashboardData?.upcomingDeadlines || []} />
              <ComplianceReminders reminders={dashboardData?.complianceReminders || []} />
            </div>
          </div>

          {/* User Stats Summary Section - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 bg-card rounded-lg border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
              Your Statistics Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-0">
                <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                  {dashboardData?.metrics?.[0]?.value || '0'}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Documents This Week</div>
              </div>
              <div className="text-center p-3 sm:p-0">
                <div className="text-xl sm:text-2xl font-bold text-accent mb-1">
                  {dashboardData?.metrics?.[2]?.value || '0'}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">AI Interactions</div>
              </div>
              <div className="text-center p-3 sm:p-0">
                <div className="text-xl sm:text-2xl font-bold text-success mb-1">
                  {dashboardData?.metrics?.[3]?.value || '0'}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Assigned Patients</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;