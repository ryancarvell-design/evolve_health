import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ className = '' }) => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        setError(error?.message || 'Login failed. Please try again.');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick login with demo credentials
  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Icon name="Stethoscope" size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Evolve Health account</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Demo Credentials Section */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Icon name="Key" size={16} />
            Demo Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="text-gray-700">
                <strong>Admin:</strong> admin@evolvehealth.com
              </span>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@evolvehealth.com', 'admin123')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Use
              </button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="text-gray-700">
                <strong>Doctor:</strong> doctor@evolvehealth.com
              </span>
              <button
                type="button"
                onClick={() => handleDemoLogin('doctor@evolvehealth.com', 'doctor123')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Use
              </button>
            </div>
            <p className="text-xs text-blue-700 italic">Password for both: see migration file</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData?.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                disabled={isLoading}
              />
              <Icon name="Mail" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData?.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <Icon name="Lock" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Icon name="LogIn" size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Create Account
            </Link>
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">🚀 New Features Available</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Icon name="FileText" size={12} className="text-green-600" />
              <span>Advanced PDF Document Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Database" size={12} className="text-blue-600" />
              <span>Secure Cloud Storage with Supabase</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={12} className="text-purple-600" />
              <span>AI-Powered Document Enhancement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;