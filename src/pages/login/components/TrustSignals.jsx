import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const complianceBadges = [
    {
      id: 1,
      name: 'HIPAA Compliant',
      icon: 'Shield',
      description: 'Fully compliant with healthcare privacy regulations'
    },
    {
      id: 2,
      name: 'GDPR Ready',
      icon: 'Lock',
      description: 'European data protection standards'
    },
    {
      id: 3,
      name: 'SOC 2 Certified',
      icon: 'Award',
      description: 'Security and availability controls verified'
    },
    {
      id: 4,
      name: 'SSL Secured',
      icon: 'Key',
      description: '256-bit encryption for all data transmission'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Michael Chen',
      role: 'Physical Therapist',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=64&h=64&fit=crop&crop=face',
      quote: `Evolve Health has transformed our documentation process. The AI assistance saves us hours every day while maintaining compliance.`,
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Williams, OTR/L',
      role: 'Occupational Therapist',
      avatar: 'https://images.unsplash.com/photo-1594824475317-d6e2e2e7b2b7?w=64&h=64&fit=crop&crop=face',
      quote: `The template builder is incredibly intuitive. We've standardized our entire clinic's documentation in just weeks.`,
      rating: 5
    },
    {
      id: 3,
      name: 'Dr. James Rodriguez',
      role: 'Speech-Language Pathologist',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=64&h=64&fit=crop&crop=face',
      quote: `Security and ease of use - exactly what we needed for our practice. The team collaboration features are outstanding.`,
      rating: 5
    }
  ];

  const stats = [
    {
      id: 1,
      value: '50,000+',
      label: 'Healthcare Professionals',
      icon: 'Users'
    },
    {
      id: 2,
      value: '99.9%',
      label: 'Uptime Guarantee',
      icon: 'Activity'
    },
    {
      id: 3,
      value: '2M+',
      label: 'Documents Created',
      icon: 'FileText'
    },
    {
      id: 4,
      value: '24/7',
      label: 'Support Available',
      icon: 'Headphones'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={12}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Compliance Badges */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="ShieldCheck" size={20} className="mr-2 text-success" />
          Security & Compliance
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {complianceBadges?.map((badge) => (
            <div key={badge?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-md">
              <div className="w-8 h-8 bg-success/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon name={badge?.icon} size={16} className="text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{badge?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{badge?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
          Trusted by Healthcare Professionals
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat) => (
            <div key={stat?.id} className="text-center p-3 bg-muted rounded-md">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-2">
                <Icon name={stat?.icon} size={16} className="text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="MessageSquare" size={20} className="mr-2 text-accent" />
          What Professionals Say
        </h3>
        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="p-4 bg-muted rounded-md">
              <div className="flex items-start space-x-3 mb-3">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{testimonial?.name}</p>
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial?.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{testimonial?.role}</p>
                </div>
              </div>
              <p className="text-sm text-foreground italic">"{testimonial?.quote}"</p>
            </div>
          ))}
        </div>
      </div>
      {/* Contact Support */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="text-center">
          <Icon name="Headphones" size={24} className="text-primary mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-foreground mb-1">Need Help?</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Our healthcare IT specialists are available 24/7
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Icon name="Phone" size={12} className="mr-1" />
              <span>1-800-EVOLVE</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Icon name="Mail" size={12} className="mr-1" />
              <span>support@evolvehealth.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;