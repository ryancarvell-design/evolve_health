import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TeamBillingStep = ({ formData, updateFormData, errors }) => {
  const teamSizes = [
    { value: 'solo', label: 'Solo Practice (Just me)' },
    { value: '2-5', label: '2-5 team members' },
    { value: '6-10', label: '6-10 team members' },
    { value: '11-25', label: '11-25 team members' },
    { value: '26-50', label: '26-50 team members' },
    { value: '50+', label: '50+ team members' }
  ];

  const billingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for solo practitioners',
      features: [
        'Up to 100 documents/month',
        'Basic templates',
        'Email support',
        'HIPAA compliance'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for small teams',
      features: [
        'Unlimited documents',
        'Advanced templates',
        'Team collaboration',
        'Priority support',
        'Custom branding'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'Advanced analytics',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Team & Billing Setup</h2>
        <p className="text-muted-foreground">Configure your team and choose your plan</p>
      </div>
      <Select
        label="Team Size"
        placeholder="How many people will use this account?"
        options={teamSizes}
        value={formData?.teamSize}
        onChange={(value) => updateFormData('teamSize', value)}
        error={errors?.teamSize}
        required
      />
      {formData?.teamSize && formData?.teamSize !== 'solo' && (
        <div className="space-y-4">
          <Input
            label="Team Member Emails"
            type="text"
            placeholder="colleague1@example.com, colleague2@example.com"
            value={formData?.teamEmails}
            onChange={(e) => updateFormData('teamEmails', e?.target?.value)}
            error={errors?.teamEmails}
            description="Separate multiple emails with commas. Invitations will be sent after registration."
          />
        </div>
      )}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Choose Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {billingPlans?.map((plan) => (
            <div
              key={plan?.id}
              className={`
                relative border rounded-lg p-6 cursor-pointer transition-clinical
                ${formData?.billingPlan === plan?.id 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }
                ${plan?.popular ? 'ring-2 ring-primary' : ''}
              `}
              onClick={() => updateFormData('billingPlan', plan?.id)}
            >
              {plan?.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-foreground">{plan?.name}</h4>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground">{plan?.price}</span>
                  <span className="text-muted-foreground">{plan?.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan?.description}</p>
              </div>

              <ul className="space-y-2 mb-4">
                {plan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Icon name="Check" size={16} className="text-success mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center">
                <div className={`
                  w-4 h-4 rounded-full border-2 transition-clinical
                  ${formData?.billingPlan === plan?.id 
                    ? 'border-primary bg-primary' :'border-border'
                  }
                `}>
                  {formData?.billingPlan === plan?.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-muted p-4 rounded-md">
        <h4 className="text-sm font-medium text-foreground mb-3">Billing Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Billing Address"
            type="text"
            placeholder="123 Main Street"
            value={formData?.billingAddress}
            onChange={(e) => updateFormData('billingAddress', e?.target?.value)}
            error={errors?.billingAddress}
          />
          <Input
            label="City"
            type="text"
            placeholder="City"
            value={formData?.billingCity}
            onChange={(e) => updateFormData('billingCity', e?.target?.value)}
            error={errors?.billingCity}
          />
          <Input
            label="State"
            type="text"
            placeholder="State"
            value={formData?.billingState}
            onChange={(e) => updateFormData('billingState', e?.target?.value)}
            error={errors?.billingState}
          />
          <Input
            label="ZIP Code"
            type="text"
            placeholder="12345"
            value={formData?.billingZip}
            onChange={(e) => updateFormData('billingZip', e?.target?.value)}
            error={errors?.billingZip}
          />
        </div>
      </div>
      <div className="space-y-4">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={formData?.agreeToTerms}
          onChange={(e) => updateFormData('agreeToTerms', e?.target?.checked)}
          error={errors?.agreeToTerms}
          required
        />
        
        <Checkbox
          label="I consent to HIPAA-compliant data processing for healthcare documentation"
          checked={formData?.hipaaConsent}
          onChange={(e) => updateFormData('hipaaConsent', e?.target?.checked)}
          error={errors?.hipaaConsent}
          required
        />

        <Checkbox
          label="Send me product updates and healthcare industry insights"
          checked={formData?.marketingConsent}
          onChange={(e) => updateFormData('marketingConsent', e?.target?.checked)}
        />
      </div>
      <div className="bg-success/10 border border-success/20 p-4 rounded-md">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground">30-Day Free Trial</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Start with a free 30-day trial. No credit card required. Cancel anytime during the trial period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBillingStep;