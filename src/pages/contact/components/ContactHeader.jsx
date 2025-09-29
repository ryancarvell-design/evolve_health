import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const ContactHeader = ({ onBackToHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
          
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Evolve Health
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:+1-800-386-5831" 
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium hidden sm:block"
            >
              (800) 386-5831
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ContactHeader;