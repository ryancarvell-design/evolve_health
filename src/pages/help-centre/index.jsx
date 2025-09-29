import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';

// Lazy-loaded components for better performance
const SearchBar = React.lazy(() => import('./components/SearchBar'));
const HelpSections = React.lazy(() => import('./components/HelpSections'));
const QuickActions = React.lazy(() => import('./components/QuickActions'));
const VideoTutorials = React.lazy(() => import('./components/VideoTutorials'));
const ContactSupport = React.lazy(() => import('./components/ContactSupport'));
const RecentlyViewed = React.lazy(() => import('./components/RecentlyViewed'));
const SystemStatus = React.lazy(() => import('./components/SystemStatus'));

const HelpCentre = () => {
  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentArticles, setRecentArticles] = useState([]);

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Initialize responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setSidebarCollapsed(width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams?.get('search');
    const category = searchParams?.get('category');
    if (query) setSearchQuery(query);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  // Load recently viewed articles from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('help-recent-articles') || '[]');
    setRecentArticles(recent);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Help Centre' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real app, this would trigger search API call
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleArticleView = (articleId, title) => {
    // Track recently viewed articles
    const updatedRecent = [
      { id: articleId, title, viewedAt: new Date()?.toISOString() },
      ...recentArticles?.filter(article => article?.id !== articleId)
    ]?.slice(0, 5);
    
    setRecentArticles(updatedRecent);
    localStorage.setItem('help-recent-articles', JSON.stringify(updatedRecent));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-3 sm:p-6">
          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden sm:block mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          {/* Header Section - Responsive */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Help Centre
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground">
                {isMobile 
                  ? "Find answers and get support" :"Find answers, get support, and learn how to make the most of Evolve Health"
                }
              </p>
            </div>
          </div>

          {/* Search Bar - Mobile optimized */}
          <React.Suspense fallback={
            <div className="bg-card rounded-lg p-4 mb-6">
              <div className="animate-pulse h-10 bg-muted rounded"></div>
            </div>
          }>
            <SearchBar 
              searchQuery={searchQuery}
              onSearch={handleSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryFilter}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </React.Suspense>

          {/* Main Content Grid - Responsive Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8 order-2 xl:order-1">
              {/* Quick Actions */}
              <React.Suspense fallback={
                <div className="bg-card rounded-lg p-4 sm:p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'} gap-3 sm:gap-4`}>
                      {[1, 2, 3, 4, 5, 6]?.map((i) => (
                        <div key={i} className="h-20 sm:h-24 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              }>
                <QuickActions 
                  onActionClick={handleArticleView} 
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </React.Suspense>

              {/* Help Sections */}
              <React.Suspense fallback={
                <div className="bg-card rounded-lg p-4 sm:p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    {[1, 2, 3]?.map((i) => (
                      <div key={i} className="h-24 sm:h-32 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              }>
                <HelpSections 
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  onArticleView={handleArticleView}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </React.Suspense>

              {/* Video Tutorials - Responsive visibility */}
              <div className={isMobile ? 'block' : 'hidden lg:block'}>
                <React.Suspense fallback={
                  <div className="bg-card rounded-lg p-4 sm:p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-muted rounded w-1/4"></div>
                      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-3 sm:gap-4`}>
                        {[1, 2, 3, 4]?.map((i) => (
                          <div key={i} className="h-32 sm:h-48 bg-muted rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                }>
                  <VideoTutorials 
                    onVideoView={handleArticleView} 
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </React.Suspense>
              </div>
            </div>

            {/* Right Sidebar - Responsive positioning and content */}
            <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-1 xl:order-2">
              {/* Contact Support - Always visible */}
              <React.Suspense fallback={
                <div className="bg-card rounded-lg p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-16 sm:h-20 bg-muted rounded"></div>
                  </div>
                </div>
              }>
                <ContactSupport 
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </React.Suspense>

              {/* System Status - Hidden on mobile to save space */}
              <div className="hidden sm:block">
                <React.Suspense fallback={
                  <div className="bg-card rounded-lg p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-12 sm:h-16 bg-muted rounded"></div>
                    </div>
                  </div>
                }>
                  <SystemStatus 
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </React.Suspense>
              </div>

              {/* Recently Viewed - Hidden on mobile/tablet to save space */}
              <div className="hidden lg:block">
                <React.Suspense fallback={
                  <div className="bg-card rounded-lg p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                      <div className="space-y-2">
                        {[1, 2, 3]?.map((i) => (
                          <div key={i} className="h-6 sm:h-8 bg-muted rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                }>
                  <RecentlyViewed 
                    articles={recentArticles}
                    onArticleClick={handleArticleView}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </React.Suspense>
              </div>
            </div>
          </div>

          {/* Mobile-only System Status Section */}
          {isMobile && (
            <div className="mt-6">
              <React.Suspense fallback={
                <div className="bg-card rounded-lg p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-12 bg-muted rounded"></div>
                  </div>
                </div>
              }>
                <SystemStatus 
                  isMobile={true}
                  isTablet={false}
                />
              </React.Suspense>
            </div>
          )}

          {/* Mobile/Tablet Recently Viewed Section */}
          {(isMobile || isTablet) && recentArticles?.length > 0 && (
            <div className="mt-6">
              <React.Suspense fallback={
                <div className="bg-card rounded-lg p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="space-y-2">
                      {[1, 2]?.map((i) => (
                        <div key={i} className="h-6 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              }>
                <RecentlyViewed 
                  articles={recentArticles?.slice(0, isMobile ? 2 : 3)}
                  onArticleClick={handleArticleView}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isCompact={true}
                />
              </React.Suspense>
            </div>
          )}

          {/* Mobile floating action button for quick contact */}
          {isMobile && (
            <button 
              className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 z-40"
              onClick={() => {
                // Quick contact action
                window.location.href = 'mailto:support@evolve-health.com';
              }}
            >
              <Icon name="MessageCircle" size={24} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default HelpCentre;