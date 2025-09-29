import React, { useState } from 'react';
/**
 * Comprehensive form validation utilities
 * Provides consistent validation across all forms in the application
 */

// Validation rules
const VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    minLength: 8,
    minLengthMessage: 'Password must be at least 8 characters',
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    patternMessage: 'Password must contain uppercase, lowercase, number, and special character'
  },
  phone: {
    required: 'Phone number is required',
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
    patternMessage: 'Please enter a valid phone number'
  },
  required: {
    message: 'This field is required'
  },
  name: {
    required: 'Name is required',
    minLength: 2,
    minLengthMessage: 'Name must be at least 2 characters',
    pattern: /^[a-zA-Z\s\-'\.]+$/,
    patternMessage: 'Name contains invalid characters'
  },
  licenseNumber: {
    required: 'License number is required',minLength: 3,minLengthMessage: 'License number must be at least 3 characters',
    pattern: /^[A-Z0-9\-]+$/i,
    patternMessage: 'License number can only contain letters, numbers, and hyphens'
  },
  zipCode: {
    pattern: /^\d{5}(-\d{4})?$/,
    patternMessage: 'Please enter a valid ZIP code'
  }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @param {Object} customRules - Custom validation rules
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value, customRules = {}) => {
  const rules = { ...VALIDATION_RULES?.[fieldName], ...customRules };
  
  if (!rules) return null;

  // Check required
  if (rules?.required && (!value || (typeof value === 'string' && !value?.trim()))) {
    return typeof rules?.required === 'string' ? rules?.required : VALIDATION_RULES?.required?.message;
  }

  // If not required and empty, it's valid
  if (!value || (typeof value === 'string' && !value?.trim())) {
    return null;
  }

  // Check minimum length
  if (rules?.minLength && value?.length < rules?.minLength) {
    return rules?.minLengthMessage || `Must be at least ${rules?.minLength} characters`;
  }

  // Check maximum length
  if (rules?.maxLength && value?.length > rules?.maxLength) {
    return rules?.maxLengthMessage || `Must be no more than ${rules?.maxLength} characters`;
  }

  // Check pattern
  if (rules?.pattern && !rules?.pattern?.test(value)) {
    return rules?.patternMessage || 'Invalid format';
  }

  return null;
};

/**
 * Validate multiple fields
 * @param {Object} formData - Object containing form field values
 * @param {Object} validationSchema - Schema defining validation rules for each field
 * @returns {Object} Object containing validation errors
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};

  Object.keys(validationSchema)?.forEach(fieldName => {
    const fieldRules = validationSchema?.[fieldName];
    const fieldValue = formData?.[fieldName];
    
    const error = validateField(fieldName, fieldValue, fieldRules);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Validate email specifically
 * @param {string} email 
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  return validateField('email', email);
};

/**
 * Validate password specifically
 * @param {string} password 
 * @param {Object} options - Additional options like requireStrong
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password, options = {}) => {
  const rules = { ...VALIDATION_RULES?.password };
  
  if (options?.requireStrong === false) {
    // Remove pattern requirement for less strict validation
    delete rules?.pattern;
    delete rules?.patternMessage;
    rules.minLength = 6;
    rules.minLengthMessage = 'Password must be at least 6 characters';
  }
  
  return validateField('password', password, rules);
};

/**
 * Validate password confirmation
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Validate phone number
 * @param {string} phone 
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  return validateField('phone', phone);
};

/**
 * Real-time validation hook for React components
 * @param {Object} initialData - Initial form data
 * @param {Object} validationSchema - Validation rules for each field
 * @returns {Object} Validation utilities
 */
export const useFormValidation = (initialData = {}, validationSchema = {}) => {
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  
  const validateSingleField = (fieldName, value) => {
    const fieldRules = validationSchema?.[fieldName];
    if (!fieldRules) return null;
    
    return validateField(fieldName, value, fieldRules);
  };
  
  const setFieldError = (fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };
  
  const clearFieldError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors?.[fieldName];
      return newErrors;
    });
  };
  
  const validateFieldAndUpdate = (fieldName, value) => {
    const error = validateSingleField(fieldName, value);
    if (error) {
      setFieldError(fieldName, error);
    } else {
      clearFieldError(fieldName);
    }
    return error;
  };
  
  const setFieldTouched = (fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  };
  
  const validateAllFields = (formData) => {
    const newErrors = validateForm(formData, validationSchema);
    setErrors(newErrors);
    
    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(validationSchema)?.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);
    
    return Object.keys(newErrors)?.length === 0;
  };
  
  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };
  
  return {
    errors,
    touched,
    validateField: validateFieldAndUpdate,
    setFieldTouched,
    validateAllFields,
    resetValidation,
    isValid: Object.keys(errors)?.length === 0,
    hasErrors: Object.keys(errors)?.length > 0
  };
};

// Common validation schemas for different forms
export const VALIDATION_SCHEMAS = {
  login: {
    email: VALIDATION_RULES?.email,
    password: { ...VALIDATION_RULES?.password, pattern: undefined, patternMessage: undefined }
  },
  
  register: {
    firstName: { ...VALIDATION_RULES?.name, required: 'First name is required' },
    lastName: { ...VALIDATION_RULES?.name, required: 'Last name is required' },
    email: VALIDATION_RULES?.email,
    phone: VALIDATION_RULES?.phone,
    password: VALIDATION_RULES?.password
  },
  
  profile: {
    firstName: VALIDATION_RULES?.name,
    lastName: VALIDATION_RULES?.name,
    phone: VALIDATION_RULES?.phone
  },
  
  contactForm: {
    name: VALIDATION_RULES?.name,
    email: VALIDATION_RULES?.email,
    subject: { required: 'Subject is required', minLength: 5, minLengthMessage: 'Subject must be at least 5 characters' },
    message: { required: 'Message is required', minLength: 10, minLengthMessage: 'Message must be at least 10 characters' }
  }
};

export default {
  validateField,
  validateForm,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
  useFormValidation,
  VALIDATION_RULES,
  VALIDATION_SCHEMAS
};