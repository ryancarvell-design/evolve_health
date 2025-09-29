import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingDocuments from './components/FloatingDocuments';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    reduction: 0,
    users: 0,
    uptime: 0
  });
  const [testimonialsIndex, setTestimonialsIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({
    stats: false,
    features: false,
    testimonials: false
  });
  
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Physical Therapist", 
      content: "Evolve Health has revolutionized my practice. The AI-powered documentation saves me 3 hours every day!",
      avatar: "👩‍⚕️"
    },
    {
      name: "Mark Thompson",
      role: "Occupational Therapist",
      content: "The voice-to-text feature is incredible. It understands medical terminology perfectly and my notes are more accurate than ever.",
      avatar: "👨‍⚕️"
    },
    {
      name: "Dr. Lisa Chen",
      role: "Speech Pathologist",
      content: "The collaborative features have transformed how our team communicates. Patient care has never been more coordinated.",
      avatar: "👩‍🔬"
    }
  ];

  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for anchor links (only for features and demo sections)
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      e?.preventDefault();
      const target = document.querySelector(e?.currentTarget?.getAttribute('href'));
      if (target) {
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    anchors?.forEach(anchor => {
      anchor?.addEventListener('click', handleClick);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      anchors?.forEach(anchor => {
        anchor?.removeEventListener('click', handleClick);
      });
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.animation;
          setIsVisible(prev => ({ ...prev, [target]: true }));
          
          if (target === 'stats') {
            animateStats();
          }
        }
      });
    }, { threshold: 0.3 });

    if (statsRef?.current) observer?.observe(statsRef?.current);
    if (featuresRef?.current) observer?.observe(featuresRef?.current);
    if (testimonialsRef?.current) observer?.observe(testimonialsRef?.current);

    return () => observer?.disconnect();
  }, []);

  const animateStats = () => {
    const duration = 2000;
    const startTime = Date.now();
    const targetStats = { reduction: 85, users: 10000, uptime: 99.9 };

    const updateStats = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedStats({
        reduction: Math.floor(targetStats?.reduction * progress),
        users: Math.floor(targetStats?.users * progress),
        uptime: (targetStats?.uptime * progress)?.toFixed(1)
      });

      if (progress < 1) {
        requestAnimationFrame(updateStats);
      }
    };

    requestAnimationFrame(updateStats);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialsIndex(prev => (prev + 1) % testimonials?.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayDemo = () => {
    alert('Demo video would play here - integrate with your video platform of choice');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleStartTrial = () => {
    navigate('/register');
  };

  return (
    <div className="overflow-x-hidden">
      <nav className={`fixed top-0 w-full px-8 py-4 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md text-gray-900 shadow-lg shadow-slate-200/50' 
          : 'bg-white/10 backdrop-blur-md text-white'
      }`}>
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
            Evolve Health
          </div>
          <div className="flex items-center gap-8">
            <ul className="hidden md:flex gap-8 list-none">
              {['Features', 'Demo', 'Pricing', 'Contact']?.map((item, index) => (
                <li key={item} className="animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                  {item === 'Features' || item === 'Demo' ? (
                    <a href={`#${item?.toLowerCase()}`} className="font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ) : (
                    <button 
                      onClick={item === 'Pricing' ? handlePricingClick : handleContactClick}
                      className="font-medium transition-all duration-300 hover:-translate-y-0.5 relative group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleLoginClick}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:scale-105 shadow-emerald-400/30 animate-pulse-soft"
            >
              Login
            </button>
          </div>
        </div>
      </nav>
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-slate-800/80 animate-gradient-shift"></div>
        
        <FloatingDocuments />
        
        <div className="max-w-4xl px-8 z-10 relative transform hover:scale-105 transition-transform duration-700">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-amber-100 bg-clip-text text-transparent animate-slideInUp">
            <span className="inline-block hover:animate-bounce">Evolve</span>{' '}
            <span className="inline-block hover:animate-bounce" style={{ animationDelay: '0.1s' }}>Your</span>{' '}
            <span className="inline-block hover:animate-bounce" style={{ animationDelay: '0.2s' }}>Practice</span>
          </h1>
          <div className="text-xl md:text-2xl mb-8 opacity-90 animate-slideInUp animation-delay-200 relative">
            <p className="animate-typewriter">
              Streamline documentation and workflow management for allied health professionals with AI-powered tools, customizable templates, and seamless collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap animate-slideInUp animation-delay-400">
            <button 
              onClick={handleStartTrial}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-emerald-400/30 hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            <button 
              onClick={handlePlayDemo}
              className="group px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-full text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:scale-105 relative overflow-hidden"
            >
              <span className="flex items-center gap-2">
                <span className="w-0 h-0 border-l-8 border-l-white border-y-4 border-y-transparent animate-pulse"></span>
                Watch Demo
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      <section 
        id="features" 
        ref={featuresRef}
        data-animation="features"
        className="relative py-24 bg-gradient-to-br from-gray-50 to-emerald-50 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          <FloatingDocuments />
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"></div>
        
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            Powerful Features for Modern Healthcare
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: '🤖',
                title: 'AI-Assisted Documentation',
                description: 'Let AI handle transcription, summarization, and tone adjustment while you focus on patient care. Smart templates adapt to your workflow.',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: '🎤',
                title: 'Voice-to-Text Transcription',
                description: 'Speak naturally and watch your notes appear instantly. Advanced speech recognition understands medical terminology and context.',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: '📋',
                title: 'Custom Template Builder',
                description: 'Create and customize templates for any therapy discipline. Drag-and-drop interface makes template creation effortless.',
                gradient: 'from-green-500 to-green-600'
              },
              {
                icon: '🤝',
                title: 'Team Collaboration',
                description: 'Share notes securely, collaborate in real-time, and maintain continuity of care across your entire healthcare team.',
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                icon: '🔒',
                title: 'HIPAA & GDPR Compliant',
                description: 'Bank-level security with end-to-end encryption. Full compliance with healthcare data regulations worldwide.',
                gradient: 'from-red-500 to-red-600'
              },
              {
                icon: '📊',
                title: 'Smart Analytics',
                description: 'Generate insights from your documentation patterns. Track productivity and identify areas for workflow improvement.',
                gradient: 'from-emerald-500 to-emerald-600'
              }
            ]?.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group cursor-pointer ${
                  isVisible?.features ? 'animate-slideInUp' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400"></div>
                <div className={`w-15 h-15 bg-gradient-to-r ${feature?.gradient} rounded-2xl flex items-center justify-center mb-6 text-2xl text-white group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse`}>
                  {feature?.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">{feature?.title}</h3>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">{feature?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section 
        ref={statsRef}
        data-animation="stats"
        className="py-24 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 right-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            Trusted by Healthcare Professionals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
            {[
              { number: `${animatedStats?.reduction}%`, text: 'Reduction in documentation time', icon: '⏱️' },
              { number: `${animatedStats?.users?.toLocaleString()}+`, text: 'Healthcare professionals served', icon: '👥' },
              { number: `${animatedStats?.uptime}%`, text: 'Uptime guarantee', icon: '🔧' },
              { number: '24/7', text: 'Expert support available', icon: '🆘' }
            ]?.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-2 group-hover:animate-bounce">{stat?.icon}</div>
                <h3 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat?.number}
                </h3>
                <p className="text-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300">{stat?.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section 
        ref={testimonialsRef}
        data-animation="testimonials"
        className="py-24 bg-gradient-to-br from-emerald-50 to-amber-50 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto transform hover:scale-105 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl animate-pulse">
                    {testimonials?.[testimonialsIndex]?.avatar}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-xl text-slate-700 mb-4 italic leading-relaxed">
                    "{testimonials?.[testimonialsIndex]?.content}"
                  </p>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{testimonials?.[testimonialsIndex]?.name}</h4>
                    <p className="text-emerald-600 font-medium">{testimonials?.[testimonialsIndex]?.role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-3 mt-8">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialsIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === testimonialsIndex 
                      ? 'bg-emerald-500 scale-125' : 'bg-emerald-200 hover:bg-emerald-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="demo" className="py-24 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-emerald-50 opacity-50"></div>
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            See Evolve Health in Action
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 hover:text-slate-700 transition-colors duration-300">
            Watch how our AI-powered platform transforms the way allied health professionals document patient care and manage workflows.
          </p>
          <div className="max-w-4xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-50 to-amber-50 h-96 flex items-center justify-center relative group hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-amber-400/20 to-emerald-400/20 animate-pulse"></div>
            <div 
              className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-125 shadow-lg hover:shadow-2xl group-hover:animate-pulse relative z-10"
              onClick={handlePlayDemo}
            >
              <span className="text-white text-3xl ml-1">▶</span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping scale-150"></div>
          </div>
        </div>
      </section>
      <footer className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 opacity-50"></div>
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Product",
                links: [
                  { text: "Features", action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
                  { text: "Pricing", action: handlePricingClick },
                  { text: "Security", action: null },
                  { text: "Integrations", action: null }
                ]
              },
              {
                title: "Support",
                links: [
                  { text: "Help Center", action: null },
                  { text: "Documentation", action: null },
                  { text: "Training", action: null },
                  { text: "Contact Us", action: handleContactClick }
                ]
              },
              {
                title: "Company",
                links: [
                  { text: "About", action: null },
                  { text: "Blog", action: null },
                  { text: "Careers", action: null },
                  { text: "Press", action: null }
                ]
              },
              {
                title: "Legal",
                links: [
                  { text: "Privacy Policy", action: null },
                  { text: "Terms of Service", action: null },
                  { text: "HIPAA Compliance", action: null },
                  { text: "Cookie Policy", action: null }
                ]
              }
            ]?.map((section, sectionIndex) => (
              <div key={section?.title}>
                <h4 className="mb-4 text-emerald-400 font-semibold text-lg hover:text-emerald-300 transition-colors duration-300">
                  {section?.title}
                </h4>
                <div className="space-y-2">
                  {section?.links?.map((link, linkIndex) => (
                    link?.action ? (
                      <button 
                        key={linkIndex}
                        onClick={link?.action}
                        className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 text-left hover:translate-x-2"
                      >
                        {link?.text}
                      </button>
                    ) : (
                      <a 
                        key={linkIndex}
                        href="#" 
                        className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-2"
                      >
                        {link?.text}
                      </a>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 pt-8 border-t border-slate-700 text-gray-400">
            <p className="hover:text-gray-300 transition-colors duration-300">
              &copy; 2025 Evolve Health. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;