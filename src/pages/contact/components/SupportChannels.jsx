import React from 'react';
import { MessageCircle, BookOpen, Video, Users, Headphones, FileText } from 'lucide-react';

const SupportChannels = () => {
  const channels = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat Support',
      description: 'Get instant help from our support team during business hours',
      availability: 'Monday - Friday, 9 AM - 5 PM EST',
      action: 'Start Chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Knowledge Base',
      description: 'Search our comprehensive library of guides, tutorials, and FAQs',
      availability: 'Available 24/7',
      action: 'Browse Articles',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials on using Evolve Health features',
      availability: 'Available 24/7',
      action: 'Watch Videos',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Forum',
      description: 'Connect with other healthcare professionals using Evolve Health',
      availability: 'Available 24/7',
      action: 'Join Community',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Phone Support',
      description: 'Speak directly with our healthcare technology specialists',
      availability: 'Monday - Friday, 8 AM - 6 PM EST',
      action: 'Call Now',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Training Resources',
      description: 'Access training materials and certification programs',
      availability: 'Available 24/7',
      action: 'View Training',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const handleChannelClick = (title) => {
    // Handle different channel actions
    switch (title) {
      case 'Live Chat Support':
        // Open chat widget
        alert('Live chat would open here - integrate with your chat service');
        break;
      case 'Phone Support':
        window.location.href = 'tel:+1-800-386-5832';
        break;
      default:
        alert(`${title} would open here - integrate with your support platform`);
    }
  };

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Multiple Ways to Get Help
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the support channel that works best for you. Our healthcare technology experts 
          are committed to helping you succeed with Evolve Health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {channels?.map((channel, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => handleChannelClick(channel?.title)}
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${channel?.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}>
              {channel?.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {channel?.title}
            </h3>
            
            <p className="text-gray-600 text-center mb-4 leading-relaxed">
              {channel?.description}
            </p>
            
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {channel?.availability}
              </span>
            </div>
            
            <button className={`w-full py-3 px-6 bg-gradient-to-r ${channel?.color} text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
              {channel?.action}
            </button>
          </div>
        ))}
      </div>

      {/* Support Stats */}
      <div className="mt-16 bg-white rounded-3xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">&lt; 2 min</div>
            <div className="text-gray-600">Average chat response time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">98%</div>
            <div className="text-gray-600">Customer satisfaction rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
            <div className="text-gray-600">Knowledge base availability</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600">Help articles and tutorials</div>
          </div>
        </div>
      </div>

      {/* Emergency Support Notice */}
      <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">!</span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Emergency Support for Critical Issues
            </h3>
            <p className="text-red-700 mb-3">
              If you're experiencing a critical system issue affecting patient care or data security, 
              please call our emergency support line immediately.
            </p>
            <a
              href="tel:+1-800-386-5833"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Emergency Support: (800) 386-5833
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChannels;