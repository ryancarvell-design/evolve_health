import React from 'react';
import { useNavigate } from 'react-router-dom';
import PricingHeader from './components/PricingHeader';
import PricingTiers from './components/PricingTiers';
import ComparisonTable from './components/ComparisonTable';
import TrustSignals from './components/TrustSignals';
import FAQSection from './components/FAQSection';

const Pricing = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleStartTrial = (tierName) => {
    // Navigate to registration with selected tier
    navigate(`/register?tier=${tierName?.toLowerCase()}`);
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PricingHeader onBackToHome={handleBackToHome} />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Flexible pricing designed specifically for allied health professionals. 
              Start with our free tier and scale as your practice grows.
            </p>
          </div>

          <PricingTiers 
            onStartTrial={handleStartTrial}
            onContactSales={handleContactSales}
          />

          <TrustSignals />
          
          <ComparisonTable />
          
          <FAQSection />

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of healthcare professionals who trust Evolve Health with their documentation workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleStartTrial('Essential')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Start Free Trial
              </button>
              <button 
                onClick={handleContactSales}
                className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-full text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:-translate-y-1"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;