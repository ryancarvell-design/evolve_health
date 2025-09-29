import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BenefitsSidebar = () => {
  const benefits = [
    {
      icon: 'FileText',
      title: 'AI-Powered Documentation',
      description: 'Create professional clinical notes 10x faster with our intelligent writing assistant'
    },
    {
      icon: 'Shield',
      title: 'HIPAA Compliant',
      description: 'Bank-level security with end-to-end encryption and audit trails'
    },
    {
      icon: 'Users',
      title: 'Team Collaboration',
      description: 'Seamlessly work with colleagues and share templates across your practice'
    },
    {
      icon: 'Mic',
      title: 'Voice-to-Text',
      description: 'Dictate notes naturally and watch them transform into professional documentation'
    }
  ];

  const certifications = [
    { name: 'HIPAA', icon: 'Shield' },
    { name: 'GDPR', icon: 'Lock' },
    { name: 'SOC 2', icon: 'Award' },
    { name: 'SSL', icon: 'Key' }
  ];

  const testimonials = [
    {
      quote: "Evolve Health has transformed how I document patient care. What used to take 30 minutes now takes 5.",
      author: "Dr. Maria Rodriguez",
      role: "Physical Therapist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
    },
    {
      quote: "The AI suggestions are incredibly accurate and help me maintain consistent, professional documentation.",
      author: "Sarah Chen",
      role: "Occupational Therapist", 
      avatar: "https://images.unsplash.com/photo-1594824388853-d0c4e0b4e4b1?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-card border-l border-border p-8 space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Join 10,000+ Healthcare Professionals
        </h3>
        <p className="text-muted-foreground">
          Streamline your documentation workflow with AI-powered tools designed specifically for allied health professionals.
        </p>
      </div>
      {/* Benefits */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-foreground">Why Choose Evolve Health?</h4>
        {benefits?.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={benefit?.icon} size={20} className="text-primary" />
            </div>
            <div>
              <h5 className="text-sm font-medium text-foreground">{benefit?.title}</h5>
              <p className="text-xs text-muted-foreground mt-1">{benefit?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Testimonials */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">What Our Users Say</h4>
        {testimonials?.map((testimonial, index) => (
          <div key={index} className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-foreground mb-3">"{testimonial?.quote}"</p>
            <div className="flex items-center space-x-3">
              <Image 
                src={testimonial?.avatar} 
                alt={testimonial?.author}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-medium text-foreground">{testimonial?.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial?.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pricing Transparency */}
      <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="DollarSign" size={16} className="text-success" />
          <h4 className="text-sm font-medium text-foreground">Transparent Pricing</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          No hidden fees, no long-term contracts. Start with a 30-day free trial and scale as your practice grows.
        </p>
      </div>
      {/* Certifications */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Security & Compliance</h4>
        <div className="grid grid-cols-2 gap-3">
          {certifications?.map((cert, index) => (
            <div key={index} className="flex items-center space-x-2 bg-muted p-2 rounded">
              <Icon name={cert?.icon} size={16} className="text-primary" />
              <span className="text-xs font-medium text-foreground">{cert?.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Support */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Headphones" size={16} className="text-primary" />
          <h4 className="text-sm font-medium text-foreground">24/7 Support</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          Get help when you need it with our dedicated healthcare support team.
        </p>
      </div>
    </div>
  );
};

export default BenefitsSidebar;