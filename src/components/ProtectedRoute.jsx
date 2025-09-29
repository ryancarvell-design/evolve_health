import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isSessionExpired, performLogout } from '../utils/auth';


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      
      try {
        const isUserAuthenticated = isAuthenticated();
        const sessionExpired = isSessionExpired();

        if (!isUserAuthenticated || sessionExpired) {
          if (sessionExpired) {
            // Show session expired message
            const alertContainer = document.createElement('div');
            alertContainer.innerHTML = `
              <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc2626;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 9999;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                max-width: 300px;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Your session has expired. Please sign in again.
              </div>
            `;
            
            document.body?.appendChild(alertContainer);
            
            // Clear expired session
            await performLogout(true);
            
            setTimeout(() => {
              document.body?.removeChild(alertContainer);
            }, 5000);
          }

          // Redirect to login with return URL
          navigate('/login', { 
            replace: true,
            state: { from: location?.pathname }
          });
          return;
        }

        setShouldRender(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, location?.pathname]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Only render children if authentication check passed
  return shouldRender ? children : null;
};

export default ProtectedRoute;