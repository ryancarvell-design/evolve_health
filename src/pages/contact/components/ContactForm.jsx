import React, { useState } from 'react';
import { Send, User, Mail, Building, MessageSquare } from 'lucide-react';

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    inquiryType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const healthcareRoles = [
    'Physiotherapist',
    'Occupational Therapist',
    'Speech-Language Pathologist',
    'Chiropractor',
    'Massage Therapist',
    'Psychologist',
    'Social Worker',
    'Dietitian',
    'Nurse Practitioner',
    'Practice Manager',
    'IT Administrator',
    'Other'
  ];

  const inquiryTypes = [
    'General Questions',
    'Product Demo',
    'Pricing Information',
    'Technical Support',
    'Integration Requests',
    'Enterprise Sales',
    'Partnership Opportunities',
    'Media/Press Inquiry'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.organization?.trim()) {
      newErrors.organization = 'Organization is required';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    if (!formData?.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData?.message?.trim()?.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit?.(formData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        inquiryType: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl text-white">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Send Us a Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                errors?.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors?.name && (
            <p className="mt-1 text-sm text-red-600">{errors?.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                errors?.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
          </div>
          {errors?.email && (
            <p className="mt-1 text-sm text-red-600">{errors?.email}</p>
          )}
        </div>

        {/* Organization Field */}
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
            Organization/Practice *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData?.organization}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                errors?.organization ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your clinic or practice name"
            />
          </div>
          {errors?.organization && (
            <p className="mt-1 text-sm text-red-600">{errors?.organization}</p>
          )}
        </div>

        {/* Role Dropdown */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Your Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData?.role}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
              errors?.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your role</option>
            {healthcareRoles?.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors?.role && (
            <p className="mt-1 text-sm text-red-600">{errors?.role}</p>
          )}
        </div>

        {/* Inquiry Type */}
        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
            Inquiry Type *
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData?.inquiryType}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
              errors?.inquiryType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">What can we help you with?</option>
            {inquiryTypes?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors?.inquiryType && (
            <p className="mt-1 text-sm text-red-600">{errors?.inquiryType}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData?.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
              errors?.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please tell us more about your needs, questions, or how we can help..."
          />
          <div className="flex justify-between items-center mt-2">
            {errors?.message ? (
              <p className="text-sm text-red-600">{errors?.message}</p>
            ) : (
              <div />
            )}
            <p className="text-sm text-gray-500">
              {formData?.message?.length}/1000
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed' :'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:-translate-y-1 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Response Time:</strong> We typically respond within 24 hours during business days. 
          For urgent technical support, please call our support line.
        </p>
      </div>
    </div>
  );
};

export default ContactForm;