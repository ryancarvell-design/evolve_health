import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TeamMemberTable = ({ 
  members, 
  selectedMembers, 
  onMemberSelect, 
  onSelectAll, 
  onManageMember,
  sortBy,
  sortOrder,
  onSort
}) => {
  const formatLastActivity = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getLicenseStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50 border-green-200';
      case 'Expiring Soon': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'Senior': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Standard': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Administrative': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortBy === field && (
          <Icon 
            name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-clinical overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {members?.length} members found
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={selectedMembers?.length === members?.length && members?.length > 0}
                  indeterminate={selectedMembers?.length > 0 && selectedMembers?.length < members?.length}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <SortableHeader field="name">Member</SortableHeader>
              <SortableHeader field="role">Role & Specialty</SortableHeader>
              <SortableHeader field="department">Department</SortableHeader>
              <SortableHeader field="licenseStatus">License Status</SortableHeader>
              <SortableHeader field="lastActivity">Last Activity</SortableHeader>
              <SortableHeader field="accessLevel">Access Level</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {members?.map((member) => (
              <tr key={member?.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedMembers?.includes(member?.id)}
                    onChange={(e) => onMemberSelect(member?.id, e?.target?.checked)}
                  />
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member?.profilePhoto}
                      alt={member?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{member?.name}</p>
                      <p className="text-sm text-muted-foreground">{member?.email}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{member?.role}</p>
                    <p className="text-sm text-muted-foreground">{member?.specialty}</p>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{member?.department}</p>
                </td>
                
                <td className="px-6 py-4">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLicenseStatusColor(member?.licenseStatus)}`}>
                      {member?.licenseStatus}
                    </span>
                    {member?.licenseExpiry && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {new Date(member?.licenseExpiry)?.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {formatLastActivity(member?.lastActivity)}
                  </p>
                </td>
                
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAccessLevelColor(member?.accessLevel)}`}>
                    {member?.accessLevel}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageMember(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Icon name="Settings" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {members?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No team members found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TeamMemberTable;