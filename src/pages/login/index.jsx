import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import BackgroundPattern from './components/BackgroundPattern';
import { isAuthenticated } from '../../utils/auth';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      // Login logic would go here
      console.log('Login attempt with:', credentials);
      // After successful login, navigate to dashboard
      // navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated && isMounted) {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Failed to verify authentication status:', error);
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <BackgroundPattern />

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent to-warning rounded-2xl mb-4 shadow-lg">
            <img
              src="/assets/images/Evolve_Health_Logo_Design-1756189279084.png"
              alt="Evolve Health"
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-amber-100 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-300 text-lg">
            Sign in to your healthcare platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-border/20">
          {/* Login Form */}
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
          
          {/* Trust Signals */}
          <TrustSignals />
          
          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <button className="text-accent hover:text-accent/80 transition-colors duration-200 font-medium">
                Forgot Password?
              </button>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <button 
                onClick={() => navigate('/contact')}
                className="text-accent hover:text-accent/80 transition-colors duration-200 font-medium"
              >
                Contact Support
              </button>
            </div>
            
            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-accent hover:text-accent/80 transition-colors duration-200 font-semibold"
                >
                  Start Free Trial
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={16} className="text-accent" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Lock" size={16} className="text-accent" />
              <span className="text-sm">Bank-Level Security</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-4">
            &copy; 2025 Evolve Health. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;