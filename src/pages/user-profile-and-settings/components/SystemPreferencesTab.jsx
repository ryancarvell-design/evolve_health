import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const SystemPreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    pageSize: '25',
    autoSave: true,
    soundNotifications: true,
    keyboardShortcuts: true,
    compactMode: false,
    rightToLeftLayout: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false
  });

  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#2563eb',
    accentColor: '#10b981',
    backgroundColor: '#ffffff'
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleCustomThemeChange = (key, value) => {
    setCustomTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = () => {
    console.log('Saving system preferences:', preferences);
    console.log('Custom theme:', customTheme);
    alert('System preferences updated successfully!');
  };

  const handleResetPreferences = () => {
    if (confirm('Are you sure you want to reset all preferences to defaults?')) {
      setPreferences({
        theme: 'light',
        language: 'en',
        timezone: 'America/Los_Angeles',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12-hour',
        pageSize: '25',
        autoSave: true,
        soundNotifications: true,
        keyboardShortcuts: true,
        compactMode: false,
        rightToLeftLayout: false,
        highContrast: false,
        largeText: false,
        screenReader: false,
        reducedMotion: false
      });
      alert('Preferences reset to defaults');
    }
  };

  const themes = [
    { value: 'light', label: 'Light Theme', description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark Theme', description: 'Easy on the eyes in low light' },
    { value: 'system', label: 'System Theme', description: 'Follow your device settings' },
    { value: 'custom', label: 'Custom Theme', description: 'Create your own color scheme' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
  ];

  const timezones = [
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">System Preferences</h2>
          <p className="text-muted-foreground mt-1">
            Customize your Evolve Health experience with personalized settings and accessibility options.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleResetPreferences}
            variant="outline"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSavePreferences}
            iconName="Check"
          >
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Theme & Appearance */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Theme & Appearance</h3>
        
        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {themes?.map((theme) => (
              <label key={theme?.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={theme?.value}
                  checked={preferences?.theme === theme?.value}
                  onChange={(e) => handlePreferenceChange('theme', e?.target?.value)}
                  className="sr-only peer"
                />
                <div className="p-4 border border-border rounded-lg peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-muted transition-clinical">
                  <div className="font-medium text-foreground">{theme?.label}</div>
                  <div className="text-sm text-muted-foreground">{theme?.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Theme Colors */}
        {preferences?.theme === 'custom' && (
          <div className="mb-6 p-4 bg-background border border-border rounded-md">
            <h4 className="font-medium text-foreground mb-3">Custom Theme Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme?.primaryColor}
                    onChange={(e) => handleCustomThemeChange('primaryColor', e?.target?.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme?.primaryColor}
                    onChange={(e) => handleCustomThemeChange('primaryColor', e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme?.accentColor}
                    onChange={(e) => handleCustomThemeChange('accentColor', e?.target?.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme?.accentColor}
                    onChange={(e) => handleCustomThemeChange('accentColor', e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Background Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme?.backgroundColor}
                    onChange={(e) => handleCustomThemeChange('backgroundColor', e?.target?.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme?.backgroundColor}
                    onChange={(e) => handleCustomThemeChange('backgroundColor', e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Appearance Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-foreground">Compact Mode</span>
              <input
                type="checkbox"
                checked={preferences?.compactMode}
                onChange={(e) => handlePreferenceChange('compactMode', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
            <p className="text-xs text-muted-foreground">Reduce spacing and padding for more content</p>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Language & Region</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select
              value={preferences?.language}
              onChange={(e) => handlePreferenceChange('language', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languages?.map((lang) => (
                <option key={lang?.value} value={lang?.value}>
                  {lang?.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={preferences?.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timezones?.map((tz) => (
                <option key={tz?.value} value={tz?.value}>
                  {tz?.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
            <select
              value={preferences?.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY (Verbose)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Time Format</label>
            <select
              value={preferences?.timeFormat}
              onChange={(e) => handlePreferenceChange('timeFormat', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="12-hour">12-hour (AM/PM)</option>
              <option value="24-hour">24-hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Behavior */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">System Behavior</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Items per page</label>
            <select
              value={preferences?.pageSize}
              onChange={(e) => handlePreferenceChange('pageSize', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="10">10 items</option>
              <option value="25">25 items</option>
              <option value="50">50 items</option>
              <option value="100">100 items</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">Auto-save</span>
                <span className="text-xs text-muted-foreground">Automatically save changes as you type</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.autoSave}
                onChange={(e) => handlePreferenceChange('autoSave', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">Sound notifications</span>
                <span className="text-xs text-muted-foreground">Play sounds for notifications and alerts</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.soundNotifications}
                onChange={(e) => handlePreferenceChange('soundNotifications', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">Keyboard shortcuts</span>
                <span className="text-xs text-muted-foreground">Enable keyboard shortcuts for faster navigation</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.keyboardShortcuts}
                onChange={(e) => handlePreferenceChange('keyboardShortcuts', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Accessibility Options */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Accessibility Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">High contrast mode</span>
                <span className="text-xs text-muted-foreground">Increase color contrast for better visibility</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.highContrast}
                onChange={(e) => handlePreferenceChange('highContrast', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">Large text</span>
                <span className="text-xs text-muted-foreground">Increase font sizes throughout the interface</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.largeText}
                onChange={(e) => handlePreferenceChange('largeText', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">Screen reader support</span>
                <span className="text-xs text-muted-foreground">Optimize interface for screen readers</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.screenReader}
                onChange={(e) => handlePreferenceChange('screenReader', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-foreground block">Reduced motion</span>
                <span className="text-xs text-muted-foreground">Minimize animations and transitions</span>
              </div>
              <input
                type="checkbox"
                checked={preferences?.reducedMotion}
                onChange={(e) => handlePreferenceChange('reducedMotion', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative cursor-pointer"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      {preferences?.keyboardShortcuts && (
        <div className="bg-muted border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">Navigation</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+D</kbd> - Dashboard</li>
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+L</kbd> - Document Library</li>
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+N</kbd> - New Document</li>
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+P</kbd> - Profile Settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Actions</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+S</kbd> - Save</li>
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+Z</kbd> - Undo</li>
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Ctrl+/</kbd> - Show all shortcuts</li>
                <li><kbd className="px-2 py-1 bg-background border border-border rounded">Esc</kbd> - Close modal/menu</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* HIPAA Compliance Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-primary">System Preferences & HIPAA Compliance</p>
            <p className="text-primary/80 mt-1">
              Your system preferences are stored securely and in compliance with HIPAA regulations. 
              Accessibility settings are particularly important for ensuring equal access to patient information 
              and healthcare documentation tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPreferencesTab;