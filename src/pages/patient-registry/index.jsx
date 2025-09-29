import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import PatientTable from './components/PatientTable';
import PatientDetailModal from './components/PatientDetailModal';
import AddPatientModal from './components/AddPatientModal';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import AdvancedFilters from './components/AdvancedFilters';
import { useToast } from '../../components/ui/NotificationToast';
import { initializePatientStorage, getPatients as getStoredPatients } from '../../utils/patientRegistry';

const PatientRegistry = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('lastActivity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentUser, setCurrentUser] = useState(null);
  const { addToast } = useToast();

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Initialize responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarCollapsed(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mock user permissions - replace with actual auth
  const userPermissions = {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canViewAll: true,
    role: 'team_lead' // admin, team_lead, member
  };

  // Mock initial patients data - now loaded from storage
  useEffect(() => {
    // Initialize patient storage first
    initializePatientStorage();
    
    // Load patients from storage
    const storedPatients = getStoredPatients();
    if (storedPatients?.length > 0) {
      setPatients(storedPatients);
      setFilteredPatients(storedPatients);
    } else {
      // Fallback to mock data if storage is empty
      const mockPatients = [
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
          lastUpdatedBy: 'Dr. Smith',
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
          lastUpdatedBy: 'Therapist Adams',
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
          lastUpdatedBy: 'Dr. Brown',
          createdAt: '2024-05-20T09:30:00Z',
          notes: 'Treatment completed, follow-up scheduled',
          insurance: 'United Healthcare',
          mrn: 'MRN345678'
        }
      ];
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
    }
  }, []);

  // Filter and search patients
  useEffect(() => {
    let filtered = patients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(patient =>
        `${patient?.firstName} ${patient?.lastName}`?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        patient?.patientId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        patient?.phone?.includes(searchTerm) ||
        patient?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        patient?.mrn?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(patient => patient?.status === statusFilter);
    }

    // Apply team filter
    if (teamFilter !== 'all') {
      filtered = filtered?.filter(patient => 
        patient?.careTeam?.some(member => member?.toLowerCase()?.includes(teamFilter?.toLowerCase()))
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'name') {
        aValue = `${a?.firstName} ${a?.lastName}`;
        bValue = `${b?.firstName} ${b?.lastName}`;
      } else if (sortBy === 'lastActivity' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredPatients(filtered);
  }, [patients, searchTerm, statusFilter, teamFilter, sortBy, sortOrder]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePatientSelect = (patientId, isSelected) => {
    if (isSelected) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev?.filter(id => id !== patientId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedPatients(filteredPatients?.map(p => p?.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handlePatientView = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handlePatientEdit = (patient) => {
    setSelectedPatient(patient);
    setShowAddPatient(true);
  };

  const handlePatientDelete = async (patientId) => {
    if (!userPermissions?.canDelete) {
      addToast('You do not have permission to delete patients', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        // Mock delete - replace with actual API call
        setPatients(prev => prev?.filter(p => p?.id !== patientId));
        setSelectedPatients(prev => prev?.filter(id => id !== patientId));
        addToast('Patient deleted successfully', 'success');
      } catch (error) {
        addToast('Failed to delete patient', 'error');
      }
    }
  };

  const handleAddPatient = () => {
    if (!userPermissions?.canAdd) {
      addToast('You do not have permission to add patients', 'error');
      return;
    }
    setSelectedPatient(null);
    setShowAddPatient(true);
  };

  const handlePatientSave = async (patientData) => {
    try {
      let updatedPatients;
      
      if (patientData?.id) {
        // Edit existing patient
        updatedPatients = patients?.map(p => 
          p?.id === patientData?.id ? { 
            ...patientData, 
            lastActivity: new Date()?.toISOString() 
          } : p
        );
        addToast('Patient updated successfully', 'success');
      } else {
        // Add new patient
        const newPatient = {
          ...patientData,
          id: `pt_${Date.now()}`,
          patientId: `PT-2024-${String(patients?.length + 1)?.padStart(3, '0')}`,
          createdAt: new Date()?.toISOString(),
          lastActivity: new Date()?.toISOString(),
          totalDocuments: 0,
          documentHistory: [],
          recentDocuments: []
        };
        updatedPatients = [...patients, newPatient];
        addToast('Patient added successfully', 'success');
      }
      
      setPatients(updatedPatients);
      
      // Save to localStorage to maintain sync with patient registry utility
      localStorage.setItem('evolve_health_patients', JSON.stringify(updatedPatients));
      
      setShowAddPatient(false);
    } catch (error) {
      addToast('Failed to save patient', 'error');
    }
  };

  const handleBulkAction = async (action, patientIds) => {
    try {
      switch (action) {
        case 'delete':
          if (!userPermissions?.canDelete) {
            addToast('You do not have permission to delete patients', 'error');
            return;
          }
          if (window.confirm(`Are you sure you want to delete ${patientIds?.length} patient(s)?`)) {
            setPatients(prev => prev?.filter(p => !patientIds?.includes(p?.id)));
            setSelectedPatients([]);
            addToast(`${patientIds?.length} patient(s) deleted successfully`, 'success');
          }
          break;
        case 'export':
          addToast('Export functionality would be implemented here', 'info');
          break;
        case 'archive':
          setPatients(prev => prev?.map(p => 
            patientIds?.includes(p?.id) ? { ...p, status: 'inactive' } : p
          ));
          setSelectedPatients([]);
          addToast(`${patientIds?.length} patient(s) archived successfully`, 'success');
          break;
        default:
          break;
      }
    } catch (error) {
      addToast('Bulk action failed', 'error');
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Patient Registry' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const teamOptions = [
    { value: 'all', label: 'All Teams' },
    { value: 'dr. smith', label: 'Dr. Smith' },
    { value: 'dr. johnson', label: 'Dr. Johnson' },
    { value: 'dr. brown', label: 'Dr. Brown' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'lastActivity', label: 'Last Activity' },
    { value: 'createdAt', label: 'Date Added' },
    { value: 'totalDocuments', label: 'Document Count' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle}
      />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-3 sm:p-6">
          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden sm:block mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          {/* Page Header - Responsive */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Patient Registry</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isMobile 
                    ? `${filteredPatients?.length} of ${patients?.length} patients`
                    : `Manage and track patients for your healthcare team. ${filteredPatients?.length} of ${patients?.length} patients shown.`
                  }
                </p>
              </div>
              <div className="flex items-center justify-end sm:justify-start">
                {userPermissions?.canAdd && (
                  <Button onClick={handleAddPatient} className="flex items-center text-sm sm:text-base">
                    <Icon name="Plus" size={16} className="mr-1 sm:mr-2" />
                    {isMobile ? 'Add Patient' : 'Add New Patient'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filters - Responsive Layout */}
          <div className="bg-card rounded-lg shadow-clinical mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="space-y-3 sm:space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={isMobile ? "Search patients..." : "Search patients by name, ID, phone, email, or MRN..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
                
                {/* Filters - Stack on mobile, inline on desktop */}
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
                  <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-0 sm:space-x-3 sm:flex-1">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      options={statusOptions}
                      className="text-sm sm:w-40"
                    />
                    <Select
                      value={teamFilter}
                      onValueChange={setTeamFilter}
                      options={teamOptions}
                      className="text-sm sm:w-40"
                    />
                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}
                      options={sortOptions}
                      className="text-sm sm:w-40"
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Icon name={sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"} size={14} />
                        {!isMobile && <span className="ml-1">Sort</span>}
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center text-sm justify-center sm:justify-start"
                  >
                    <Icon name="Filter" size={16} className="mr-1 sm:mr-2" />
                    {isMobile ? 'Filters' : 'Advanced'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <AdvancedFilters
                onFilterChange={(filters) => {
                  // Apply advanced filters
                  console.log('Advanced filters:', filters);
                }}
              />
            )}
          </div>

          {/* Bulk Actions - Mobile optimized */}
          {selectedPatients?.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedPatients?.length}
              onBulkAction={(action) => handleBulkAction(action, selectedPatients)}
              permissions={userPermissions}
              isMobile={isMobile}
            />
          )}

          {/* Patient Table - Responsive wrapper */}
          <div className="bg-card rounded-lg shadow-clinical overflow-hidden">
            <PatientTable
              patients={filteredPatients}
              selectedPatients={selectedPatients}
              onPatientSelect={handlePatientSelect}
              onSelectAll={handleSelectAll}
              onPatientView={handlePatientView}
              onPatientEdit={handlePatientEdit}
              onPatientDelete={handlePatientDelete}
              permissions={userPermissions}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={(field) => {
                if (sortBy === field) {
                  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy(field);
                  setSortOrder('asc');
                }
              }}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        isOpen={showPatientDetail}
        onClose={() => setShowPatientDetail(false)}
        patient={selectedPatient}
        onEdit={() => {
          setShowPatientDetail(false);
          handlePatientEdit(selectedPatient);
        }}
        permissions={userPermissions}
        isMobile={isMobile}
      />

      {/* Add/Edit Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        patient={selectedPatient}
        onSave={handlePatientSave}
        isEditing={!!selectedPatient}
        isMobile={isMobile}
      />
    </div>
  );
};

export default PatientRegistry;