import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { getCurrentUser } from '../../utils/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location?.pathname]);

  // Handle mobile sidebar close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event?.target?.closest('[data-sidebar="mobile"]') && !event?.target?.closest('[data-sidebar="toggle"]')) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: 'BarChart3',
      path: '/dashboard',
      description: 'Overview and insights'
    },
    {
      name: 'Document Library',
      icon: 'FileText',
      path: '/document-library',
      description: 'Manage your documents'
    },
    {
      name: 'Patient Registry',
      icon: 'Users',
      path: '/patient-registry',
      description: 'Patient management'
    },
    {
      name: 'Document Creation',
      icon: 'Plus',
      path: '/document-creation-hub',
      description: 'Create new documents'
    },
    {
      name: 'Analytics',
      icon: 'TrendingUp',
      path: '/analytics-dashboard',
      description: 'Performance analytics'
    },
    {
      name: 'Collaboration Hub',
      icon: 'MessageSquare',
      path: '/collaboration-hub',
      description: 'Team collaboration'
    },
    {
      name: 'Team Management',
      icon: 'UserCheck',
      path: '/team-management',
      description: 'Manage team members'
    }
  ];

  const MenuItem = ({ item, isActive, isMobile = false, showDescription = true }) => (
    <button
      onClick={() => handleNavigation(item?.path)}
      className={`
        group w-full flex items-center transition-all duration-200 rounded-lg text-left
        ${isCollapsed && !isMobile ? 'px-2 py-2 justify-center' : 'px-3 py-2.5 space-x-3'}
        ${isActive 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
        }
      `}
      title={isCollapsed && !isMobile ? item?.name : undefined}
    >
      <div className="flex-shrink-0">
        <Icon 
          name={item?.icon} 
          size={20} 
          className={`transition-colors ${isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'}`}
        />
      </div>
      
      {(!isCollapsed || isMobile) && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">
            {item?.name}
          </div>
          {showDescription && !isActive && (
            <div className="text-xs opacity-70 truncate">
              {item?.description}
            </div>
          )}
        </div>
      )}
    </button>
  );

  const UserProfile = ({ isMobile = false }) => (
    <div className={`p-4 border-b border-border bg-card/50 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
      {isCollapsed && !isMobile ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={20} color="white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {currentUser?.data?.name || 'Lauren Carvell'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Healthcare Professional
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <UserProfile isMobile={isMobile} />
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems?.map((item) => {
          const isActive = location?.pathname === item?.path;
          return (
            <MenuItem 
              key={item?.path} 
              item={item} 
              isActive={isActive}
              isMobile={isMobile}
              showDescription={!isCollapsed || isMobile}
            />
          );
        })}
      </nav>

      {!isMobile && (
        <div className="p-4 border-t border-border">
          <button
            onClick={toggleCollapsed}
            className={`
              w-full flex items-center transition-all duration-200 rounded-lg
              text-muted-foreground hover:text-foreground hover:bg-muted/60
              ${isCollapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2 space-x-2'}
            `}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        data-sidebar="toggle"
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-[60] w-11 h-11 bg-card border border-border rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={20} className="text-foreground" />
      </button>

      {/* Desktop Sidebar */}
      <aside 
        className={`
          hidden lg:block fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-[50]
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Mobile Sidebar Panel */}
          <aside 
            data-sidebar="mobile"
            className={`
              lg:hidden fixed left-0 top-0 h-full w-64 z-[56]
              transform transition-transform duration-300 ease-in-out
              ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="h-full flex flex-col bg-card shadow-2xl">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <SidebarContent isMobile />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;