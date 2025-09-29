import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RegistrationSteps from './components/RegistrationSteps';
import BasicInfoStep from './components/BasicInfoStep';
import ProfessionalDetailsStep from './components/ProfessionalDetailsStep';
import TeamBillingStep from './components/TeamBillingStep';
import BenefitsSidebar from './components/BenefitsSidebar';
import { setAuthState } from '../../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Professional Details
    licenseType: '',
    licenseNumber: '',
    issuingState: '',
    specialty: '',
    experience: '',
    practiceSetting: '',
    practiceName: '',
    
    // Team & Billing
    teamSize: '',
    teamEmails: '',
    billingPlan: 'professional',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    agreeToTerms: false,
    hipaaConsent: false,
    marketingConsent: false
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/?.test(formData?.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData?.licenseType) newErrors.licenseType = 'License type is required';
      if (!formData?.licenseNumber?.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData?.issuingState?.trim()) newErrors.issuingState = 'Issuing state is required';
      if (!formData?.experience) newErrors.experience = 'Experience level is required';
      if (!formData?.practiceSetting) newErrors.practiceSetting = 'Practice setting is required';
      if (!formData?.practiceName?.trim()) newErrors.practiceName = 'Practice name is required';
    }

    if (step === 3) {
      if (!formData?.teamSize) newErrors.teamSize = 'Team size is required';
      if (!formData?.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms of service';
      if (!formData?.hipaaConsent) newErrors.hipaaConsent = 'HIPAA consent is required for healthcare documentation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration - Set auth state like login
      const userData = {
        email: formData?.email,
        additionalData: {
          name: `${formData?.firstName} ${formData?.lastName}`,
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          phone: formData?.phone,
          licenseType: formData?.licenseType,
          licenseNumber: formData?.licenseNumber,
          issuingState: formData?.issuingState,
          specialty: formData?.specialty,
          experience: formData?.experience,
          practiceSetting: formData?.practiceSetting,
          practiceName: formData?.practiceName,
          teamSize: formData?.teamSize,
          billingPlan: formData?.billingPlan,
          registrationDate: new Date()?.toISOString(),
          isNewUser: true
        }
      };
      
      // Set authentication state using the same utility as login
      setAuthState(userData);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #059669;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 9999;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          Registration successful! Welcome to Evolve Health
        </div>
      `;
      
      document.body?.appendChild(successMessage);
      
      // Navigate to dashboard after brief delay
      setTimeout(() => {
        document.body?.removeChild(successMessage);
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      case 2:
        return (
          <ProfessionalDetailsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      case 3:
        return (
          <TeamBillingStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content - Full width on mobile, 2/3 on desktop */}
        <div className="w-full lg:w-2/3">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Heart" size={20} color="white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-foreground">Evolve Health</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join thousands of healthcare professionals streamlining their documentation workflow
              </p>
            </div>

            {/* Progress Steps */}
            <RegistrationSteps currentStep={currentStep} />

            {/* Form Content */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-8 shadow-clinical">
              {renderCurrentStep()}

              {/* Error Message */}
              {errors?.submit && (
                <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error" />
                    <p className="text-sm text-error">{errors?.submit}</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-border space-y-4 sm:space-y-0">
                <div>
                  {currentStep > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      <Icon name="ChevronLeft" size={16} className="mr-2" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                    className="w-full sm:w-auto text-center"
                  >
                    Already have an account? Sign in
                  </Button>
                  
                  <Button 
                    onClick={handleNext}
                    loading={isLoading}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {currentStep === 3 ? 'Create Account' : 'Continue'}
                    {currentStep < 3 && <Icon name="ChevronRight" size={16} className="ml-2" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 sm:mt-8 text-center px-4">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Sidebar - Hidden on mobile, 1/3 on desktop */}
        <div className="hidden lg:block lg:w-1/3">
          <BenefitsSidebar />
        </div>
      </div>
    </div>
  );
};

export default Register;