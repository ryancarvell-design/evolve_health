// Storage utilities for documents and templates
import { format } from 'date-fns';
import { updatePatientWithDocument } from './patientRegistry';
import { getCurrentUser as getAuthenticatedUser } from './auth';

// Constants for storage keys
const STORAGE_KEYS = {
  DOCUMENTS: 'evolve_health_documents',
  TEMPLATES: 'evolve_health_templates',
  DOCUMENT_COUNTER: 'evolve_health_document_counter',
  TEMPLATE_COUNTER: 'evolve_health_template_counter'
};

// Storage size constants (in MB)
const STORAGE_LIMITS = {
  WARNING_THRESHOLD: 4, // Warn at 4MB
  MAX_TEMPLATE_SIZE: 2, // Max 2MB per template
  MAX_DOCUMENT_SIZE: 1, // Max 1MB per document
  CLEANUP_TARGET: 0.5 // Clean up to 0.5MB when quota exceeded
};

// Document status options
export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending-review',
  APPROVED: 'approved',
  ARCHIVED: 'archived'
};

// Template status options
export const TEMPLATE_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Generate unique ID
const generateId = (prefix, counterKey) => {
  const currentCount = parseInt(localStorage.getItem(counterKey) || '0', 10);
  const newCount = currentCount + 1;
  localStorage.setItem(counterKey, newCount?.toString());
  return `${prefix}-${new Date()?.getFullYear()}-${newCount?.toString()?.padStart(3, '0')}`;
};

// Get current user (updated to use authenticated user)
export const getCurrentUser = () => {
  const authUser = getAuthenticatedUser();
  return authUser?.data?.name || authUser?.email || 'Current User';
};

// Helper function to sanitize data and prevent circular references
const sanitizeForSerialization = (obj, seen = new WeakSet(), maxDepth = 5, currentDepth = 0) => {
  // Prevent deep nesting that can cause large objects
  if (currentDepth >= maxDepth) {
    return '[Max Depth Reached]';
  }

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (seen?.has(obj)) {
    return '[Circular Reference]';
  }

  // Handle DOM elements and React Fiber nodes
  if (obj instanceof Element || 
      obj instanceof HTMLElement || 
      obj?.constructor?.name === 'HTMLButtonElement' ||
      obj?.constructor?.name?.includes('HTML') ||
      obj?._owner || 
      obj?.stateNode || 
      obj?.__reactFiber ||
      (typeof obj?.constructor === 'function' && obj?.constructor?.name?.startsWith('HTML'))) {
    return '[DOM Element]';
  }

  // Handle functions
  if (typeof obj === 'function') {
    return '[Function]';
  }

  seen?.add(obj);

  if (Array.isArray(obj)) {
    const sanitizedArray = obj?.slice(0, 100)?.map(item => 
      sanitizeForSerialization(item, seen, maxDepth, currentDepth + 1)
    ); // Limit array size
    seen?.delete(obj);
    return sanitizedArray;
  }

  const sanitizedObj = {};
  let propertyCount = 0;
  const maxProperties = 50; // Limit object properties

  for (const key in obj) {
    if (propertyCount >= maxProperties) break;
    
    if (obj?.hasOwnProperty(key)) {
      // Skip React internal properties and large objects
      if (key?.startsWith('__react') || 
          key?.startsWith('_react') || 
          key === 'stateNode' || 
          key === '_owner' || 
          key === 'ref' ||
          key === 'nativeEvent' ||
          key === 'currentTarget' ||
          key === 'target') {
        continue;
      }
      
      try {
        const value = obj?.[key];
        
        // Skip very large strings or objects
        if (typeof value === 'string' && value?.length > 10000) {
          sanitizedObj[key] = '[Large String Truncated]';
        } else {
          sanitizedObj[key] = sanitizeForSerialization(value, seen, maxDepth, currentDepth + 1);
        }
        
        propertyCount++;
      } catch (error) {
        sanitizedObj[key] = '[Serialization Error]';
      }
    }
  }

  seen?.delete(obj);
  return sanitizedObj;
};

// Sanitize template elements specifically
const sanitizeTemplateElements = (elements) => {
  if (!Array.isArray(elements)) return [];
  
  return elements?.map(element => ({
    id: element?.id,
    name: element?.name,
    type: element?.type,
    icon: element?.icon,
    x: element?.x,
    y: element?.y,
    width: element?.width,
    height: element?.height,
    properties: sanitizeForSerialization(element?.properties || {}),
    // Remove any potential DOM references or circular structures
    // Keep only serializable data
  }));
};

// Save document to local storage
export const saveDocument = async (documentData) => {
  try {
    const documents = getDocuments();
    const currentUser = getCurrentUser();
    const now = new Date()?.toISOString();
    
    // Sanitize the documentData to prevent circular references
    const sanitizedDocumentData = sanitizeForSerialization(documentData);
    
    let document;
    let isNewDocument = false;
    
    if (sanitizedDocumentData?.id) {
      // Update existing document
      const existingIndex = documents?.findIndex(doc => doc?.id === sanitizedDocumentData?.id);
      if (existingIndex === -1) {
        throw new Error('Document not found');
      }
      
      document = {
        ...documents?.[existingIndex],
        ...sanitizedDocumentData,
        // Enhanced document name support per requirements
        documentName: sanitizedDocumentData?.documentName || sanitizedDocumentData?.title || documents?.[existingIndex]?.title,
        lastModified: now,
        modifiedBy: currentUser
      };
      
      documents[existingIndex] = document;
    } else {
      // Create new document
      isNewDocument = true;
      const docId = generateId('DOC', STORAGE_KEYS?.DOCUMENT_COUNTER);
      
      document = {
        id: docId,
        title: sanitizedDocumentData?.title || 'New Document',
        // Enhanced document name support per requirements
        documentName: sanitizedDocumentData?.documentName || sanitizedDocumentData?.title || 'New Document',
        content: sanitizedDocumentData?.content || '',
        documentType: sanitizedDocumentData?.documentType || 'General Document',
        status: sanitizedDocumentData?.status || DOCUMENT_STATUS?.DRAFT,
        priority: sanitizedDocumentData?.priority || PRIORITY_LEVELS?.NORMAL,
        // Enhanced patient info structure per requirements
        patientInfo: sanitizeForSerialization(sanitizedDocumentData?.patientInfo || {
          id: null,
          name: '',
          dob: '',
          mrn: '',
          patientId: null
        }),
        templateId: sanitizedDocumentData?.templateId || null,
        templateName: sanitizedDocumentData?.templateName || null,
        metadata: {
          wordCount: calculateWordCount(sanitizedDocumentData?.content || ''),
          characterCount: (sanitizedDocumentData?.content || '')?.length,
          createdFrom: sanitizedDocumentData?.templateId ? 'template' : 'scratch',
          // Enhanced metadata per requirements
          assignedToPatient: sanitizedDocumentData?.patientInfo?.id || null,
          patientAssociation: sanitizedDocumentData?.patientInfo ? {
            patientId: sanitizedDocumentData?.patientInfo?.id,
            patientName: sanitizedDocumentData?.patientInfo?.name,
            assignedAt: now
          } : null
        },
        createdDate: now,
        lastModified: now,
        createdBy: currentUser,
        modifiedBy: currentUser,
        tags: Array.isArray(sanitizedDocumentData?.tags) ? sanitizedDocumentData?.tags : [],
        version: 1
      };
      
      documents?.unshift(document); // Add to beginning of array
    }
    
    localStorage.setItem(STORAGE_KEYS?.DOCUMENTS, JSON.stringify(documents));
    
    // Enhanced Patient Registry integration per requirements
    let patientUpdateResult = null;
    if (document?.patientInfo && (document?.patientInfo?.name || document?.patientInfo?.mrn || document?.patientInfo?.id)) {
      try {
        patientUpdateResult = await updatePatientWithDocument(document?.patientInfo, document);
        console.log('Patient registry update:', patientUpdateResult);
      } catch (error) {
        console.error('Failed to update patient registry:', error);
        // Don't fail document save if patient update fails
      }
    }
    
    return {
      success: true,
      document: document,
      patientUpdate: patientUpdateResult,
      isNewDocument,
      message: `Document "${document?.documentName || document?.title}" saved successfully!${
        patientUpdateResult?.success ? ` Document assigned to patient record.` : ''
      }`
    };
  } catch (error) {
    console.error('Error saving document:', error);
    return {
      success: false,
      error: error?.message,
      message: 'Failed to save document. Please try again.'
    };
  }
};

// Save template to local storage
export const saveTemplate = async (templateData) => {
  try {
    // Check storage quota before attempting save
    const quotaStatus = checkStorageQuota();
    
    if (quotaStatus?.isNearLimit) {
      console.warn(`Storage is ${quotaStatus?.totalSizeMB?.toFixed(2)}MB, approaching limit`);
    }
    
    const templates = getTemplates();
    const currentUser = getCurrentUser();
    const now = new Date()?.toISOString();
    
    // Enhanced sanitization with size optimization
    const sanitizedTemplateData = sanitizeForSerialization(templateData, new WeakSet(), 3);
    
    // Check if sanitized data is too large
    const templateSizeBytes = new Blob([JSON.stringify(sanitizedTemplateData)])?.size;
    const templateSizeMB = bytesToMB(templateSizeBytes);
    
    if (templateSizeMB > STORAGE_LIMITS?.MAX_TEMPLATE_SIZE) {
      return {
        success: false,
        error: `Template too large (${templateSizeMB?.toFixed(2)}MB). Maximum allowed: ${STORAGE_LIMITS?.MAX_TEMPLATE_SIZE}MB`,
        message: `Template is too large. Please reduce the number of elements or simplify the template.`
      };
    }
    
    let template;
    
    if (sanitizedTemplateData?.id) {
      // Update existing template
      const existingIndex = templates?.findIndex(t => t?.id === sanitizedTemplateData?.id);
      if (existingIndex === -1) {
        throw new Error('Template not found');
      }
      
      template = {
        ...templates?.[existingIndex],
        ...sanitizedTemplateData,
        elements: sanitizeTemplateElements(sanitizedTemplateData?.elements || []),
        lastModified: now,
        modifiedBy: currentUser,
        version: (templates?.[existingIndex]?.version || 0) + 1
      };
      
      templates[existingIndex] = template;
    } else {
      // Create new template
      const templateId = generateId('TEMP', STORAGE_KEYS?.TEMPLATE_COUNTER);
      
      template = {
        id: templateId,
        name: sanitizedTemplateData?.name || 'New Template',
        category: sanitizedTemplateData?.category || 'general',
        description: sanitizedTemplateData?.description || '',
        elements: sanitizeTemplateElements(sanitizedTemplateData?.elements || []),
        templateContent: sanitizeForSerialization(sanitizedTemplateData?.templateContent || { sections: [] }, new WeakSet(), 2),
        status: sanitizedTemplateData?.status || TEMPLATE_STATUS?.DRAFT,
        tags: Array.isArray(sanitizedTemplateData?.tags) ? sanitizedTemplateData?.tags?.slice(0, 10) : [], // Limit tags
        createdDate: now,
        lastModified: now,
        createdBy: currentUser,
        modifiedBy: currentUser,
        usageCount: 0,
        version: 1,
        isPublic: sanitizedTemplateData?.isPublic || false
      };
      
      templates?.unshift(template); // Add to beginning of array
    }
    
    // Attempt to save with quota exceeded handling
    try {
      const templatesJson = JSON.stringify(templates);
      localStorage.setItem(STORAGE_KEYS?.TEMPLATES, templatesJson);
    } catch (error) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('Storage quota exceeded, attempting cleanup...');
        
        // Perform cleanup
        const cleanupResult = await performStorageCleanup();
        
        if (cleanupResult?.success) {
          try {
            // Try saving again after cleanup
            const templatesJson = JSON.stringify(templates);
            localStorage.setItem(STORAGE_KEYS?.TEMPLATES, templatesJson);
            
            return {
              success: true,
              template: template,
              cleanup: cleanupResult,
              message: `Template "${template?.name}" saved successfully! ${cleanupResult?.message}`
            };
          } catch (retryError) {
            if (retryError?.name === 'QuotaExceededError' || retryError?.code === 22) {
              return {
                success: false,
                error: 'Storage quota exceeded',
                quotaStatus: checkStorageQuota(),
                message: 'Storage is full. Please delete some old templates or documents to free up space, then try again.'
              };
            }
            throw retryError;
          }
        } else {
          return {
            success: false,
            error: 'Storage quota exceeded and cleanup failed',
            quotaStatus: checkStorageQuota(),
            cleanup: cleanupResult,
            message: 'Storage is full and automatic cleanup failed. Please manually delete old items and try again.'
          };
        }
      }
      throw error; // Re-throw if it's not a quota error
    }
    
    return {
      success: true,
      template: template,
      quotaStatus: checkStorageQuota(),
      message: `Template "${template?.name}" saved successfully!`
    };
  } catch (error) {
    console.error('Error saving template:', error);
    return {
      success: false,
      error: error?.message,
      quotaStatus: checkStorageQuota(),
      message: 'Failed to save template. Please try again.'
    };
  }
};

// Get all documents
export const getDocuments = () => {
  try {
    const documents = localStorage.getItem(STORAGE_KEYS?.DOCUMENTS);
    return documents ? JSON.parse(documents) : [];
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
};

// Get all templates
export const getTemplates = () => {
  try {
    const templates = localStorage.getItem(STORAGE_KEYS?.TEMPLATES);
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

// Get document by ID
export const getDocumentById = (id) => {
  const documents = getDocuments();
  return documents?.find(doc => doc?.id === id) || null;
};

// Get template by ID
export const getTemplateById = (id) => {
  const templates = getTemplates();
  return templates?.find(template => template?.id === id) || null;
};

// Delete document
export const deleteDocument = async (id) => {
  try {
    const documents = getDocuments();
    const documentToDelete = documents?.find(doc => doc?.id === id);
    const filteredDocuments = documents?.filter(doc => doc?.id !== id);
    localStorage.setItem(STORAGE_KEYS?.DOCUMENTS, JSON.stringify(filteredDocuments));
    
    // NEW: Remove document from patient registry if it was associated with a patient
    if (documentToDelete?.patientInfo && 
        (documentToDelete?.patientInfo?.name || documentToDelete?.patientInfo?.mrn || documentToDelete?.patientInfo?.id)) {
      try {
        const { removeDocumentFromPatient } = await import('./patientRegistry');
        await removeDocumentFromPatient(id);
      } catch (error) {
        console.error('Failed to update patient registry on document deletion:', error);
        // Don't fail document deletion if patient update fails
      }
    }
    
    return {
      success: true,
      message: 'Document deleted successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message,
      message: 'Failed to delete document.'
    };
  }
};

// Delete template
export const deleteTemplate = async (id) => {
  try {
    const templates = getTemplates();
    const filteredTemplates = templates?.filter(template => template?.id !== id);
    localStorage.setItem(STORAGE_KEYS?.TEMPLATES, JSON.stringify(filteredTemplates));
    return {
      success: true,
      message: 'Template deleted successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message,
      message: 'Failed to delete template.'
    };
  }
};

// Update template usage count
export const incrementTemplateUsage = (templateId) => {
  const templates = getTemplates();
  const templateIndex = templates?.findIndex(t => t?.id === templateId);
  if (templateIndex !== -1) {
    templates[templateIndex].usageCount = (templates?.[templateIndex]?.usageCount || 0) + 1;
    templates[templateIndex].lastUsed = new Date()?.toISOString();
    localStorage.setItem(STORAGE_KEYS?.TEMPLATES, JSON.stringify(templates));
  }
};

// Search documents
export const searchDocuments = (searchTerm, filters = {}) => {
  const documents = getDocuments();
  
  return documents?.filter(doc => {
    // Enhanced text search per requirements
    const matchesSearch = !searchTerm || 
      doc?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      doc?.documentName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || // Enhanced per requirements
      doc?.documentType?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      doc?.createdBy?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      (doc?.patientInfo?.name || '')?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      (doc?.patientInfo?.mrn || '')?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      (doc?.patientInfo?.patientId || '')?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || // Enhanced per requirements
      doc?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    
    // Status filter
    const matchesStatus = !filters?.status || doc?.status === filters?.status;
    
    // Priority filter
    const matchesPriority = !filters?.priority || doc?.priority === filters?.priority;
    
    // Date range filter
    const matchesDateRange = !filters?.dateFrom || !filters?.dateTo || 
      (new Date(doc.createdDate) >= new Date(filters.dateFrom) && 
       new Date(doc.createdDate) <= new Date(filters.dateTo));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDateRange;
  });
};

// Search templates
export const searchTemplates = (searchTerm, filters = {}) => {
  const templates = getTemplates();
  
  return templates?.filter(template => {
    // Text search
    const matchesSearch = !searchTerm || 
      template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.createdBy?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    
    // Category filter
    const matchesCategory = !filters?.category || filters?.category === 'all' || template?.category === filters?.category;
    
    // Status filter
    const matchesStatus = !filters?.status || template?.status === filters?.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};

// Export document (mock for now)
export const exportDocument = async (document, format = 'pdf') => {
  try {
    // Mock export functionality
    const exportData = {
      id: document?.id,
      title: document?.title,
      content: document?.content,
      exportFormat: format,
      exportedAt: new Date()?.toISOString(),
      exportedBy: getCurrentUser()
    };
    
    // In a real implementation, this would generate a file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document?.createElement('a');
    link.href = url;
    link.download = `${document?.title?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase()}.json`;
    link?.click();
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: `Document exported as ${format?.toUpperCase()} successfully!`
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message,
      message: 'Failed to export document.'
    };
  }
};

// Helper function to calculate word count
const calculateWordCount = (content) => {
  if (!content || typeof content !== 'string') return 0;
  return content?.trim()?.split(/\s+/)?.filter(word => word?.length > 0)?.length;
};

// Initialize storage with some sample data if empty
export const initializeStorage = () => {
  const documents = getDocuments();
  const templates = getTemplates();
  
  if (documents?.length === 0) {
    // Add some sample documents with enhanced structure per requirements
    const sampleDocuments = [
      {
        id: 'DOC-2024-001',
        title: 'Physical Therapy Initial Assessment - John Smith',
        documentName: 'PT Initial Assessment - John Smith', // Enhanced per requirements
        content: `PHYSICAL THERAPY INITIAL ASSESSMENT

Patient: John Smith, DOB: 03/15/1975, MRN: PT-2024-001
Date: ${format(new Date(), 'MMMM dd, yyyy')}

CHIEF COMPLAINT:
Patient reports lower back pain following workplace lifting incident.

ASSESSMENT:
Lumbar radiculopathy with functional limitations affecting work activities.

PLAN:
PT 3x/week focusing on pain management and core stabilization.`,
        documentType: 'Physical Therapy Assessment',
        status: DOCUMENT_STATUS?.APPROVED,
        priority: PRIORITY_LEVELS?.NORMAL,
        // Enhanced patient info per requirements
        patientInfo: {
          id: 'PT-001',
          name: 'John Smith',
          dob: '03/15/1975',
          mrn: 'PT-2024-001',
          patientId: 'PT-001'
        },
        templateId: 'TEMP-001',
        templateName: 'Physical Therapy Initial Assessment',
        metadata: {
          wordCount: 45,
          characterCount: 280,
          createdFrom: 'template',
          // Enhanced metadata per requirements
          assignedToPatient: 'PT-001',
          patientAssociation: {
            patientId: 'PT-001',
            patientName: 'John Smith',
            assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString()
          }
        },
        createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
        lastModified: new Date()?.toISOString(),
        createdBy: 'Dr. Sarah Chen',
        modifiedBy: 'Lauren Carvell',
        tags: ['assessment', 'physical-therapy', 'initial'],
        version: 1
      },
      {
        id: 'DOC-2024-002',
        title: 'Occupational Therapy Progress Note - Emma Johnson',
        documentName: 'OT Progress Note - Emma Johnson', // Enhanced per requirements
        content: `OCCUPATIONAL THERAPY PROGRESS NOTE

Patient: Emma Johnson, DOB: 08/22/1989, MRN: OT-2024-002
Date: ${format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}

PROGRESS:
Patient demonstrates improved fine motor skills and coordination.

GOALS:
Continue with daily activities training and adaptive equipment use.

PLAN:
Weekly sessions for next 4 weeks.`,
        documentType: 'Occupational Therapy Progress Note',
        status: DOCUMENT_STATUS?.PENDING_REVIEW,
        priority: PRIORITY_LEVELS?.HIGH,
        // Enhanced patient info per requirements
        patientInfo: {
          id: 'OT-002',
          name: 'Emma Johnson',
          dob: '08/22/1989',
          mrn: 'OT-2024-002',
          patientId: 'OT-002'
        },
        templateId: 'TEMP-002',
        templateName: 'Progress Note Template',
        metadata: {
          wordCount: 32,
          characterCount: 195,
          createdFrom: 'template',
          // Enhanced metadata per requirements
          assignedToPatient: 'OT-002',
          patientAssociation: {
            patientId: 'OT-002',
            patientName: 'Emma Johnson',
            assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString()
          }
        },
        createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
        createdBy: 'Dr. Michael Torres',
        modifiedBy: 'Dr. Sarah Chen',
        tags: ['progress-note', 'occupational-therapy'],
        version: 2
      },
      {
        id: 'DOC-2024-003',
        title: 'Speech Therapy Evaluation - Robert Davis',
        content: `SPEECH THERAPY EVALUATION

Patient: Robert Davis, DOB: 12/05/1967, MRN: ST-2024-003
Date: ${format(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}

FINDINGS:
Mild dysarthria with reduced speech intelligibility.

RECOMMENDATIONS:
Twice weekly speech therapy sessions focusing on articulation.`,
        documentType: 'Speech Therapy Evaluation',
        status: DOCUMENT_STATUS?.DRAFT,
        priority: PRIORITY_LEVELS?.NORMAL,
        patientInfo: {
          id: 'ST-003',
          name: 'Robert Davis',
          dob: '12/05/1967',
          mrn: 'ST-2024-003'
        },
        templateId: null,
        templateName: null,
        metadata: {
          wordCount: 28,
          characterCount: 170,
          createdFrom: 'scratch'
        },
        createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)?.toISOString(),
        lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
        createdBy: 'Dr. Jennifer Martinez',
        modifiedBy: 'Dr. Jennifer Martinez',
        tags: ['evaluation', 'speech-therapy'],
        version: 1
      },
      {
        id: 'DOC-2024-004',
        title: 'Nursing Assessment - Maria Rodriguez',
        content: `NURSING ASSESSMENT

Patient: Maria Rodriguez, DOB: 04/10/1955, MRN: NA-2024-004
Date: ${format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}

VITAL SIGNS:
BP: 125/80, HR: 72, Temp: 98.6°F, RR: 16, O2 Sat: 98%

ASSESSMENT:
Patient stable, pain well-controlled.

PLAN:
Continue current medication regimen.`,
        documentType: 'Nursing Assessment',
        status: DOCUMENT_STATUS?.APPROVED,
        priority: PRIORITY_LEVELS?.URGENT,
        patientInfo: {
          id: 'NA-004',
          name: 'Maria Rodriguez',
          dob: '04/10/1955',
          mrn: 'NA-2024-004'
        },
        templateId: 'TEMP-003',
        templateName: 'Nursing Assessment Template',
        metadata: {
          wordCount: 35,
          characterCount: 220,
          createdFrom: 'template'
        },
        createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)?.toISOString(),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
        createdBy: 'Nurse Amanda Wilson',
        modifiedBy: 'Lauren Carvell',
        tags: ['assessment', 'nursing', 'vital-signs'],
        version: 3
      },
      {
        id: 'DOC-2024-005',
        title: 'Dietitian Consultation - Thomas Anderson',
        content: `DIETITIAN CONSULTATION

Patient: Thomas Anderson, DOB: 09/18/1978, MRN: DC-2024-005
Date: ${format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}

NUTRITIONAL STATUS:
Patient requires modified diet due to dysphagia.

RECOMMENDATIONS:
Texture-modified diet with thickened liquids.

FOLLOW-UP:
Weekly consultation for dietary compliance.`,
        documentType: 'Dietitian Consultation',
        status: DOCUMENT_STATUS?.PENDING_REVIEW,
        priority: PRIORITY_LEVELS?.NORMAL,
        patientInfo: {
          id: 'DC-005',
          name: 'Thomas Anderson',
          dob: '09/18/1978',
          mrn: 'DC-2024-005'
        },
        templateId: 'TEMP-004',
        templateName: 'Dietitian Consultation Template',
        metadata: {
          wordCount: 31,
          characterCount: 195,
          createdFrom: 'template'
        },
        createdDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)?.toISOString(),
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
        createdBy: 'Dietitian Kelly Brown',
        modifiedBy: 'Dr. Michael Torres',
        tags: ['consultation', 'dietitian', 'nutrition'],
        version: 2
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS?.DOCUMENTS, JSON.stringify(sampleDocuments));
    localStorage.setItem(STORAGE_KEYS?.DOCUMENT_COUNTER, '5');
  }
  
  if (templates?.length === 0) {
    localStorage.setItem(STORAGE_KEYS?.TEMPLATE_COUNTER, '0');
  }
};

// Auto-save functionality
export class AutoSave {
  constructor(saveCallback, interval = 30000) { // 30 seconds default
    this.saveCallback = saveCallback;
    this.interval = interval;
    this.timeoutId = null;
    this.isEnabled = true;
  }
  
  schedule(data) {
    if (!this.isEnabled) return;
    
    this.cancel();
    this.timeoutId = setTimeout(() => {
      this.saveCallback(data, true); // true indicates auto-save
    }, this.interval);
  }
  
  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  
  enable() {
    this.isEnabled = true;
  }
  
  disable() {
    this.isEnabled = false;
    this.cancel();
  }
  
  destroy() {
    this.cancel();
    this.saveCallback = null;
  }
}

// Set current user (for demo purposes)
export const setCurrentUser = (userName) => {
  localStorage.setItem('current_user', userName);
};

// Clear all storage (for development/testing)
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS)?.forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('current_user');
};

// Helper function to get storage size in bytes
const getStorageSize = (key = null) => {
  if (key) {
    const item = localStorage.getItem(key);
    return item ? new Blob([item])?.size : 0;
  }
  
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += new Blob([localStorage[key]])?.size;
    }
  }
  return total;
};

// Convert bytes to MB
const bytesToMB = (bytes) => bytes / (1024 * 1024);

// Check if storage quota is approaching limit
const checkStorageQuota = () => {
  const totalSize = getStorageSize();
  const totalSizeMB = bytesToMB(totalSize);
  
  return {
    totalSize,
    totalSizeMB,
    isNearLimit: totalSizeMB > STORAGE_LIMITS?.WARNING_THRESHOLD,
    isOverLimit: totalSizeMB > 8 // Browser typical limit is ~10MB
  };
};

// Clean up old templates and documents to free space
const performStorageCleanup = async () => {
  try {
    const templates = getTemplates();
    const documents = getDocuments();
    
    // Sort by last modified (oldest first)
    const oldTemplates = templates?.filter(t => t?.status === 'archived' || !t?.lastModified)?.sort((a, b) => new Date(a.lastModified || a.createdDate) - new Date(b.lastModified || b.createdDate));
    
    const oldDocuments = documents?.filter(d => d?.status === 'archived' || !d?.lastModified)?.sort((a, b) => new Date(a.lastModified || a.createdDate) - new Date(b.lastModified || b.createdDate));
    
    let cleanedItems = 0;
    const targetBytes = STORAGE_LIMITS?.CLEANUP_TARGET * 1024 * 1024;
    let freedBytes = 0;
    
    // Remove old archived templates first
    for (let template of oldTemplates) {
      if (freedBytes >= targetBytes) break;
      
      const beforeSize = getStorageSize(STORAGE_KEYS?.TEMPLATES);
      const updatedTemplates = templates?.filter(t => t?.id !== template?.id);
      localStorage.setItem(STORAGE_KEYS?.TEMPLATES, JSON.stringify(updatedTemplates));
      
      const afterSize = getStorageSize(STORAGE_KEYS?.TEMPLATES);
      freedBytes += (beforeSize - afterSize);
      cleanedItems++;
    }
    
    // Remove old archived documents if needed
    for (let document of oldDocuments) {
      if (freedBytes >= targetBytes) break;
      
      const beforeSize = getStorageSize(STORAGE_KEYS?.DOCUMENTS);
      const updatedDocuments = documents?.filter(d => d?.id !== document?.id);
      localStorage.setItem(STORAGE_KEYS?.DOCUMENTS, JSON.stringify(updatedDocuments));
      
      const afterSize = getStorageSize(STORAGE_KEYS?.DOCUMENTS);
      freedBytes += (beforeSize - afterSize);
      cleanedItems++;
    }
    
    return {
      success: true,
      cleanedItems,
      freedMB: bytesToMB(freedBytes),
      message: `Cleaned up ${cleanedItems} old items, freed ${bytesToMB(freedBytes)?.toFixed(2)}MB`
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message,
      message: 'Failed to clean up storage'
    };
  }
};

// Get storage info for UI
export const getStorageInfo = () => {
  const quotaStatus = checkStorageQuota();
  const templatesSize = getStorageSize(STORAGE_KEYS?.TEMPLATES);
  const documentsSize = getStorageSize(STORAGE_KEYS?.DOCUMENTS);
  
  return {
    ...quotaStatus,
    templates: {
      count: getTemplates()?.length,
      sizeMB: bytesToMB(templatesSize)
    },
    documents: {
      count: getDocuments()?.length,
      sizeMB: bytesToMB(documentsSize)
    },
    recommendations: quotaStatus?.isNearLimit ? [
      'Consider archiving old templates and documents',
      'Delete unused drafts',
      'Export important data as backup'
    ] : []
  };
};

export const manualStorageCleanup = async () => {
  return await performStorageCleanup();
};

/**
 * Get user's recent documents from storage
 * Enhanced to support dashboard functionality
 * @param {string} userName - Name of the user
 * @param {number} limit - Maximum number of documents to return
 * @returns {Array} Array of user's recent documents
 */
export const getUserRecentDocuments = (userName, limit = 10) => {
  try {
    const allDocuments = getDocuments();
    
    // Enhanced filtering: documents created OR edited by the user
    const userDocuments = allDocuments?.filter(doc => {
      const isCreator = doc?.createdBy === userName;
      const isEditor = doc?.modifiedBy === userName;
      const isAssigned = doc?.patientInfo && doc?.metadata?.assignedToPatient;
      
      return isCreator || isEditor || isAssigned;
    });
    
    // Sort by lastModified date (most recent first)
    const sortedDocuments = userDocuments?.sort((a, b) => {
      const dateA = new Date(a?.lastModified || a?.createdDate);
      const dateB = new Date(b?.lastModified || b?.createdDate);
      return dateB - dateA;
    });
    
    return sortedDocuments?.slice(0, limit) || [];
  } catch (error) {
    console.error('Error getting user recent documents:', error);
    return [];
  }
};

/**
 * Get user's document activity summary
 * @param {string} userName - Name of the user
 * @returns {Object} Activity summary
 */
export const getUserDocumentActivity = (userName) => {
  try {
    const documents = getUserRecentDocuments(userName, 50); // Get more for analysis
    
    const activity = {
      totalDocuments: documents?.length || 0,
      documentsCreated: documents?.filter(doc => doc?.createdBy === userName)?.length || 0,
      documentsEdited: documents?.filter(doc => doc?.modifiedBy === userName && doc?.createdBy !== userName)?.length || 0,
      documentsThisWeek: documents?.filter(doc => {
        const docDate = new Date(doc?.lastModified || doc?.createdDate);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return docDate >= weekAgo;
      })?.length || 0,
      recentActivity: documents?.slice(0, 5)?.map(doc => ({
        id: doc?.id,
        title: doc?.title || doc?.documentName,
        action: doc?.createdBy === userName ? 'created' : 'edited',
        date: doc?.lastModified || doc?.createdDate,
        patientName: doc?.patientInfo?.name
      })) || []
    };
    
    return activity;
  } catch (error) {
    console.error('Error getting user document activity:', error);
    return {
      totalDocuments: 0,
      documentsCreated: 0,
      documentsEdited: 0,
      documentsThisWeek: 0,
      recentActivity: []
    };
  }
};