// Patient Registry integration utilities
import { getCurrentUser } from './storage';

// Constants for patient storage
const PATIENT_STORAGE_KEY = 'evolve_health_patients';

// Get all patients from local storage
export const getPatients = () => {
  try {
    const patients = localStorage.getItem(PATIENT_STORAGE_KEY);
    return patients ? JSON.parse(patients) : [];
  } catch (error) {
    console.error('Error loading patients:', error);
    return [];
  }
};

// Save patients to local storage
const savePatients = (patients) => {
  try {
    localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patients));
    return true;
  } catch (error) {
    console.error('Error saving patients:', error);
    return false;
  }
};

// Find patient by various identifiers
export const findPatientByIdentifier = (identifier) => {
  if (!identifier) return null;
  
  const patients = getPatients();
  const searchTerm = identifier?.toLowerCase();
  
  return patients?.find(patient => 
    patient?.id?.toLowerCase() === searchTerm ||
    patient?.patientId?.toLowerCase() === searchTerm ||
    patient?.mrn?.toLowerCase() === searchTerm ||
    (patient?.firstName + ' ' + patient?.lastName)?.toLowerCase() === searchTerm ||
    patient?.mrn?.toLowerCase()?.includes(searchTerm)
  ) || null;
};

// Update patient with new document information
export const updatePatientWithDocument = async (patientInfo, documentData) => {
  try {
    if (!patientInfo || (!patientInfo?.id && !patientInfo?.mrn && !patientInfo?.name)) {
      return {
        success: false,
        message: 'No valid patient information provided'
      };
    }

    const patients = getPatients();
    let targetPatient = null;
    let patientIndex = -1;

    // Find patient by multiple criteria
    if (patientInfo?.id) {
      patientIndex = patients?.findIndex(p => p?.id === patientInfo?.id);
    } else if (patientInfo?.mrn) {
      patientIndex = patients?.findIndex(p => p?.mrn === patientInfo?.mrn);
    } else if (patientInfo?.name) {
      patientIndex = patients?.findIndex(p => 
        `${p?.firstName} ${p?.lastName}`?.toLowerCase() === patientInfo?.name?.toLowerCase()
      );
    }

    if (patientIndex === -1) {
      // Patient not found - could create new patient or skip update
      return {
        success: false,
        message: 'Patient not found in registry',
        patientNotFound: true
      };
    }

    targetPatient = patients?.[patientIndex];
    const currentUser = getCurrentUser();
    const now = new Date()?.toISOString();

    // Create document reference for patient history
    const documentReference = {
      id: documentData?.id,
      title: documentData?.title,
      documentType: documentData?.documentType,
      status: documentData?.status,
      priority: documentData?.priority,
      createdDate: documentData?.createdDate || now,
      lastModified: documentData?.lastModified || now,
      createdBy: documentData?.createdBy || currentUser,
      tags: documentData?.tags || []
    };

    // Initialize document history if it doesn't exist
    if (!targetPatient?.documentHistory) {
      targetPatient.documentHistory = [];
    }

    // Check if document already exists in history (for updates)
    const existingDocIndex = targetPatient?.documentHistory?.findIndex(doc => doc?.id === documentData?.id);
    
    if (existingDocIndex !== -1) {
      // Update existing document reference
      targetPatient.documentHistory[existingDocIndex] = documentReference;
    } else {
      // Add new document reference
      targetPatient?.documentHistory?.unshift(documentReference);
    }

    // Update patient metadata
    targetPatient.totalDocuments = targetPatient?.documentHistory?.length || 0;
    targetPatient.lastActivity = now;
    targetPatient.lastUpdatedBy = currentUser;

    // Update recent document activity
    targetPatient.recentDocuments = targetPatient?.documentHistory
      ?.sort((a, b) => new Date(b?.lastModified) - new Date(a?.lastModified))
      ?.slice(0, 5) || []; // Keep only 5 most recent

    // Update the patients array
    patients[patientIndex] = targetPatient;

    // Save back to storage
    const saveSuccess = savePatients(patients);
    
    if (saveSuccess) {
      return {
        success: true,
        patient: targetPatient,
        message: `Patient registry updated for ${targetPatient?.firstName} ${targetPatient?.lastName}`,
        documentAdded: existingDocIndex === -1,
        documentUpdated: existingDocIndex !== -1
      };
    } else {
      return {
        success: false,
        message: 'Failed to save patient registry updates'
      };
    }
  } catch (error) {
    console.error('Error updating patient with document:', error);
    return {
      success: false,
      error: error?.message,
      message: 'Failed to update patient registry'
    };
  }
};

// Get patient document history
export const getPatientDocumentHistory = (patientId) => {
  const patient = findPatientByIdentifier(patientId);
  return patient?.documentHistory || [];
};

// Get patient statistics
export const getPatientStats = (patientId) => {
  const patient = findPatientByIdentifier(patientId);
  
  if (!patient) {
    return null;
  }

  const documents = patient?.documentHistory || [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    totalDocuments: documents?.length || 0,
    recentDocuments: documents?.filter(doc => 
      new Date(doc?.lastModified) >= thirtyDaysAgo
    )?.length || 0,
    documentTypes: [...new Set(documents?.map(doc => doc?.documentType))]?.filter(Boolean),
    lastDocumentDate: documents?.length > 0 ? documents?.[0]?.lastModified : null,
    averageDocumentsPerMonth: Math.round((documents?.length || 0) / 
      Math.max(1, Math.ceil((now - new Date(patient?.createdAt || now)) / (30 * 24 * 60 * 60 * 1000))))
  };
};

// Remove document from patient history (when document is deleted)
export const removeDocumentFromPatient = async (documentId) => {
  try {
    const patients = getPatients();
    let updated = false;

    const updatedPatients = patients?.map(patient => {
      if (patient?.documentHistory) {
        const originalLength = patient?.documentHistory?.length;
        patient.documentHistory = patient?.documentHistory?.filter(doc => doc?.id !== documentId);
        
        if (patient?.documentHistory?.length !== originalLength) {
          patient.totalDocuments = patient?.documentHistory?.length;
          patient.lastActivity = new Date()?.toISOString();
          patient.recentDocuments = patient?.documentHistory
            ?.sort((a, b) => new Date(b?.lastModified) - new Date(a?.lastModified))
            ?.slice(0, 5);
          updated = true;
        }
      }
      return patient;
    });

    if (updated) {
      savePatients(updatedPatients);
      return {
        success: true,
        message: 'Document removed from patient registries'
      };
    }

    return {
      success: true,
      message: 'No patient registries needed updating'
    };
  } catch (error) {
    console.error('Error removing document from patients:', error);
    return {
      success: false,
      error: error?.message,
      message: 'Failed to update patient registries'
    };
  }
};

// Initialize patient storage if needed
export const initializePatientStorage = () => {
  const patients = getPatients();
  
  if (patients?.length === 0) {
    // Initialize with sample patient data if none exists
    const samplePatients = [
      {
        id: 'pt_001',
        patientId: 'PT-2024-001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1985-03-15',
        gender: 'Female',
        phone: '(555) 123-4567',
        email: 'sarah.j@email.com',
        emergencyContact: 'John Johnson - (555) 987-6543',
        status: 'active',
        careTeam: ['Dr. Smith', 'Nurse Wilson'],
        assignedSpecialty: 'Physical Therapy',
        totalDocuments: 0,
        documentHistory: [],
        recentDocuments: [],
        lastActivity: new Date()?.toISOString(),
        lastUpdatedBy: 'System',
        createdAt: '2024-06-15T10:00:00Z',
        notes: 'Regular PT sessions, excellent progress',
        insurance: 'Blue Cross Blue Shield',
        mrn: 'MRN123456'
      },
      {
        id: 'pt_002',
        patientId: 'PT-2024-002',
        firstName: 'Michael',
        lastName: 'Chen',
        dateOfBirth: '1978-09-22',
        gender: 'Male',
        phone: '(555) 234-5678',
        email: 'michael.chen@email.com',
        emergencyContact: 'Linda Chen - (555) 876-5432',
        status: 'active',
        careTeam: ['Dr. Johnson', 'Therapist Adams'],
        assignedSpecialty: 'Occupational Therapy',
        totalDocuments: 0,
        documentHistory: [],
        recentDocuments: [],
        lastActivity: new Date()?.toISOString(),
        lastUpdatedBy: 'System',
        createdAt: '2024-07-10T14:20:00Z',
        notes: 'Post-surgery rehabilitation, making good progress',
        insurance: 'Aetna',
        mrn: 'MRN789012'
      },
      {
        id: 'pt_003',
        patientId: 'PT-2024-003',
        firstName: 'Emma',
        lastName: 'Rodriguez',
        dateOfBirth: '1992-12-08',
        gender: 'Female',
        phone: '(555) 345-6789',
        email: 'emma.rod@email.com',
        emergencyContact: 'Carlos Rodriguez - (555) 765-4321',
        status: 'inactive',
        careTeam: ['Dr. Brown'],
        assignedSpecialty: 'Speech Therapy',
        totalDocuments: 0,
        documentHistory: [],
        recentDocuments: [],
        lastActivity: new Date()?.toISOString(),
        lastUpdatedBy: 'System',
        createdAt: '2024-05-20T09:30:00Z',
        notes: 'Treatment completed, follow-up scheduled',
        insurance: 'United Healthcare',
        mrn: 'MRN345678'
      }
    ];
    
    savePatients(samplePatients);
  }
};

// Bulk operations for multiple patients
export const bulkUpdatePatientsWithDocument = async (patientInfoList, documentData) => {
  const results = [];
  
  for (const patientInfo of patientInfoList) {
    const result = await updatePatientWithDocument(patientInfo, documentData);
    results?.push({
      patientInfo,
      result
    });
  }
  
  const successful = results?.filter(r => r?.result?.success)?.length;
  const failed = results?.length - successful;
  
  return {
    success: failed === 0,
    totalProcessed: results?.length,
    successful,
    failed,
    results,
    message: `Updated ${successful} patient record(s)${failed > 0 ? `, ${failed} failed` : ''}`
  };
};

// Export patient registry utilities
export default {
  getPatients,
  findPatientByIdentifier,
  updatePatientWithDocument,
  getPatientDocumentHistory,
  getPatientStats,
  removeDocumentFromPatient,
  initializePatientStorage,
  bulkUpdatePatientsWithDocument
};