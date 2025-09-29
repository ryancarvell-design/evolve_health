import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Basic Information", description: "Personal details" },
    { number: 2, title: "Professional Details", description: "License & specialty" },
    { number: 3, title: "Team & Billing", description: "Setup preferences" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <div key={step?.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-clinical
                ${currentStep >= step?.number 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground border-2 border-border'
                }
              `}>
                {currentStep > step?.number ? (
                  <Icon name="Check" size={16} />
                ) : (
                  step?.number
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  currentStep >= step?.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground">{step?.description}</p>
              </div>
            </div>
            {index < steps?.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 mt-5 transition-clinical
                ${currentStep > step?.number ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationSteps;