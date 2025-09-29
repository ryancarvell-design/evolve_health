import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountSecurityTab = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showSessions, setShowSessions] = useState(false);
  const [errors, setErrors] = useState({});

  const activeSessions = [
    {
      id: 1,
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, CA',
      lastActivity: '2025-08-26T03:30:00Z',
      current: true,
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      device: 'iPhone 15 Pro - Safari',
      location: 'San Francisco, CA',
      lastActivity: '2025-08-26T02:15:00Z',
      current: false,
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      device: 'iPad Air - Safari',
      location: 'San Francisco, CA',
      lastActivity: '2025-08-25T18:45:00Z',
      current: false,
      ipAddress: '192.168.1.102'
    }
  ];

  const loginHistory = [
    {
      id: 1,
      timestamp: '2025-08-26T03:30:00Z',
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, CA',
      status: 'success',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2025-08-26T02:15:00Z',
      device: 'iPhone 15 Pro - Safari',
      location: 'San Francisco, CA',
      status: 'success',
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      timestamp: '2025-08-25T18:45:00Z',
      device: 'iPad Air - Safari',
      location: 'San Francisco, CA',
      status: 'success',
      ipAddress: '192.168.1.102'
    },
    {
      id: 4,
      timestamp: '2025-08-25T09:20:00Z',
      device: 'Windows PC - Edge',
      location: 'Unknown Location',
      status: 'blocked',
      ipAddress: '203.45.67.89'
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleUpdatePassword = () => {
    if (validatePasswordForm()) {
      // Here you would call your password update API
      console.log('Updating password...');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    }
  };

  const handleToggleTwoFactor = () => {
    if (twoFactorEnabled) {
      if (confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
        setTwoFactorEnabled(false);
        alert('Two-factor authentication disabled. We recommend keeping it enabled for better security.');
      }
    } else {
      // Here you would typically start the 2FA setup process
      alert('Two-factor authentication setup would be initiated here with QR code scanning.');
      setTwoFactorEnabled(true);
    }
  };

  const handleTerminateSession = (sessionId) => {
    if (confirm('Are you sure you want to terminate this session?')) {
      // Here you would call your session termination API
      console.log('Terminating session:', sessionId);
      alert('Session terminated successfully');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString)?.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Account Security</h2>
        <p className="text-muted-foreground">
          Manage your password, two-factor authentication, and monitor account access.
        </p>
      </div>

      {/* Password Change Section */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm?.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
              error={errors?.currentPassword}
              required
            />
          </div>
          <div>
            <Input
              label="New Password"
              type="password"
              value={passwordForm?.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
              error={errors?.newPassword}
              description="Must be at least 8 characters long"
              required
            />
          </div>
          <div>
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm?.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              required
            />
          </div>
        </div>
        <Button
          onClick={handleUpdatePassword}
          iconName="Lock"
        >
          Update Password
        </Button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              onClick={handleToggleTwoFactor}
              variant={twoFactorEnabled ? 'danger' : 'default'}
              size="sm"
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
        
        {twoFactorEnabled && (
          <div className="bg-success/10 border border-success/20 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-success font-medium">
                Two-factor authentication is active and protecting your account
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Active Sessions</h3>
          <Button
            onClick={() => setShowSessions(!showSessions)}
            variant="outline"
            size="sm"
            iconName={showSessions ? 'ChevronUp' : 'ChevronDown'}
          >
            {showSessions ? 'Hide' : 'Show'} Sessions
          </Button>
        </div>
        
        {showSessions && (
          <div className="space-y-3">
            {activeSessions?.map((session) => (
              <div key={session?.id} className="bg-background border border-border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{session?.device}</h4>
                      {session?.current && (
                        <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session?.location} • Last active: {formatDateTime(session?.lastActivity)}
                    </p>
                    <p className="text-xs text-muted-foreground">IP: {session?.ipAddress}</p>
                  </div>
                  {!session?.current && (
                    <Button
                      onClick={() => handleTerminateSession(session?.id)}
                      variant="outline"
                      size="sm"
                      iconName="X"
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login History with HIPAA Audit Trail */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Login History & HIPAA Audit Trail</h3>
        <div className="space-y-3">
          {loginHistory?.slice(0, 5)?.map((login) => (
            <div key={login?.id} className="bg-background border border-border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{login?.device}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      login?.status === 'success' ?'bg-success/10 text-success border border-success/20' :'bg-error/10 text-error border border-error/20'
                    }`}>
                      {login?.status === 'success' ? 'Successful' : 'Blocked'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {login?.location} • {formatDateTime(login?.timestamp)}
                  </p>
                  <p className="text-xs text-muted-foreground">IP: {login?.ipAddress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* HIPAA Compliance Notice */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-primary">HIPAA Audit Compliance</p>
              <p className="text-primary/80 mt-1">
                All login attempts and security events are logged for compliance with HIPAA audit requirements. 
                This information is retained for regulatory purposes and can be accessed by authorized personnel only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurityTab;