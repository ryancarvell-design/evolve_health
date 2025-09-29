import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const PrivacyControlsTab = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: {
      analyticsData: false,
      usageStatistics: true,
      performanceMetrics: true,
      crashReports: true
    },
    auditAccess: {
      allowAuditReports: true,
      shareWithSupervisors: true,
      includeInTeamReports: true
    },
    consentPreferences: {
      marketingConsent: false,
      researchParticipation: false,
      productImprovementData: true,
      thirdPartyIntegrations: true
    }
  });

  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('7-years');
  const [showDataExport, setShowDataExport] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
  };

  const handleSavePrivacySettings = () => {
    console.log('Saving privacy settings:', privacySettings);
    alert('Privacy settings updated successfully!');
  };

  const handleDataExport = () => {
    console.log('Initiating data export...');
    alert('Data export request initiated. You will receive an email with download instructions within 24-48 hours.');
  };

  const handleDataDeletion = () => {
    const confirmation = prompt(
      'To request account deletion, please type "DELETE MY ACCOUNT" below.\n\nWarning: This action cannot be undone and will permanently delete all your data.'
    );
    
    if (confirmation === 'DELETE MY ACCOUNT') {
      alert('Account deletion request submitted. Our compliance team will review your request within 30 days as required by HIPAA regulations.');
    } else if (confirmation !== null) {
      alert('Deletion cancelled. Please type exactly "DELETE MY ACCOUNT" to confirm.');
    }
  };

  const PrivacySection = ({ title, category, settings, description, critical = false }) => (
    <div className={`border rounded-lg p-6 ${critical ? 'bg-error/5 border-error/20' : 'bg-muted border-border'}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {critical && (
          <p className="text-sm text-error font-medium mt-1">
            These settings are controlled by HIPAA compliance requirements
          </p>
        )}
      </div>
      <div className="space-y-4">
        {Object.entries(settings)?.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div>
              <label className="text-sm font-medium text-foreground block">
                {getSettingLabel(key)}
              </label>
              <p className="text-xs text-muted-foreground">
                {getSettingDescription(key)}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleSettingChange(category, key, e?.target?.checked)}
                className="sr-only peer"
                disabled={critical && (key === 'allowAuditReports' || key === 'shareWithSupervisors')}
              />
              <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${
                critical && (key === 'allowAuditReports' || key === 'shareWithSupervisors') 
                  ? 'bg-muted cursor-not-allowed' : 'bg-border'
              }`}></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const getSettingLabel = (key) => {
    const labels = {
      analyticsData: 'Analytics Data',
      usageStatistics: 'Usage Statistics',
      performanceMetrics: 'Performance Metrics',
      crashReports: 'Crash Reports',
      allowAuditReports: 'Allow Audit Reports',
      shareWithSupervisors: 'Share with Supervisors',
      includeInTeamReports: 'Include in Team Reports',
      marketingConsent: 'Marketing Communications',
      researchParticipation: 'Research Participation',
      productImprovementData: 'Product Improvement Data',
      thirdPartyIntegrations: 'Third-Party Integrations'
    };
    return labels?.[key] || key;
  };

  const getSettingDescription = (key) => {
    const descriptions = {
      analyticsData: 'Allow collection of anonymized usage analytics to improve the platform',
      usageStatistics: 'Share how you use features to help us prioritize development',
      performanceMetrics: 'Help us optimize performance by sharing system metrics',
      crashReports: 'Automatically send crash reports to help us fix bugs',
      allowAuditReports: 'Required: Enable audit trail access for compliance purposes',
      shareWithSupervisors: 'Required: Allow designated supervisors to access your audit logs',
      includeInTeamReports: 'Include your activity in aggregated team performance reports',
      marketingConsent: 'Receive marketing emails about new features and services',
      researchParticipation: 'Participate in optional research studies to improve healthcare',
      productImprovementData: 'Share anonymized usage patterns to enhance user experience',
      thirdPartyIntegrations: 'Allow secure data sharing with authorized third-party tools'
    };
    return descriptions?.[key] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Privacy Controls</h2>
          <p className="text-muted-foreground mt-1">
            Control how your data is used and shared while maintaining HIPAA compliance.
          </p>
        </div>
        <Button
          onClick={handleSavePrivacySettings}
          iconName="Shield"
        >
          Save Privacy Settings
        </Button>
      </div>

      {/* Data Sharing Permissions */}
      <PrivacySection
        title="Data Sharing Permissions"
        category="dataSharing"
        settings={privacySettings?.dataSharing}
        description="Control what anonymous data we can use to improve our services"
      />

      {/* Audit Log Access - HIPAA Required */}
      <PrivacySection
        title="Audit Log Access"
        category="auditAccess"
        settings={privacySettings?.auditAccess}
        description="HIPAA compliance requires certain audit trail configurations"
        critical={true}
      />

      {/* Consent Preferences */}
      <PrivacySection
        title="Consent Preferences"
        category="consentPreferences"
        settings={privacySettings?.consentPreferences}
        description="Manage your consent for optional data usage and communications"
      />

      {/* Data Retention Policy */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Data Retention Policy</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how long your data is retained after account closure
        </p>
        <div className="space-y-3">
          {[
            { value: '3-years', label: '3 Years', description: 'Minimum retention period for healthcare records' },
            { value: '5-years', label: '5 Years', description: 'Standard retention period for most healthcare documentation' },
            { value: '7-years', label: '7 Years (Recommended)', description: 'Extended retention for comprehensive audit trail' },
            { value: '10-years', label: '10 Years', description: 'Maximum retention period for critical healthcare records' }
          ]?.map((option) => (
            <label key={option?.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="retention"
                value={option?.value}
                checked={dataRetentionPeriod === option?.value}
                onChange={(e) => setDataRetentionPeriod(e?.target?.value)}
                className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">{option?.label}</span>
                <p className="text-xs text-muted-foreground">{option?.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Data Export & Deletion */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Data Export & Account Management</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Exercise your rights to data portability and account deletion under HIPAA and privacy regulations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Export Your Data</h4>
            <p className="text-sm text-muted-foreground">
              Download a complete copy of your account data, including documents, settings, and audit logs.
            </p>
            <Button
              onClick={() => setShowDataExport(!showDataExport)}
              variant="outline"
              iconName="Download"
              className="w-full"
            >
              Request Data Export
            </Button>
            
            {showDataExport && (
              <div className="mt-4 p-4 bg-background border border-border rounded-md">
                <p className="text-sm text-foreground mb-3">
                  Your export will include:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Profile information and settings</li>
                  <li>Created and shared documents</li>
                  <li>Audit logs and activity history</li>
                  <li>Notification and privacy preferences</li>
                </ul>
                <Button
                  onClick={handleDataExport}
                  size="sm"
                  className="mt-3 w-full"
                >
                  Confirm Export Request
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-error">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              onClick={handleDataDeletion}
              variant="danger"
              iconName="Trash2"
              className="w-full"
            >
              Request Account Deletion
            </Button>
            
            <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-xs text-error">
                <strong>Warning:</strong> Account deletion requires a 30-day review period to ensure HIPAA compliance.
                Critical healthcare records may be retained for legal requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HIPAA Compliance Statement */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-primary">HIPAA Privacy Compliance</p>
            <p className="text-primary/80 mt-1">
              Your privacy settings are designed to comply with HIPAA regulations. Some settings cannot be modified 
              to ensure patient data protection and regulatory compliance. All privacy preference changes are logged 
              for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyControlsTab;