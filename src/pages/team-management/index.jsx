import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import OrganizationOverview from './components/OrganizationOverview';
import TeamMemberTable from './components/TeamMemberTable';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import QuickActionsPanel from './components/QuickActionsPanel';
import AddMemberModal from './components/AddMemberModal';
import ManageMemberModal from './components/ManageMemberModal';

const TeamManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterAccessLevel, setFilterAccessLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showManageMemberModal, setShowManageMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: 'current-user',
    role: 'admin',
    permissions: ['team_management', 'user_administration', 'billing_access']
  });

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock organization data
  const organizationData = {
    name: 'Evolve Healthcare Partners',
    totalMembers: 47,
    activeLicenses: 42,
    pendingInvitations: 3,
    complianceScore: 96.8,
    departments: [
      { name: 'Physical Therapy', memberCount: 15 },
      { name: 'Speech Therapy', memberCount: 12 },
      { name: 'Occupational Therapy', memberCount: 8 },
      { name: 'Mental Health', memberCount: 7 },
      { name: 'Administration', memberCount: 5 }
    ]
  };

  // Mock team members data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      profilePhoto: '/assets/images/no_image.png',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@evolvehealth.com',
      role: 'Clinical Director',
      specialty: 'Physical Therapy',
      department: 'Physical Therapy',
      licenseStatus: 'Active',
      licenseExpiry: '2025-03-15',
      lastActivity: '2025-08-26T04:30:00Z',
      permissions: ['documentation_access', 'patient_records', 'team_supervision'],
      accessLevel: 'Senior',
      status: 'active',
      joinDate: '2023-01-15',
      credentialingStatus: 'Verified'
    },
    {
      id: 2,
      profilePhoto: '/assets/images/no_image.png',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@evolvehealth.com',
      role: 'Speech Therapist',
      specialty: 'Speech Therapy',
      department: 'Speech Therapy',
      licenseStatus: 'Active',
      licenseExpiry: '2024-11-22',
      lastActivity: '2025-08-26T02:15:00Z',
      permissions: ['documentation_access', 'patient_records'],
      accessLevel: 'Standard',
      status: 'active',
      joinDate: '2023-04-10',
      credentialingStatus: 'Verified'
    },
    {
      id: 3,
      profilePhoto: '/assets/images/no_image.png',
      name: 'Lisa Park',
      email: 'lisa.park@evolvehealth.com',
      role: 'Occupational Therapist',
      specialty: 'Occupational Therapy',
      department: 'Occupational Therapy',
      licenseStatus: 'Expiring Soon',
      licenseExpiry: '2024-09-30',
      lastActivity: '2025-08-25T18:45:00Z',
      permissions: ['documentation_access', 'patient_records'],
      accessLevel: 'Standard',
      status: 'active',
      joinDate: '2023-06-20',
      credentialingStatus: 'Pending Renewal'
    },
    {
      id: 4,
      profilePhoto: '/assets/images/no_image.png',
      name: 'James Wilson',
      email: 'james.wilson@evolvehealth.com',
      role: 'Mental Health Counselor',
      specialty: 'Mental Health',
      department: 'Mental Health',
      licenseStatus: 'Active',
      licenseExpiry: '2025-06-18',
      lastActivity: '2025-08-26T01:20:00Z',
      permissions: ['documentation_access', 'patient_records', 'confidential_access'],
      accessLevel: 'Standard',
      status: 'active',
      joinDate: '2023-08-12',
      credentialingStatus: 'Verified'
    },
    {
      id: 5,
      profilePhoto: '/assets/images/no_image.png',
      name: 'Emma Davis',
      email: 'emma.davis@evolvehealth.com',
      role: 'Administrative Coordinator',
      specialty: 'Administration',
      department: 'Administration',
      licenseStatus: 'N/A',
      licenseExpiry: null,
      lastActivity: '2025-08-26T03:10:00Z',
      permissions: ['documentation_access', 'scheduling', 'billing_access'],
      accessLevel: 'Administrative',
      status: 'active',
      joinDate: '2023-02-28',
      credentialingStatus: 'N/A'
    }
  ]);

  // Permission access check
  const hasTeamManagementAccess = () => {
    return currentUser?.permissions?.includes('team_management') || currentUser?.role === 'admin';
  };

  // Access denied component
  if (!hasTeamManagementAccess()) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        <main className={`pt-16 transition-clinical ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
          <div className="flex flex-col items-center justify-center h-96 p-6">
            <Icon name="Lock" size={64} className="text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground text-center mb-6">
              You don't have permission to access Team Management. Please contact your administrator.
            </p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics-dashboard' },
    { label: 'Team Management', href: '/team-management' }
  ];

  const handleMemberSelect = (memberId, isSelected) => {
    if (isSelected) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers?.filter(id => id !== memberId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedMembers(teamMembers?.map(member => member?.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleManageMember = (member) => {
    setSelectedMember(member);
    setShowManageMemberModal(true);
  };

  const handleUpdateMember = (updatedMember) => {
    setTeamMembers(teamMembers?.map(member => 
      member?.id === updatedMember?.id ? updatedMember : member
    ));
    setShowManageMemberModal(false);
    setSelectedMember(null);
  };

  const handleAddMember = (newMember) => {
    const memberWithId = {
      ...newMember,
      id: teamMembers?.length + 1,
      status: 'pending',
      joinDate: new Date()?.toISOString()?.split('T')?.[0],
      lastActivity: new Date()?.toISOString(),
      profilePhoto: '/assets/images/no_image.png'
    };
    setTeamMembers([...teamMembers, memberWithId]);
    setShowAddMemberModal(false);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on members:`, selectedMembers);
    // Implement bulk actions here
    setSelectedMembers([]);
  };

  // Filter and sort team members
  const filteredMembers = teamMembers?.filter(member => {
    const matchesSearch = member?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         member?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesRole = filterRole === 'all' || member?.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member?.department === filterDepartment;
    const matchesAccessLevel = filterAccessLevel === 'all' || member?.accessLevel === filterAccessLevel;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesAccessLevel;
  })?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      <main className={`pt-16 transition-clinical ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Team Management</h1>
              <p className="text-muted-foreground">
                Manage team members, permissions, and organizational access for healthcare professionals
              </p>
            </div>
            
            {/* Quick Action Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
              <Button 
                onClick={() => setShowAddMemberModal(true)}
                className="flex items-center gap-2"
              >
                <Icon name="UserPlus" size={16} />
                Add Team Member
              </Button>
            </div>
          </div>

          {/* Organization Overview */}
          <OrganizationOverview data={organizationData} />

          {/* Filters and Search */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-clinical mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
                >
                  <option value="all">All Roles</option>
                  <option value="Clinical Director">Clinical Director</option>
                  <option value="Speech Therapist">Speech Therapist</option>
                  <option value="Occupational Therapist">Occupational Therapist</option>
                  <option value="Mental Health Counselor">Mental Health Counselor</option>
                  <option value="Administrative Coordinator">Administrative Coordinator</option>
                </select>
                
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
                >
                  <option value="all">All Departments</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Speech Therapy">Speech Therapy</option>
                  <option value="Occupational Therapy">Occupational Therapy</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Administration">Administration</option>
                </select>
                
                <select
                  value={filterAccessLevel}
                  onChange={(e) => setFilterAccessLevel(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
                >
                  <option value="all">All Access Levels</option>
                  <option value="Senior">Senior</option>
                  <option value="Standard">Standard</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedMembers?.length > 0 && (
            <BulkActionsToolbar 
              selectedCount={selectedMembers?.length}
              onBulkAction={handleBulkAction}
            />
          )}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Team Member Table */}
            <div className="xl:col-span-3">
              <TeamMemberTable
                members={filteredMembers}
                selectedMembers={selectedMembers}
                onMemberSelect={handleMemberSelect}
                onSelectAll={handleSelectAll}
                onManageMember={handleManageMember}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={(field) => {
                  if (sortBy === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(field);
                    setSortOrder('asc');
                  }
                }}
              />
            </div>

            {/* Quick Actions Panel */}
            <div className="xl:col-span-1">
              <QuickActionsPanel onAddMember={() => setShowAddMemberModal(true)} />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddMemberModal && (
        <AddMemberModal
          isOpen={showAddMemberModal}
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}

      {showManageMemberModal && selectedMember && (
        <ManageMemberModal
          isOpen={showManageMemberModal}
          member={selectedMember}
          onClose={() => {
            setShowManageMemberModal(false);
            setSelectedMember(null);
          }}
          onUpdateMember={handleUpdateMember}
        />
      )}
    </div>
  );
};

export default TeamManagement;