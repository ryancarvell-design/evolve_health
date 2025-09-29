import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TemplateSelector = ({ onTemplateSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified template data - matches the structure from TemplateLibrary
  const templates = [
    {
      id: 'TEMP-001',
      name: 'Physical Therapy Initial Assessment',
      category: 'physical-therapy',
      description: 'Comprehensive initial assessment template for PT patients with detailed evaluation sections',
      createdBy: 'Dr. Sarah Chen',
      usageCount: 145,
      tags: ['assessment', 'initial', 'physical-therapy'],
      templateContent: {
        sections: [
          {
            title: 'Patient Demographics & Referral Information',
            fields: [
              { label: 'Patient Name', type: 'text', placeholder: 'Enter full name', required: true },
              { label: 'Date of Birth', type: 'date', required: true },
              { label: 'Medical Record Number', type: 'text', placeholder: 'MRN', required: true }
            ]
          }
        ],
        sampleContent: `PHYSICAL THERAPY INITIAL ASSESSMENT\n\nPatient: John Smith, DOB: 03/15/1975\nChief Complaint: Lower back pain with radiation\n\nAssessment: Lumbar radiculopathy requiring rehabilitation...`
      }
    },
    {
      id: 'TEMP-002',
      name: 'Progress Note - Weekly',
      category: 'progress-notes',
      description: 'Weekly progress documentation template with detailed treatment tracking',
      createdBy: 'Mark Johnson, PT',
      usageCount: 198,
      tags: ['progress', 'weekly', 'treatment'],
      templateContent: {
        sections: [
          {
            title: 'Session Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Date of Service', type: 'date', required: true }
            ]
          }
        ],
        sampleContent: `WEEKLY PROGRESS NOTE\n\nPatient: Sarah Williams\nDate: Current Session\n\nSubjective: Patient reports improvement in pain levels...`
      }
    },
    {
      id: 'TEMP-003',
      name: 'Occupational Therapy Evaluation',
      category: 'occupational-therapy',
      description: 'Comprehensive OT evaluation with ADL assessment and cognitive screening',
      createdBy: 'Lisa Williams, OT',
      usageCount: 89,
      tags: ['evaluation', 'occupational-therapy', 'ADL'],
      templateContent: {
        sections: [
          {
            title: 'Referral & Background Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Date of Evaluation', type: 'date', required: true }
            ]
          }
        ],
        sampleContent: `OCCUPATIONAL THERAPY EVALUATION\n\nPatient: Margaret Thompson, Age: 85\nDiagnosis: Right CVA with left hemiparesis\n\nOccupational Profile: Independent living prior to stroke...`
      }
    },
    {
      id: 'TEMP-004',
      name: 'Speech Language Assessment',
      category: 'speech-therapy',
      description: 'Comprehensive speech-language pathology evaluation',
      createdBy: 'Jennifer Davis, SLP',
      usageCount: 76,
      tags: ['speech', 'language', 'assessment'],
      templateContent: {
        sections: [
          {
            title: 'Identifying Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Date of Evaluation', type: 'date', required: true }
            ]
          }
        ],
        sampleContent: `SPEECH-LANGUAGE PATHOLOGY EVALUATION\n\nPatient: Emma Rodriguez, Age: 6 years\nPrimary Language: English\n\nClinical Impression: Moderate phonological disorder...`
      }
    },
    {
      id: 'TEMP-005',
      name: 'Treatment Plan Template',
      category: 'treatment-plans',
      description: 'Comprehensive interdisciplinary treatment planning template',
      createdBy: 'Dr. Sarah Chen',
      usageCount: 167,
      tags: ['treatment', 'plan', 'comprehensive'],
      templateContent: {
        sections: [
          {
            title: 'Patient Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Medical Record Number', type: 'text', required: true }
            ]
          }
        ],
        sampleContent: `INTERDISCIPLINARY TREATMENT PLAN\n\nPatient: Robert Martinez\nPrimary Diagnosis: Right total hip replacement\n\nAssessment Summary: 71-year-old male requiring rehabilitation...`
      }
    },
    {
      id: 'TEMP-006',
      name: 'Discharge Summary',
      category: 'discharge',
      description: 'Comprehensive patient discharge documentation with follow-up instructions',
      createdBy: 'Mark Johnson, PT',
      usageCount: 134,
      tags: ['discharge', 'summary', 'documentation'],
      templateContent: {
        sections: [
          {
            title: 'Patient Identification',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Medical Record Number', type: 'text', required: true }
            ]
          }
        ],
        sampleContent: `DISCHARGE SUMMARY\n\nPatient: Elizabeth Thompson, Age: 81\nAdmission Date: Recent\n\nClinical Summary: COPD exacerbation with successful treatment...`
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates?.length, icon: 'Layout', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'physical-therapy', name: 'Physical Therapy', count: templates?.filter(t => t?.category === 'physical-therapy')?.length, icon: 'Activity', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'occupational-therapy', name: 'Occupational Therapy', count: templates?.filter(t => t?.category === 'occupational-therapy')?.length, icon: 'Users', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'speech-therapy', name: 'Speech Therapy', count: templates?.filter(t => t?.category === 'speech-therapy')?.length, icon: 'MessageCircle', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'progress-notes', name: 'Progress Notes', count: templates?.filter(t => t?.category === 'progress-notes')?.length, icon: 'TrendingUp', color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 'treatment-plans', name: 'Treatment Plans', count: templates?.filter(t => t?.category === 'treatment-plans')?.length, icon: 'Target', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'discharge', name: 'Discharge', count: templates?.filter(t => t?.category === 'discharge')?.length, icon: 'CheckCircle', color: 'bg-teal-50 text-teal-700 border-teal-200' }
  ];

  const filteredTemplates = templates?.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId) => {
    const category = categories?.find(cat => cat?.id === categoryId);
    return category?.icon || 'FileText';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories?.find(cat => cat?.id === categoryId);
    return category?.color || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl max-h-[90vh] overflow-hidden w-full shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
              <p className="text-gray-600 mt-1">Select a professional healthcare template to get started quickly</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mt-6">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex max-h-[calc(90vh-200px)]">
          {/* Categories Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1">
                {categories?.map(category => (
                  <button
                    key={category?.id}
                    onClick={() => setSelectedCategory(category?.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category?.id
                        ? `${category?.color} shadow-sm`
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={category?.icon} size={16} />
                    <span className="flex-1 text-left">{category?.name}</span>
                    <span className="text-xs">{category?.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredTemplates?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Search" size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-500 text-center">
                  {searchTerm ? `No templates match "${searchTerm}"` : 'No templates in this category'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTemplates?.map(template => (
                  <div
                    key={template?.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getCategoryColor(template?.category)} border`}>
                        <Icon name={getCategoryIcon(template?.category)} size={20} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {template?.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {template?.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={12} />
                            {template?.createdBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="BarChart3" size={12} />
                            {template?.usageCount} uses
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {template?.tags?.slice(0, 3)?.map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredTemplates?.length} template{filteredTemplates?.length !== 1 ? 's' : ''} available
            </div>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;