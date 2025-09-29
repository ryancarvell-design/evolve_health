import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { setAuthState, authenticateUser } from '../../../utils/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Use the new authentication utility
      const authenticatedUser = authenticateUser(formData?.email, formData?.password);
      
      if (authenticatedUser) {
        // Successful login - use auth utility
        const userData = {
          email: authenticatedUser?.email,
          additionalData: {
            name: authenticatedUser?.name,
            role: authenticatedUser?.role,
            department: authenticatedUser?.department,
            id: authenticatedUser?.id,
            loginTime: new Date()?.toISOString()
          }
        };
        
        setAuthState(userData);
        navigate('/dashboard');
        
      } else {
        // Failed login - show available credentials for demo
        setErrors({
          general: 'Invalid credentials. Available accounts: dr.sarah@evolvehealth.com or lauren.carvell@evolve.com.au'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password or show modal
    alert('Password reset link would be sent to your email');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-clinical-lg p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your HIPAA-compliant healthcare platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={16} className="text-red-600 mr-2" />
                <p className="text-sm text-red-700">{errors?.general}</p>
              </div>
            </div>
          )}

          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your professional email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            className="w-full"
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-clinical"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            fullWidth
            className="w-full"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Additional Links */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary hover:text-primary/80 transition-clinical"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={handleCreateAccount}
              className="text-primary hover:text-primary/80 transition-clinical"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Icon name="Shield" size={14} className="mr-1" />
            <span>Protected by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;