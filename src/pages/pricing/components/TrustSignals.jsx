import React from 'react';
import { Shield, Award, Users, Clock } from 'lucide-react';

const TrustSignals = () => {
  const signals = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'HIPAA Compliant',
      description: 'Full compliance with healthcare regulations'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'SOC 2 Certified',
      description: 'Audited security and availability standards'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '10,000+ Users',
      description: 'Trusted by healthcare professionals worldwide'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '99.9% Uptime',
      description: 'Reliable service when you need it most'
    }
  ];

  const testimonials = [
    {
      quote: "Evolve Health has transformed our documentation workflow. We've reduced our admin time by 60% and can focus more on patient care.",
      author: "Dr. Sarah Mitchell",
      role: "Physiotherapist",
      practice: "HealthFirst Clinic"
    },
    {
      quote: "The AI-assisted documentation is incredibly accurate and saves us hours every day. The team collaboration features are a game-changer.",
      author: "Michael Chen",
      role: "Occupational Therapist", 
      practice: "Rehab Solutions"
    },
    {
      quote: "Security was our biggest concern, but Evolve Health's HIPAA compliance and encryption give us complete peace of mind.",
      author: "Dr. Jennifer Rodriguez",
      role: "Speech Pathologist",
      practice: "Communication Care Center"
    }
  ];

  return (
    <div className="mb-16">
      {/* Trust Badges */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Trusted by Healthcare Professionals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals?.map((signal, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl text-white">
                  {signal?.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{signal?.title}</h3>
              <p className="text-gray-600 text-sm">{signal?.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {testimonials?.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)]?.map((_, i) => (
                  <span key={i} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial?.quote}"</p>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold text-gray-800">{testimonial?.author}</p>
              <p className="text-sm text-gray-600">{testimonial?.role}</p>
              <p className="text-sm text-indigo-600">{testimonial?.practice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;