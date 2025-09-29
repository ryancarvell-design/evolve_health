import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ManageMemberModal = ({ isOpen, member, onClose, onUpdateMember }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (member) {
      setFormData({ ...member });
      // Mock audit logs
      setAuditLogs([
        {
          id: 1,
          action: 'Profile Updated',
          description: 'Email address changed',
          timestamp: '2025-08-25T10:30:00Z',
          performedBy: 'Admin User'
        },
        {
          id: 2,
          action: 'Permissions Modified',
          description: 'Added billing_access permission',
          timestamp: '2025-08-20T14:15:00Z',
          performedBy: 'Admin User'
        },
        {
          id: 3,
          action: 'License Verified',
          description: 'Professional license verified and updated',
          timestamp: '2025-08-15T09:45:00Z',
          performedBy: 'System'
        }
      ]);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const accessLevels = ['Senior', 'Standard', 'Administrative', 'Limited'];
  const departments = [
    'Physical Therapy',
    'Speech Therapy', 
    'Occupational Therapy',
    'Mental Health',
    'Administration'
  ];

  const availablePermissions = [
    { id: 'documentation_access', label: 'Documentation Access', category: 'Basic' },
    { id: 'patient_records', label: 'Patient Records', category: 'Basic' },
    { id: 'team_supervision', label: 'Team Supervision', category: 'Advanced' },
    { id: 'billing_access', label: 'Billing Access', category: 'Administrative' },
    { id: 'scheduling', label: 'Scheduling', category: 'Administrative' },
    { id: 'confidential_access', label: 'Confidential Access', category: 'Specialized' }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePermissionChange = (permissionId, isChecked) => {
    const updatedPermissions = isChecked
      ? [...(formData?.permissions || []), permissionId]
      : (formData?.permissions || [])?.filter(p => p !== permissionId);
    
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onUpdateMember(formData);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString();
  };

  const getLicenseStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50 border-green-200';
      case 'Expiring Soon': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Info', icon: 'User' },
    { id: 'permissions', label: 'Permissions', icon: 'Key' },
    { id: 'license', label: 'License & Credentials', icon: 'Shield' },
    { id: 'audit', label: 'Audit Trail', icon: 'History' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-clinical max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <img
              src={member?.profilePhoto}
              alt={member?.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{member?.name}</h2>
              <p className="text-sm text-muted-foreground">{member?.role} • {member?.department}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8 px-6">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData?.name || ''}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData?.email || ''}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                />
                <Input
                  label="Role"
                  value={formData?.role || ''}
                  onChange={(e) => handleInputChange('role', e?.target?.value)}
                />
                <Input
                  label="Specialty"
                  value={formData?.specialty || ''}
                  onChange={(e) => handleInputChange('specialty', e?.target?.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department
                  </label>
                  <select
                    value={formData?.department || ''}
                    onChange={(e) => handleInputChange('department', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {departments?.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Access Level
                  </label>
                  <select
                    value={formData?.accessLevel || ''}
                    onChange={(e) => handleInputChange('accessLevel', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {accessLevels?.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Update Profile</Button>
              </div>
            </form>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">Permission Matrix</h3>
              
              {['Basic', 'Advanced', 'Administrative', 'Specialized']?.map(category => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {availablePermissions
                      ?.filter(perm => perm?.category === category)
                      ?.map(permission => (
                        <label key={permission?.id} className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-muted/50">
                          <input
                            type="checkbox"
                            checked={(formData?.permissions || [])?.includes(permission?.id)}
                            onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">{permission?.label}</span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Update Permissions</Button>
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">License & Credentialing</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLicenseStatusColor(formData?.licenseStatus)}`}>
                  {formData?.licenseStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="License Number"
                  value={formData?.licenseNumber || 'Not provided'}
                  readOnly
                />
                <Input
                  label="License Expiry Date"
                  type="date"
                  value={formData?.licenseExpiry || ''}
                  onChange={(e) => handleInputChange('licenseExpiry', e?.target?.value)}
                />
                <Input
                  label="Credentialing Status"
                  value={formData?.credentialingStatus || ''}
                  readOnly
                />
                <Input
                  label="Join Date"
                  value={formData?.joinDate || ''}
                  readOnly
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Professional Verification</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-sm text-foreground">Background check completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-sm text-foreground">Education verification completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-yellow-600" />
                    <span className="text-sm text-foreground">Reference check pending</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                <Button onClick={handleSubmit}>Update License Info</Button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">Audit Trail</h3>
              
              <div className="space-y-4">
                {auditLogs?.map(log => (
                  <div key={log?.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <Icon name="History" size={16} className="text-muted-foreground mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{log?.action}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(log?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{log?.description}</p>
                      <p className="text-xs text-muted-foreground">Performed by: {log?.performedBy}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMemberModal;