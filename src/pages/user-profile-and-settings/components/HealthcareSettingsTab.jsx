import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const HealthcareSettingsTab = () => {
  const [healthcareSettings, setHealthcareSettings] = useState({
    specialty: 'Physical Therapy',
    subSpecialty: 'Orthopedic Rehabilitation',
    licenseNumber: 'PT-CA-123456789',
    licenseState: 'California',
    licenseExpiration: '2026-12-15',
    npiNumber: '1234567890',
    deaNumber: '',
    boardCertifications: [
      {
        id: 1,
        name: 'Board Certified Physical Therapist',
        issuingOrganization: 'American Physical Therapy Association',
        certificationDate: '2020-06-15',
        expirationDate: '2025-06-15',
        documentUrl: null
      }
    ],
    practiceSettings: [
      {
        id: 1,
        name: 'Evolve Health Rehabilitation Center',
        type: 'Primary Practice',
        address: '123 Health St, San Francisco, CA 94102',
        phone: '+1 (555) 123-4567'
      }
    ]
  });

  const [newCertification, setNewCertification] = useState({
    name: '',
    issuingOrganization: '',
    certificationDate: '',
    expirationDate: ''
  });

  const [showAddCertification, setShowAddCertification] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const specialties = [
    'Physical Therapy',
    'Occupational Therapy',
    'Speech-Language Pathology',
    'Mental Health Counseling',
    'Clinical Psychology',
    'Rehabilitation Counseling',
    'Recreational Therapy',
    'Medical Social Work',
    'Nursing',
    'Physician Assistant',
    'Other'
  ];

  const practiceTypes = [
    'Primary Practice',
    'Secondary Practice',
    'Consulting Practice',
    'Hospital Affiliation',
    'Clinic Partnership',
    'Academic Institution'
  ];

  const handleSettingChange = (field, value) => {
    setHealthcareSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationUpload = (certificationId, event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setUploadingDoc(certificationId);
      // Simulate file upload
      setTimeout(() => {
        setHealthcareSettings(prev => ({
          ...prev,
          boardCertifications: prev?.boardCertifications?.map(cert =>
            cert?.id === certificationId
              ? { ...cert, documentUrl: `uploads/cert_${certificationId}_${file?.name}` }
              : cert
          )
        }));
        setUploadingDoc(null);
        alert('Certification document uploaded successfully!');
      }, 2000);
    }
  };

  const handleAddCertification = () => {
    if (!newCertification?.name || !newCertification?.issuingOrganization) {
      alert('Please fill in all required fields');
      return;
    }

    const certification = {
      id: Date.now(),
      ...newCertification,
      documentUrl: null
    };

    setHealthcareSettings(prev => ({
      ...prev,
      boardCertifications: [...prev?.boardCertifications, certification]
    }));

    setNewCertification({
      name: '',
      issuingOrganization: '',
      certificationDate: '',
      expirationDate: ''
    });
    setShowAddCertification(false);
  };

  const handleRemoveCertification = (certificationId) => {
    if (confirm('Are you sure you want to remove this certification?')) {
      setHealthcareSettings(prev => ({
        ...prev,
        boardCertifications: prev?.boardCertifications?.filter(cert => cert?.id !== certificationId)
      }));
    }
  };

  const handleSaveSettings = () => {
    console.log('Saving healthcare settings:', healthcareSettings);
    alert('Healthcare settings updated successfully!');
  };

  const isLicenseExpiringSoon = (expirationDate) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isLicenseExpired = (expirationDate) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Healthcare Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your professional healthcare credentials and practice information.
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          iconName="Check"
        >
          Save Healthcare Settings
        </Button>
      </div>

      {/* Professional Information */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary Specialty *
            </label>
            <select
              value={healthcareSettings?.specialty}
              onChange={(e) => handleSettingChange('specialty', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {specialties?.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Input
              label="Sub-Specialty"
              value={healthcareSettings?.subSpecialty}
              onChange={(e) => handleSettingChange('subSpecialty', e?.target?.value)}
              placeholder="e.g., Orthopedic Rehabilitation"
            />
          </div>
        </div>
      </div>

      {/* License Information */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">License Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="License Number"
              value={healthcareSettings?.licenseNumber}
              onChange={(e) => handleSettingChange('licenseNumber', e?.target?.value)}
              required
            />
          </div>
          
          <div>
            <Input
              label="License State"
              value={healthcareSettings?.licenseState}
              onChange={(e) => handleSettingChange('licenseState', e?.target?.value)}
              required
            />
          </div>
          
          <div>
            <Input
              label="License Expiration Date"
              type="date"
              value={healthcareSettings?.licenseExpiration}
              onChange={(e) => handleSettingChange('licenseExpiration', e?.target?.value)}
              required
            />
            {isLicenseExpired(healthcareSettings?.licenseExpiration) && (
              <p className="text-sm text-error mt-1">⚠️ License has expired</p>
            )}
            {isLicenseExpiringSoon(healthcareSettings?.licenseExpiration) && (
              <p className="text-sm text-warning mt-1">⚠️ License expires within 90 days</p>
            )}
          </div>
          
          <div>
            <Input
              label="NPI Number"
              value={healthcareSettings?.npiNumber}
              onChange={(e) => handleSettingChange('npiNumber', e?.target?.value)}
              description="National Provider Identifier"
            />
          </div>
          
          <div>
            <Input
              label="DEA Number (if applicable)"
              value={healthcareSettings?.deaNumber}
              onChange={(e) => handleSettingChange('deaNumber', e?.target?.value)}
              description="Drug Enforcement Administration number"
            />
          </div>
        </div>
      </div>

      {/* Board Certifications */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Board Certifications</h3>
          <Button
            onClick={() => setShowAddCertification(true)}
            variant="outline"
            size="sm"
            iconName="Plus"
          >
            Add Certification
          </Button>
        </div>

        {/* Add Certification Form */}
        {showAddCertification && (
          <div className="mb-6 p-4 bg-background border border-border rounded-md">
            <h4 className="font-medium text-foreground mb-3">Add New Certification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Certification Name"
                value={newCertification?.name}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name: e?.target?.value }))}
                required
              />
              <Input
                label="Issuing Organization"
                value={newCertification?.issuingOrganization}
                onChange={(e) => setNewCertification(prev => ({ ...prev, issuingOrganization: e?.target?.value }))}
                required
              />
              <Input
                label="Certification Date"
                type="date"
                value={newCertification?.certificationDate}
                onChange={(e) => setNewCertification(prev => ({ ...prev, certificationDate: e?.target?.value }))}
              />
              <Input
                label="Expiration Date"
                type="date"
                value={newCertification?.expirationDate}
                onChange={(e) => setNewCertification(prev => ({ ...prev, expirationDate: e?.target?.value }))}
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <Button
                onClick={handleAddCertification}
                size="sm"
              >
                Add Certification
              </Button>
              <Button
                onClick={() => setShowAddCertification(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Certifications */}
        <div className="space-y-4">
          {healthcareSettings?.boardCertifications?.map((certification) => (
            <div key={certification?.id} className="bg-background border border-border rounded-md p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{certification?.name}</h4>
                  <p className="text-sm text-muted-foreground">{certification?.issuingOrganization}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>Certified: {certification?.certificationDate || 'N/A'}</span>
                    <span>Expires: {certification?.expirationDate || 'No expiration'}</span>
                  </div>
                  
                  {/* Document Upload */}
                  <div className="mt-3">
                    {certification?.documentUrl ? (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-success">Document uploaded</span>
                        <button className="text-xs text-primary hover:underline">View</button>
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor={`cert-upload-${certification?.id}`}
                          className="cursor-pointer inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
                        >
                          {uploadingDoc === certification?.id ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span>Upload Certificate</span>
                            </>
                          )}
                        </label>
                        <input
                          id={`cert-upload-${certification?.id}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleCertificationUpload(certification?.id, e)}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => handleRemoveCertification(certification?.id)}
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  className="text-error hover:text-error/80"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Affiliations */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Practice Affiliations</h3>
        <div className="space-y-4">
          {healthcareSettings?.practiceSettings?.map((practice) => (
            <div key={practice?.id} className="bg-background border border-border rounded-md p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{practice?.name}</h4>
                  <p className="text-sm text-primary">{practice?.type}</p>
                  <p className="text-sm text-muted-foreground mt-1">{practice?.address}</p>
                  <p className="text-sm text-muted-foreground">{practice?.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HIPAA Compliance Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-primary">Healthcare Credential Verification</p>
            <p className="text-primary/80 mt-1">
              All healthcare credentials are subject to verification for HIPAA compliance and patient safety. 
              License information is monitored for expiration dates and you will receive automatic reminders 
              90 days before expiration. Expired licenses may restrict your access to patient records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareSettingsTab;