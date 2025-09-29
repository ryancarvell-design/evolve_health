import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BasicInfoStep = ({ formData, updateFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password?.length >= 8) score++;
    if (/[A-Z]/?.test(password)) score++;
    if (/[a-z]/?.test(password)) score++;
    if (/[0-9]/?.test(password)) score++;
    if (/[^A-Za-z0-9]/?.test(password)) score++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'bg-error' },
      { strength: 2, label: 'Weak', color: 'bg-warning' },
      { strength: 3, label: 'Fair', color: 'bg-warning' },
      { strength: 4, label: 'Good', color: 'bg-success' },
      { strength: 5, label: 'Strong', color: 'bg-success' }
    ];

    return levels?.[score];
  };

  const passwordStrength = getPasswordStrength(formData?.password);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Let's start with your personal details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData?.firstName}
          onChange={(e) => updateFormData('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
        />
        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData?.lastName}
          onChange={(e) => updateFormData('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
        />
      </div>
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your professional email"
        value={formData?.email}
        onChange={(e) => updateFormData('email', e?.target?.value)}
        error={errors?.email}
        description="We'll use this for account verification and important updates"
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        value={formData?.phone}
        onChange={(e) => updateFormData('phone', e?.target?.value)}
        error={errors?.phone}
        required
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={(e) => updateFormData('password', e?.target?.value)}
          error={errors?.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-clinical"
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
        
        {formData?.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-clinical ${passwordStrength?.color}`}
                  style={{ width: `${(passwordStrength?.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{passwordStrength?.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use 8+ characters with uppercase, lowercase, numbers, and symbols
            </p>
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => updateFormData('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-clinical"
        >
          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
      </div>
    </div>
  );
};

export default BasicInfoStep;