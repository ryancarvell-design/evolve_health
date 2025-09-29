import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';

const PricingTiers = ({ onStartTrial, onContactSales }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const tiers = [
    {
      name: 'Essential',
      description: 'Perfect for individual practitioners',
      price: {
        monthly: 29,
        annual: 24
      },
      features: [
        'Up to 100 documents/month',
        'AI-assisted documentation',
        'Voice-to-text transcription',
        'Basic templates (10)',
        'HIPAA compliant storage',
        'Email support',
        'Mobile app access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for small to medium practices',
      price: {
        monthly: 79,
        annual: 65
      },
      features: [
        'Up to 500 documents/month',
        'Advanced AI features',
        'Custom template builder',
        'Team collaboration (up to 5)',
        'Advanced analytics',
        'Priority support',
        'API integrations',
        'Automated workflows'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Built for large healthcare organizations',
      price: {
        monthly: 'Custom',
        annual: 'Custom'
      },
      features: [
        'Unlimited documents',
        'Custom AI training',
        'Unlimited team members',
        'Advanced security controls',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'Training & onboarding'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="mb-16">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-full p-1 shadow-lg">
          <div className="flex relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'monthly' ?'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' :'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${
                billingCycle === 'annual' ?'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' :'text-gray-600 hover:text-gray-800'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers?.map((tier, index) => (
          <div
            key={tier?.name}
            className={`relative bg-white rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              tier?.popular ? 'ring-4 ring-indigo-500/20 scale-105' : ''
            }`}
          >
            {tier?.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Most Popular</span>
                </div>
              </div>
            )}

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{tier?.name}</h3>
              <p className="text-gray-600 mb-6">{tier?.description}</p>

              <div className="mb-8">
                {typeof tier?.price?.[billingCycle] === 'number' ? (
                  <div>
                    <span className="text-5xl font-bold text-gray-800">
                      ${tier?.price?.[billingCycle]}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'month'}
                    </span>
                    {billingCycle === 'annual' && (
                      <div className="text-green-600 font-medium mt-1">
                        Billed annually (${tier?.price?.annual * 12})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-gray-800">
                    {tier?.price?.[billingCycle]}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (tier?.name === 'Enterprise') {
                    onContactSales?.();
                  } else {
                    onStartTrial?.(tier?.name);
                  }
                }}
                className={`w-full py-4 px-6 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg mb-8 ${
                  tier?.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tier?.cta}
              </button>

              <ul className="space-y-4">
                {tier?.features?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingTiers;