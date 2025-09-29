import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const ProfessionalDetailsStep = ({ formData, updateFormData, errors }) => {
  const licenseTypes = [
    { value: 'pt', label: 'Physical Therapist (PT)' },
    { value: 'pta', label: 'Physical Therapist Assistant (PTA)' },
    { value: 'ot', label: 'Occupational Therapist (OT)' },
    { value: 'ota', label: 'Occupational Therapy Assistant (OTA)' },
    { value: 'slp', label: 'Speech-Language Pathologist (SLP)' },
    { value: 'lcsw', label: 'Licensed Clinical Social Worker (LCSW)' },
    { value: 'lpc', label: 'Licensed Professional Counselor (LPC)' },
    { value: 'lmft', label: 'Licensed Marriage & Family Therapist (LMFT)' },
    { value: 'other', label: 'Other Allied Health Professional' }
  ];

  const specialties = {
    pt: [
      { value: 'orthopedic', label: 'Orthopedic' },
      { value: 'neurological', label: 'Neurological' },
      { value: 'pediatric', label: 'Pediatric' },
      { value: 'geriatric', label: 'Geriatric' },
      { value: 'sports', label: 'Sports Medicine' },
      { value: 'cardiopulmonary', label: 'Cardiopulmonary' }
    ],
    ot: [
      { value: 'pediatric', label: 'Pediatric' },
      { value: 'mental_health', label: 'Mental Health' },
      { value: 'hand_therapy', label: 'Hand Therapy' },
      { value: 'neuro_rehab', label: 'Neurorehabilitation' },
      { value: 'geriatric', label: 'Geriatric' }
    ],
    slp: [
      { value: 'pediatric', label: 'Pediatric' },
      { value: 'adult', label: 'Adult' },
      { value: 'swallowing', label: 'Swallowing Disorders' },
      { value: 'voice', label: 'Voice Disorders' },
      { value: 'fluency', label: 'Fluency Disorders' }
    ],
    lcsw: [
      { value: 'clinical', label: 'Clinical Social Work' },
      { value: 'substance_abuse', label: 'Substance Abuse' },
      { value: 'family', label: 'Family Therapy' },
      { value: 'trauma', label: 'Trauma Therapy' }
    ],
    lpc: [
      { value: 'individual', label: 'Individual Counseling' },
      { value: 'group', label: 'Group Therapy' },
      { value: 'couples', label: 'Couples Therapy' },
      { value: 'addiction', label: 'Addiction Counseling' }
    ]
  };

  const practiceSettings = [
    { value: 'private_practice', label: 'Private Practice' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'outpatient_clinic', label: 'Outpatient Clinic' },
    { value: 'home_health', label: 'Home Health' },
    { value: 'school_system', label: 'School System' },
    { value: 'skilled_nursing', label: 'Skilled Nursing Facility' },
    { value: 'rehabilitation', label: 'Rehabilitation Center' },
    { value: 'other', label: 'Other' }
  ];

  const yearsOfExperience = [
    { value: '0-1', label: '0-1 years' },
    { value: '2-5', label: '2-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '11-15', label: '11-15 years' },
    { value: '16-20', label: '16-20 years' },
    { value: '20+', label: '20+ years' }
  ];

  const availableSpecialties = specialties?.[formData?.licenseType] || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Professional Details</h2>
        <p className="text-muted-foreground">Tell us about your professional background</p>
      </div>
      <Select
        label="License Type"
        placeholder="Select your professional license"
        options={licenseTypes}
        value={formData?.licenseType}
        onChange={(value) => {
          updateFormData('licenseType', value);
          updateFormData('specialty', ''); // Reset specialty when license type changes
        }}
        error={errors?.licenseType}
        required
        searchable
      />
      <Input
        label="License Number"
        type="text"
        placeholder="Enter your license number"
        value={formData?.licenseNumber}
        onChange={(e) => updateFormData('licenseNumber', e?.target?.value)}
        error={errors?.licenseNumber}
        description="This will be verified against state licensing boards"
        required
      />
      <Input
        label="Issuing State"
        type="text"
        placeholder="e.g., California, Texas, New York"
        value={formData?.issuingState}
        onChange={(e) => updateFormData('issuingState', e?.target?.value)}
        error={errors?.issuingState}
        required
      />
      {availableSpecialties?.length > 0 && (
        <Select
          label="Primary Specialty"
          placeholder="Select your primary specialty"
          options={availableSpecialties}
          value={formData?.specialty}
          onChange={(value) => updateFormData('specialty', value)}
          error={errors?.specialty}
          required
        />
      )}
      <Select
        label="Years of Experience"
        placeholder="Select your experience level"
        options={yearsOfExperience}
        value={formData?.experience}
        onChange={(value) => updateFormData('experience', value)}
        error={errors?.experience}
        required
      />
      <Select
        label="Primary Practice Setting"
        placeholder="Select your primary work setting"
        options={practiceSettings}
        value={formData?.practiceSetting}
        onChange={(value) => updateFormData('practiceSetting', value)}
        error={errors?.practiceSetting}
        required
      />
      <Input
        label="Practice/Organization Name"
        type="text"
        placeholder="Enter your practice or organization name"
        value={formData?.practiceName}
        onChange={(e) => updateFormData('practiceName', e?.target?.value)}
        error={errors?.practiceName}
        required
      />
      <div className="bg-muted p-4 rounded-md">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
            <Icon name="Shield" size={12} color="white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">License Verification</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Your license information will be verified against state databases to ensure compliance with healthcare regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsStep;