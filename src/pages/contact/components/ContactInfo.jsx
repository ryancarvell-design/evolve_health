import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, BookOpen } from 'lucide-react';

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      details: [
        { label: 'Sales', value: '(800) 386-5831', link: 'tel:+1-800-386-5831' },
        { label: 'Support', value: '(800) 386-5832', link: 'tel:+1-800-386-5832' }
      ],
      description: 'Speak with our healthcare technology experts'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      details: [
        { label: 'Sales', value: 'sales@evolvehealth.com', link: 'mailto:sales@evolvehealth.com' },
        { label: 'Support', value: 'support@evolvehealth.com', link: 'mailto:support@evolvehealth.com' },
        { label: 'Partnerships', value: 'partnerships@evolvehealth.com', link: 'mailto:partnerships@evolvehealth.com' }
      ],
      description: 'Get detailed responses to your questions'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Office Location',
      details: [
        { label: 'Address', value: '123 Healthcare Drive\nToronto, ON M5J 2N8\nCanada', link: null }
      ],
      description: 'Visit our headquarters in the heart of Toronto'
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM EST' },
    { day: 'Saturday', hours: '10:00 AM - 2:00 PM EST' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="space-y-8">
      {/* Direct Contact Information */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl text-white">
            <Phone className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
        </div>

        <div className="space-y-8">
          {contactMethods?.map((method, index) => (
            <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {method?.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{method?.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{method?.description}</p>
              
              <div className="space-y-2">
                {method?.details?.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start gap-3">
                    <span className="text-sm font-medium text-gray-500 min-w-[80px]">
                      {detail?.label}:
                    </span>
                    {detail?.link ? (
                      <a
                        href={detail?.link}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 font-medium"
                      >
                        {detail?.value}
                      </a>
                    ) : (
                      <span className="text-gray-700 whitespace-pre-line">
                        {detail?.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl text-white">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Business Hours</h2>
        </div>

        <div className="space-y-3">
          {businessHours?.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">{schedule?.day}</span>
              <span className="text-gray-600">{schedule?.hours}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-800">
            <strong>24/7 Emergency Support</strong> available for Enterprise customers.
            Critical issues are handled immediately regardless of business hours.
          </p>
        </div>
      </div>

      {/* Additional Support Resources */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Resources</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="#"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
          >
            <MessageCircle className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Live Chat</h3>
              <p className="text-sm text-gray-600">Available 9 AM - 5 PM EST</p>
            </div>
          </a>
          
          <a
            href="#"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
          >
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Knowledge Base</h3>
              <p className="text-sm text-gray-600">Self-service resources</p>
            </div>
          </a>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Location</h2>
        <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive Map</p>
            <p className="text-sm text-gray-400">123 Healthcare Drive, Toronto, ON</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;