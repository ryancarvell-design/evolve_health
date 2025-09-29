import React from 'react';
import { Check, X } from 'lucide-react';

const ComparisonTable = () => {
  const features = [
    {
      category: 'Documentation',
      items: [
        { name: 'Document Creation', essential: true, professional: true, enterprise: true },
        { name: 'AI-Assisted Writing', essential: true, professional: true, enterprise: true },
        { name: 'Voice-to-Text', essential: true, professional: true, enterprise: true },
        { name: 'Document Templates', essential: '10', professional: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Custom Template Builder', essential: false, professional: true, enterprise: true },
        { name: 'Advanced AI Features', essential: false, professional: true, enterprise: true }
      ]
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Real-time Collaboration', essential: false, professional: true, enterprise: true },
        { name: 'Team Members', essential: '1', professional: '5', enterprise: 'Unlimited' },
        { name: 'Permission Management', essential: false, professional: true, enterprise: true },
        { name: 'Audit Logs', essential: false, professional: false, enterprise: true }
      ]
    },
    {
      category: 'Analytics & Reporting',
      items: [
        { name: 'Basic Analytics', essential: true, professional: true, enterprise: true },
        { name: 'Advanced Reporting', essential: false, professional: true, enterprise: true },
        { name: 'Custom Dashboards', essential: false, professional: false, enterprise: true },
        { name: 'Data Export', essential: false, professional: true, enterprise: true }
      ]
    },
    {
      category: 'Support & Security',
      items: [
        { name: 'HIPAA Compliance', essential: true, professional: true, enterprise: true },
        { name: 'Email Support', essential: true, professional: true, enterprise: true },
        { name: 'Priority Support', essential: false, professional: true, enterprise: true },
        { name: 'Phone Support', essential: false, professional: false, enterprise: true },
        { name: 'Dedicated Account Manager', essential: false, professional: false, enterprise: true },
        { name: 'Custom Security Controls', essential: false, professional: false, enterprise: true }
      ]
    }
  ];

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    } else if (value === false) {
      return <X className="w-5 h-5 text-gray-300 mx-auto" />;
    } else {
      return <span className="text-sm font-medium text-gray-700">{value}</span>;
    }
  };

  return (
    <div className="mb-16">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Feature Comparison
      </h2>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
              <tr>
                <th className="text-left py-6 px-6 text-white font-semibold">Features</th>
                <th className="text-center py-6 px-6 text-white font-semibold">
                  <div>Essential</div>
                  <div className="text-sm opacity-80">$29/month</div>
                </th>
                <th className="text-center py-6 px-6 text-white font-semibold relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </span>
                  </div>
                  <div>Professional</div>
                  <div className="text-sm opacity-80">$79/month</div>
                </th>
                <th className="text-center py-6 px-6 text-white font-semibold">
                  <div>Enterprise</div>
                  <div className="text-sm opacity-80">Custom</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features?.map((category, categoryIndex) => (
                <React.Fragment key={category?.category}>
                  <tr className="bg-gray-50">
                    <td colSpan="4" className="py-4 px-6 font-semibold text-gray-800 text-lg">
                      {category?.category}
                    </td>
                  </tr>
                  {category?.items?.map((item, itemIndex) => (
                    <tr 
                      key={item?.name}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-700">{item?.name}</td>
                      <td className="py-4 px-6 text-center">
                        {renderFeatureValue(item?.essential)}
                      </td>
                      <td className="py-4 px-6 text-center bg-indigo-50/50">
                        {renderFeatureValue(item?.professional)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {renderFeatureValue(item?.enterprise)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;