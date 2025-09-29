import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Icon from '../AppIcon';
import { DOCUMENT_STATUS, PRIORITY_LEVELS, TEMPLATE_STATUS } from '../../utils/storage';

const SaveModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  type = 'document', // 'document' or 'template'
  initialData = {},
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    documentType: '',
    status: '',
    priority: '',
    category: '',
    description: '',
    tags: '',
    patientInfo: {
      name: '',
      dob: '',
      mrn: ''
    }
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || initialData?.name || '',
        documentType: initialData?.documentType || 'General Document',
        status: initialData?.status || (type === 'document' ? DOCUMENT_STATUS?.DRAFT : TEMPLATE_STATUS?.DRAFT),
        priority: initialData?.priority || PRIORITY_LEVELS?.NORMAL,
        category: initialData?.category || 'general',
        description: initialData?.description || '',
        tags: Array.isArray(initialData?.tags) ? initialData?.tags?.join(', ') : '',
        patientInfo: initialData?.patientInfo || {
          name: '',
          dob: '',
          mrn: ''
        }
      });
      setErrors({});
    }
  }, [isOpen, initialData, type]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePatientInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      patientInfo: {
        ...prev?.patientInfo,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) {
      newErrors.title = `${type === 'document' ? 'Document title' : 'Template name'} is required`;
    }
    
    if (type === 'document') {
      if (!formData?.documentType?.trim()) {
        newErrors.documentType = 'Document type is required';
      }
    } else {
      if (!formData?.category?.trim()) {
        newErrors.category = 'Category is required';
      }
      if (!formData?.description?.trim()) {
        newErrors.description = 'Description is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const saveData = {
      ...initialData,
      [type === 'document' ? 'title' : 'name']: formData?.title?.trim(),
      status: formData?.status,
      tags: formData?.tags ? formData?.tags?.split(',')?.map(tag => tag?.trim())?.filter(Boolean) : []
    };
    
    if (type === 'document') {
      saveData.documentType = formData?.documentType?.trim();
      saveData.priority = formData?.priority;
      saveData.patientInfo = {
        name: formData?.patientInfo?.name?.trim(),
        dob: formData?.patientInfo?.dob,
        mrn: formData?.patientInfo?.mrn?.trim(),
        id: formData?.patientInfo?.mrn?.trim() ? `PT-${formData?.patientInfo?.mrn?.trim()}` : null
      };
    } else {
      saveData.category = formData?.category;
      saveData.description = formData?.description?.trim();
    }
    
    onSave(saveData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const documentTypes = [
    'Physical Therapy Assessment',
    'Occupational Therapy Evaluation',
    'Speech Language Assessment',
    'Progress Note',
    'Treatment Plan',
    'Discharge Summary',
    'Mental Health Screening',
    'Initial Evaluation',
    'General Document'
  ];

  const templateCategories = [
    { value: 'physical-therapy', label: 'Physical Therapy' },
    { value: 'occupational-therapy', label: 'Occupational Therapy' },
    { value: 'speech-therapy', label: 'Speech Therapy' },
    { value: 'progress-notes', label: 'Progress Notes' },
    { value: 'treatment-plans', label: 'Treatment Plans' },
    { value: 'discharge', label: 'Discharge' },
    { value: 'general', label: 'General' }
  ];

  const statusOptions = type === 'document' 
    ? Object.entries(DOCUMENT_STATUS)?.map(([key, value]) => ({ 
        value, 
        label: key?.charAt(0) + key?.slice(1)?.toLowerCase()?.replace('_', ' ') 
      }))
    : Object.entries(TEMPLATE_STATUS)?.map(([key, value]) => ({ 
        value, 
        label: key?.charAt(0) + key?.slice(1)?.toLowerCase() 
      }));

  const priorityOptions = Object.entries(PRIORITY_LEVELS)?.map(([key, value]) => ({ 
    value, 
    label: key?.charAt(0) + key?.slice(1)?.toLowerCase() 
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData?.id ? 'Save Changes' : `Save ${type === 'document' ? 'Document' : 'Template'}`}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {initialData?.id 
                  ? `Update your ${type} with new information` 
                  : `Provide details to save your ${type} to the library`
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Icon name="X" size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Title/Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {type === 'document' ? 'Document Title' : 'Template Name'} *
              </label>
              <Input
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                placeholder={type === 'document' ? 'Enter document title...' : 'Enter template name...'}
                error={errors?.title}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Type / Template Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {type === 'document' ? 'Document Type' : 'Category'} *
                </label>
                {type === 'document' ? (
                  <Select
                    value={formData?.documentType}
                    onChange={(value) => handleInputChange('documentType', value)}
                    options={documentTypes?.map(type => ({ value: type, label: type }))}
                    placeholder="Select document type..."
                    error={errors?.documentType}
                    disabled={isLoading}
                  />
                ) : (
                  <Select
                    value={formData?.category}
                    onChange={(value) => handleInputChange('category', value)}
                    options={templateCategories}
                    placeholder="Select category..."
                    error={errors?.category}
                    disabled={isLoading}
                  />
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={statusOptions}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Priority (Documents only) */}
            {type === 'document' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={formData?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                  options={priorityOptions}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Description (Templates only) */}
            {type === 'template' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  placeholder="Describe what this template is for and when to use it..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                    errors?.description ? 'border-red-500' : 'border-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  rows={3}
                  disabled={isLoading}
                />
                {errors?.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <Icon name="AlertCircle" size={16} />
                    {errors?.description}
                  </p>
                )}
              </div>
            )}

            {/* Patient Information (Documents only) */}
            {type === 'document' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} className="text-blue-600" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>
                    <Input
                      value={formData?.patientInfo?.name}
                      onChange={(e) => handlePatientInfoChange('name', e?.target?.value)}
                      placeholder="Enter patient name..."
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={formData?.patientInfo?.dob}
                      onChange={(e) => handlePatientInfoChange('dob', e?.target?.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Record Number
                    </label>
                    <Input
                      value={formData?.patientInfo?.mrn}
                      onChange={(e) => handlePatientInfoChange('mrn', e?.target?.value)}
                      placeholder="Enter MRN..."
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <Input
                value={formData?.tags}
                onChange={(e) => handleInputChange('tags', e?.target?.value)}
                placeholder="Enter tags separated by commas (e.g., assessment, initial, physical-therapy)"
                disabled={isLoading}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple tags with commas to help organize and search your {type}s
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="Info" size={16} />
            <span>
              {initialData?.id ? 'Changes will be saved immediately' : `${type === 'document' ? 'Document' : 'Template'} will be added to your library`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name="Save" size={16} />
                  <span>{initialData?.id ? 'Update' : 'Save'}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;