/**
 * Dashboard data utility functions
 * Generates personalized dashboard data based on the current user
 */

import { getCurrentUser } from './auth';
import { getDocuments } from './storage';


/**
 * Get personalized dashboard data for the current user
 * @returns {Object} Personalized dashboard data including metrics, documents, activities, etc.
 */
export const getPersonalizedDashboardData = () => {
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'lauren.carvell@evolvehealth.com';
  
  // Get user's full name from stored user data or lookup from email
  let userName = 'User';
  
  // First try to get name from stored user data
  if (currentUser?.data?.name) {
    userName = currentUser?.data?.name;
  } else {
    // Fallback to email lookup
    userName = getUserNameFromEmail(userEmail);
  }
  
  // Generate user-specific data based on the current user
  return {
    userName,
    userEmail,
    metrics: getUserMetrics(userName),
    recentDocuments: getUserRecentDocuments(userName),
    teamActivity: getUserTeamActivity(userName),
    upcomingDeadlines: getUserDeadlines(userName),
    productivityData: getUserProductivityData(),
    complianceReminders: getUserComplianceReminders(userName)
  };
};

/**
 * Extract user name from email
 * @param {string} email - User email
 * @returns {string} Formatted user name
 */
const getUserNameFromEmail = (email) => {
  if (!email) return 'User';
  
  // Handle known users
  const knownUsers = {
    'lauren.carvell@evolvehealth.com': 'Lauren Carvell',
    'mike.rodriguez@evolvehealth.com': 'Mike Rodriguez',
    'lisa.park@evolvehealth.com': 'Lisa Park',
    'james.wilson@evolvehealth.com': 'James Wilson',
    'emma.davis@evolvehealth.com': 'Emma Davis'
  };
  
  if (knownUsers?.[email]) {
    return knownUsers?.[email];
  }
  
  // Generate name from email for unknown users
  const namePart = email?.split('@')?.[0];
  const parts = namePart?.split('.');
  return parts?.map(part => part?.charAt(0)?.toUpperCase() + part?.slice(1))?.join(' ');
};

/**
 * Get user-specific metrics
 * @param {string} userName - Current user name
 * @returns {Array} Array of metric objects
 */
const getUserMetrics = (userName) => {
  // Base metrics template
  const baseMetrics = [
    {
      title: 'Documents Created This Week',
      icon: 'FileText',
      color: 'primary'
    },
    {
      title: 'Pending Approvals',
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'AI Usage This Month',
      icon: 'Brain',
      color: 'accent',
      description: 'Powered by Gemini AI'
    },
    {
      title: 'My Assigned Patients',
      icon: 'Users',
      color: 'success'
    }
  ];

  // User-specific data based on name - Updated with real AI usage patterns
  const userSpecificData = {
    'Lauren Carvell': {
      documentsCreated: { value: '24', change: '+12%', changeType: 'increase' },
      pendingApprovals: { value: '8', change: '-3', changeType: 'decrease' },
      aiUsage: { value: '187', change: '+45%', changeType: 'increase', detail: 'Suggestions, Tone Adj., Summaries' },
      assignedPatients: { value: '47', change: '+2', changeType: 'increase' }
    },
    'Mike Rodriguez': {
      documentsCreated: { value: '18', change: '+8%', changeType: 'increase' },
      pendingApprovals: { value: '12', change: '+2', changeType: 'increase' },
      aiUsage: { value: '124', change: '+38%', changeType: 'increase', detail: 'Document Generation, Review' },
      assignedPatients: { value: '32', change: '+1', changeType: 'increase' }
    },
    'Lisa Park': {
      documentsCreated: { value: '31', change: '+18%', changeType: 'increase' },
      pendingApprovals: { value: '5', change: '-7', changeType: 'decrease' },
      aiUsage: { value: '256', change: '+52%', changeType: 'increase', detail: 'Templates, Analysis, Insights' },
      assignedPatients: { value: '28', change: '0', changeType: 'neutral' }
    },
    'James Wilson': {
      documentsCreated: { value: '15', change: '+5%', changeType: 'increase' },
      pendingApprovals: { value: '3', change: '-1', changeType: 'decrease' },
      aiUsage: { value: '89', change: '+25%', changeType: 'increase', detail: 'Content Enhancement' },
      assignedPatients: { value: '19', change: '+3', changeType: 'increase' }
    }
  };

  const userData = userSpecificData?.[userName] || userSpecificData?.['Lauren Carvell'];
  
  return baseMetrics?.map((metric, index) => {
    const dataKeys = ['documentsCreated', 'pendingApprovals', 'aiUsage', 'assignedPatients'];
    const data = userData?.[dataKeys?.[index]];
    
    return {
      ...metric,
      value: data?.value,
      change: data?.change,
      changeType: data?.changeType,
      detail: data?.detail
    };
  });
};

/**
 * Get user-specific recent documents
 * @param {string} userName - Current user name
 * @returns {Array} Array of recent document objects
 */
const getUserRecentDocuments = (userName) => {
  // Get all documents from storage utility
  const allStoredDocuments = getDocuments();
  
  // Enhanced filtering: Show documents created OR edited by current user
  const userDocuments = allStoredDocuments?.filter(doc => {
    const isCreator = doc?.createdBy === userName;
    const isEditor = doc?.modifiedBy === userName;
    const isAssigned = doc?.patientInfo && 
                     (doc?.metadata?.assignedToPatient || doc?.patientInfo?.assignedTo === userName);
    
    // Show documents if user created, edited, or is assigned to patient
    return isCreator || isEditor || isAssigned;
  });

  // Sort by lastModified date (most recent first) for true recent activity
  const sortedDocuments = userDocuments?.sort((a, b) => {
    const dateA = new Date(a?.lastModified || a?.createdDate);
    const dateB = new Date(b?.lastModified || b?.createdDate);
    return dateB - dateA;
  });

  // Enhanced document mapping for better display
  const recentDocuments = sortedDocuments?.slice(0, 5)?.map(doc => ({
    id: doc?.id,
    // Enhanced patient name display
    patientName: doc?.patientInfo?.name || `Patient ${doc?.patientInfo?.initials || 'N/A'}`,
    patientInitials: doc?.patientInfo?.name ? 
                    doc?.patientInfo?.name?.split(' ')?.map(n => n?.charAt(0))?.join('') || 
                    doc?.patientInfo?.initials || 
                    doc?.patientInfo?.mrn?.substring(0, 2)?.toUpperCase() || 'UN' : 'UN',
    // Enhanced document name display
    documentType: doc?.documentName || doc?.title || doc?.documentType || 'Document',
    // Smart icon selection based on document type
    typeIcon: getDocumentTypeIcon(doc?.documentType),
    lastModified: doc?.lastModified || doc?.createdDate,
    status: doc?.status || 'draft',
    // Enhanced metadata for user context
    createdBy: doc?.createdBy,
    modifiedBy: doc?.modifiedBy,
    isCreatedByUser: doc?.createdBy === userName,
    isModifiedByUser: doc?.modifiedBy === userName,
    patientMRN: doc?.patientInfo?.mrn,
    aiEnhanced: doc?.metadata?.aiEnhanced || doc?.aiEnhanced || false,
    // User activity indicator
    userActivity: doc?.createdBy === userName ? 'created' : 
                 doc?.modifiedBy === userName ? 'edited' : 'assigned'
  }));

  return recentDocuments || [];
};

/**
 * Enhanced helper function to get appropriate icon for document types
 * @param {string} documentType - Type of document
 * @returns {string} Icon name for the document type
 */
const getDocumentTypeIcon = (documentType) => {
  if (!documentType) return 'FileText';
  
  const typeIconMap = {
    'Physical Therapy Assessment': 'Activity',
    'Physical Therapy': 'Activity',
    'Occupational Therapy': 'Hand',
    'Speech Therapy': 'MessageSquare',
    'Nursing Assessment': 'Heart',
    'Nursing': 'Heart',
    'Dietitian Consultation': 'Apple',
    'Dietitian': 'Apple',
    'Mental Health': 'Brain',
    'Psychology': 'Brain',
    'Discharge Summary': 'FileCheck',
    'Progress Note': 'TrendingUp',
    'Assessment': 'CheckSquare',
    'Evaluation': 'Search',
    'Treatment Plan': 'Target',
    'Consultation': 'Users'
  };
  
  // Find matching icon
  for (const [key, icon] of Object.entries(typeIconMap)) {
    if (documentType?.toLowerCase()?.includes(key?.toLowerCase())) {
      return icon;
    }
  }
  
  return 'FileText'; // Default icon
};

/**
 * Get user-specific team activity
 * @param {string} userName - Current user name
 * @returns {Array} Array of activity objects
 */
const getUserTeamActivity = (userName) => {
  const allActivities = [
    {
      id: 1,
      user: 'Lauren Carvell',
      action: 'used AI suggestions to enhance physical therapy assessment',
      type: 'ai_enhanced',
      timestamp: '2025-08-26T01:00:00Z'
    },
    {
      id: 2,
      user: 'Mike Rodriguez',
      action: 'approved discharge summary for Patient K.L.',
      type: 'document_approved',
      timestamp: '2025-08-26T00:45:00Z'
    },
    {
      id: 3,
      user: 'Lisa Park',
      action: 'generated AI summary for speech therapy notes',
      type: 'ai_summary',
      timestamp: '2025-08-26T00:30:00Z'
    },
    {
      id: 4,
      user: 'James Wilson',
      action: 'applied AI tone adjustment to patient documentation',
      type: 'ai_tone_adjustment',
      timestamp: '2025-08-26T00:15:00Z'
    },
    {
      id: 5,
      user: 'Lauren Carvell',
      action: 'invited new team member Emma Davis',
      type: 'team_invite',
      timestamp: '2025-08-25T23:50:00Z'
    },
    {
      id: 6,
      user: userName,
      action: 'completed AI-assisted weekly documentation review',
      type: 'ai_review_completed',
      timestamp: '2025-08-25T23:20:00Z'
    }
  ];

  // Include user's own activities and relevant team activities
  return allActivities?.slice(0, 6);
};

/**
 * Get user-specific upcoming deadlines
 * @param {string} userName - Current user name
 * @returns {Array} Array of deadline objects
 */
const getUserDeadlines = (userName) => {
  const allDeadlines = [
    {
      id: 1,
      title: 'Patient Progress Reviews',
      description: 'Monthly progress reviews for 12 patients',
      assignee: 'Lauren Carvell',
      dueDate: '2025-08-27T17:00:00Z',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Insurance Authorization',
      description: 'Submit prior authorization for continued therapy',
      assignee: 'Mike Rodriguez',
      dueDate: '2025-08-28T12:00:00Z',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Quality Assurance Review',
      description: 'Monthly QA review of documentation standards',
      assignee: 'Lisa Park',
      dueDate: '2025-08-30T15:00:00Z',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Patient Care Plan Updates',
      description: 'Update care plans for assigned patients',
      assignee: userName,
      dueDate: '2025-08-29T16:00:00Z',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Team Meeting Preparation',
      description: 'Prepare monthly team performance reports',
      assignee: userName,
      dueDate: '2025-09-01T10:00:00Z',
      priority: 'low'
    }
  ];

  // Filter deadlines assigned to the current user or show all if supervisor
  const userDeadlines = allDeadlines?.filter(deadline => 
    deadline?.assignee === userName || userName === 'Lauren Carvell'
  );

  return userDeadlines?.slice(0, 3);
};

/**
 * Get user-specific productivity data
 * @returns {Array} Array of productivity data points
 */
const getUserProductivityData = () => {
  // Generate realistic productivity data with some variation
  const baseData = [
    { day: 'Mon', documents: 12 },
    { day: 'Tue', documents: 19 },
    { day: 'Wed', documents: 15 },
    { day: 'Thu', documents: 22 },
    { day: 'Fri', documents: 18 },
    { day: 'Sat', documents: 8 },
    { day: 'Sun', documents: 5 }
  ];

  return baseData;
};

/**
 * Get user-specific compliance reminders
 * @param {string} userName - Current user name
 * @returns {Array} Array of compliance reminder objects
 */
const getUserComplianceReminders = (userName) => {
  const baseReminders = [
    {
      id: 1,
      title: 'HIPAA Training Renewal',
      description: 'Annual HIPAA compliance training expires in 5 days',
      severity: 'critical',
      dueDate: '2025-08-31T23:59:59Z',
      assignedTo: userName
    },
    {
      id: 2,
      title: 'Documentation Audit',
      description: 'Quarterly documentation review scheduled',
      severity: 'warning',
      dueDate: '2025-09-15T17:00:00Z',
      assignedTo: userName
    }
  ];

  // Add user-specific reminders based on role
  if (userName === 'Lauren Carvell') {
    baseReminders?.push({
      id: 3,
      title: 'Supervisor Training Update',
      description: 'Complete quarterly supervisor certification training',
      severity: 'info',
      dueDate: '2025-09-10T17:00:00Z',
      assignedTo: userName
    });
  }

  return baseReminders;
};

export default {
  getPersonalizedDashboardData,
  getUserNameFromEmail
};