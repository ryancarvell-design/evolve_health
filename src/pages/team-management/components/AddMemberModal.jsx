import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AddMemberModal = ({ isOpen, onClose, onAddMember }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    specialty: '',
    department: '',
    accessLevel: 'Standard',
    permissions: [],
    licenseNumber: '',
    licenseExpiry: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const roles = [
    'Physical Therapist',
    'Speech Therapist', 
    'Occupational Therapist',
    'Mental Health Counselor',
    'Clinical Director',
    'Administrative Coordinator'
  ];

  const departments = [
    'Physical Therapy',
    'Speech Therapy',
    'Occupational Therapy', 
    'Mental Health',
    'Administration'
  ];

  const accessLevels = [
    'Senior',
    'Standard', 
    'Administrative',
    'Limited'
  ];

  const availablePermissions = [
    { id: 'documentation_access', label: 'Documentation Access', category: 'Basic' },
    { id: 'patient_records', label: 'Patient Records', category: 'Basic' },
    { id: 'team_supervision', label: 'Team Supervision', category: 'Advanced' },
    { id: 'billing_access', label: 'Billing Access', category: 'Administrative' },
    { id: 'scheduling', label: 'Scheduling', category: 'Administrative' },
    { id: 'confidential_access', label: 'Confidential Access', category: 'Specialized' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData?.role) newErrors.role = 'Role is required';
    if (!formData?.department) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onAddMember({
        ...formData,
        licenseStatus: formData?.licenseNumber ? 'Active' : 'N/A',
        credentialingStatus: formData?.licenseNumber ? 'Pending Verification' : 'N/A'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        specialty: '',
        department: '',
        accessLevel: 'Standard',
        permissions: [],
        licenseNumber: '',
        licenseExpiry: ''
      });
    }
  };

  const handlePermissionChange = (permissionId, isChecked) => {
    const updatedPermissions = isChecked
      ? [...formData?.permissions, permissionId]
      : formData?.permissions?.filter(p => p !== permissionId);
    
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-clinical max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Add Team Member</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Full Name *"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role *
                </label>
                <select
                  value={formData?.role}
                  onChange={(e) => handleInputChange('role', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select role</option>
                  {roles?.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors?.role && <p className="text-red-500 text-sm mt-1">{errors?.role}</p>}
              </div>
              
              <div>
                <Input
                  label="Specialty"
                  value={formData?.specialty}
                  onChange={(e) => handleInputChange('specialty', e?.target?.value)}
                  placeholder="Enter specialty"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department *
                </label>
                <select
                  value={formData?.department}
                  onChange={(e) => handleInputChange('department', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {departments?.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors?.department && <p className="text-red-500 text-sm mt-1">{errors?.department}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Access Level
                </label>
                <select
                  value={formData?.accessLevel}
                  onChange={(e) => handleInputChange('accessLevel', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {accessLevels?.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">License Information (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="License Number"
                  value={formData?.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e?.target?.value)}
                  placeholder="Enter license number"
                />
              </div>
              
              <div>
                <Input
                  label="License Expiry Date"
                  type="date"
                  value={formData?.licenseExpiry}
                  onChange={(e) => handleInputChange('licenseExpiry', e?.target?.value)}
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Permissions</h3>
            
            <div className="space-y-2">
              {['Basic', 'Advanced', 'Administrative', 'Specialized']?.map(category => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {availablePermissions
                      ?.filter(perm => perm?.category === category)
                      ?.map(permission => (
                        <label key={permission?.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData?.permissions?.includes(permission?.id)}
                            onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">{permission?.label}</span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Team Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;