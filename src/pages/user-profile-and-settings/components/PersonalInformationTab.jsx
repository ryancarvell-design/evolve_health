import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PersonalInformationTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: 'Lauren',
    lastName: 'Carvell', 
    email: 'lauren.carvell@evolvehealth.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced healthcare professional specializing in physical therapy and rehabilitation. Committed to providing compassionate care and evidence-based treatment approaches.',
    title: 'Dr.',
    department: 'Physical Therapy',
    location: 'San Francisco, CA'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Here you would typically save to your backend
      console.log('Saving profile data:', formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    // Reset form data or fetch from backend
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Personal Information</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            variant="outline"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              iconName="Check"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Image Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-12 h-12 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          {isEditing && (
            <div className="absolute -bottom-2 -right-2">
              <label htmlFor="profile-image" className="cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-clinical">
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground">
            {formData?.title} {formData?.firstName} {formData?.lastName}
          </h3>
          <p className="text-muted-foreground">{formData?.department}</p>
          <p className="text-sm text-muted-foreground">{formData?.location}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Title"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Dr., Mr., Ms., etc."
          />
        </div>
        
        <div className="md:col-span-1"></div>

        <div>
          <Input
            label="First Name"
            value={formData?.firstName}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            disabled={!isEditing}
            required
            error={errors?.firstName}
          />
        </div>

        <div>
          <Input
            label="Last Name"
            value={formData?.lastName}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            disabled={!isEditing}
            required
            error={errors?.lastName}
          />
        </div>

        <div>
          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            required
            error={errors?.email}
          />
        </div>

        <div>
          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            required
            error={errors?.phone}
          />
        </div>

        <div>
          <Input
            label="Department"
            value={formData?.department}
            onChange={(e) => handleInputChange('department', e?.target?.value)}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Input
            label="Location"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Professional Bio */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Professional Bio
        </label>
        <textarea
          value={formData?.bio}
          onChange={(e) => handleInputChange('bio', e?.target?.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-clinical"
          placeholder="Brief description of your professional background and expertise..."
        />
      </div>

      {/* HIPAA Compliance Notice */}
      <div className="bg-muted border border-border rounded-md p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">HIPAA Compliance Notice</p>
            <p className="text-muted-foreground mt-1">
              All profile information is stored securely and in compliance with HIPAA regulations. 
              Changes to your profile are logged for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationTab;