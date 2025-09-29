import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "Our 14-day free trial gives you full access to all features of the Professional plan. No credit card required to start. You can cancel anytime during the trial period."
    },
    {
      question: "Is my patient data secure and HIPAA compliant?",
      answer: "Absolutely. Evolve Health is fully HIPAA compliant with end-to-end encryption, secure data centers, and regular security audits. We maintain SOC 2 certification and adhere to the highest security standards."
    },
    {
      question: "Can I switch plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle. If you upgrade mid-cycle, we'll prorate the difference."
    },
    {
      question: "What integrations are available?",
      answer: "We integrate with major EHR systems, practice management software, and healthcare tools. Popular integrations include Epic, Cerner, Allscripts, and many others. Contact us for specific integration needs."
    },
    {
      question: "How accurate is the AI transcription?",
      answer: "Our AI transcription is highly accurate, especially with medical terminology. It continuously learns and improves, achieving 95%+ accuracy rates. You can always review and edit transcriptions before finalizing."
    },
    {
      question: "Do you offer training and support?",
      answer: "Yes! All plans include comprehensive onboarding resources. Professional and Enterprise plans get priority support, and Enterprise customers receive dedicated training sessions and account management."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "You maintain access to your data for 30 days after cancellation. We provide easy data export tools so you can download all your documents and information before the account is closed."
    },
    {
      question: "Are there any setup fees or contracts?",
      answer: "No setup fees for Essential and Professional plans. They\'re month-to-month with no long-term contracts. Enterprise plans may include custom terms based on your organization\'s needs."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-16">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h2>

      <div className="max-w-4xl mx-auto">
        {faqs?.map((faq, index) => (
          <div key={index} className="mb-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {faq?.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="h-px bg-gray-200 mb-4"></div>
                  <p className="text-gray-600 leading-relaxed">
                    {faq?.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Still have questions?
        </h3>
        <p className="text-gray-600 mb-6">
          Our healthcare technology experts are here to help you choose the right plan for your practice.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:sales@evolvehealth.com"
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Email Sales Team
          </a>
          <a
            href="tel:+1-800-EVOLVE-1"
            className="px-8 py-3 border-2 border-indigo-500 text-indigo-600 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-50 hover:-translate-y-1"
          >
            Call (800) 386-5831
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;