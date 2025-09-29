import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContactHeader from './components/ContactHeader';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import SupportChannels from './components/SupportChannels';

const Contact = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleFormSubmit = (formData) => {
    // Handle form submission - integrate with your backend/CRM
    console.log('Contact form submitted:', formData);
    
    // Simulate form submission
    alert('Thank you for your message! Our team will respond within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ContactHeader onBackToHome={handleBackToHome} />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions about Evolve Health? We're here to help healthcare professionals 
              like you streamline your documentation workflow.
            </p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ContactForm onSubmit={handleFormSubmit} />
            <ContactInfo />
          </div>

          <SupportChannels />

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Documentation?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of healthcare professionals using Evolve Health to save time and improve patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-full text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:-translate-y-1"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;