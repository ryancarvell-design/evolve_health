import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const NotificationPreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    email: {
      documentUpdates: true,
      collaborationRequests: true,
      systemNotifications: false,
      securityAlerts: true,
      complianceReminders: true,
      weeklyReports: true,
      marketingEmails: false
    },
    sms: {
      urgentAlerts: true,
      appointmentReminders: true,
      securityAlerts: true,
      systemDowntime: false
    },
    inApp: {
      documentComments: true,
      taskAssignments: true,
      mentionNotifications: true,
      systemUpdates: true,
      complianceDeadlines: true
    }
  });

  const handlePreferenceChange = (category, preference, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [preference]: value
      }
    }));
  };

  const handleSavePreferences = () => {
    // Here you would save preferences to your backend
    console.log('Saving notification preferences:', preferences);
    alert('Notification preferences updated successfully!');
  };

  const PreferenceSection = ({ title, category, preferences, description }) => (
    <div className="bg-muted border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">
        {Object.entries(preferences)?.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div>
              <label className="text-sm font-medium text-foreground block">
                {getPreferenceLabel(key)}
              </label>
              <p className="text-xs text-muted-foreground">
                {getPreferenceDescription(key)}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handlePreferenceChange(category, key, e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const getPreferenceLabel = (key) => {
    const labels = {
      documentUpdates: 'Document Updates',
      collaborationRequests: 'Collaboration Requests',
      systemNotifications: 'System Notifications',
      securityAlerts: 'Security Alerts',
      complianceReminders: 'Compliance Reminders',
      weeklyReports: 'Weekly Reports',
      marketingEmails: 'Marketing Emails',
      urgentAlerts: 'Urgent Alerts',
      appointmentReminders: 'Appointment Reminders',
      systemDowntime: 'System Downtime',
      documentComments: 'Document Comments',
      taskAssignments: 'Task Assignments',
      mentionNotifications: 'Mentions',
      systemUpdates: 'System Updates',
      complianceDeadlines: 'Compliance Deadlines'
    };
    return labels?.[key] || key;
  };

  const getPreferenceDescription = (key) => {
    const descriptions = {
      documentUpdates: 'Notifications when documents are created, updated, or shared with you',
      collaborationRequests: 'Requests to collaborate on documents or join teams',
      systemNotifications: 'General system updates and maintenance notifications',
      securityAlerts: 'Important security events and suspicious activity alerts',
      complianceReminders: 'HIPAA compliance training and audit reminders',
      weeklyReports: 'Weekly summary of your activity and team performance',
      marketingEmails: 'Product updates, feature announcements, and promotional content',
      urgentAlerts: 'Critical alerts that require immediate attention',
      appointmentReminders: 'Reminders for upcoming appointments and deadlines',
      systemDowntime: 'Notifications about scheduled maintenance and outages',
      documentComments: 'New comments on documents you&apos;re involved with',
      taskAssignments: 'New tasks assigned to you or task status updates',
      mentionNotifications: 'When someone mentions you in comments or messages',
      systemUpdates: 'Real-time updates about system status and new features',
      complianceDeadlines: 'Upcoming compliance deadlines and requirements'
    };
    return descriptions?.[key] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Notification Preferences</h2>
          <p className="text-muted-foreground mt-1">
            Choose how and when you want to receive notifications about your healthcare documentation activities.
          </p>
        </div>
        <Button
          onClick={handleSavePreferences}
          iconName="Check"
        >
          Save Preferences
        </Button>
      </div>

      {/* Email Notifications */}
      <PreferenceSection
        title="Email Notifications"
        category="email"
        preferences={preferences?.email}
        description="Control which email notifications you receive in your inbox"
      />

      {/* SMS Notifications */}
      <PreferenceSection
        title="SMS Notifications"
        category="sms"
        preferences={preferences?.sms}
        description="Critical notifications sent directly to your mobile phone"
      />

      {/* In-App Notifications */}
      <PreferenceSection
        title="In-App Notifications"
        category="inApp"
        preferences={preferences?.inApp}
        description="Notifications that appear within the Evolve Health platform"
      />

      {/* Notification Schedule */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Notification Schedule</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set quiet hours when you don't want to receive non-urgent notifications
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quiet Hours Start
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quiet Hours End
            </label>
            <input
              type="time"
              defaultValue="07:00"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Critical security alerts and urgent notifications will still be delivered during quiet hours
        </p>
      </div>

      {/* HIPAA Compliance Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-primary">HIPAA Compliance & Notifications</p>
            <p className="text-primary/80 mt-1">
              All notification preferences are subject to HIPAA compliance requirements. 
              Critical security alerts and compliance notifications cannot be disabled to ensure 
              regulatory compliance and patient data protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesTab;