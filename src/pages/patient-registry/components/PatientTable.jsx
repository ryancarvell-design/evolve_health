import React from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { formatDistanceToNow } from 'date-fns';

const PatientTable = ({
  patients = [],
  selectedPatients = [],
  onPatientSelect,
  onSelectAll,
  onPatientView,
  onPatientEdit,
  onPatientDelete,
  permissions,
  sortBy,
  sortOrder,
  onSort
}) => {
  const isAllSelected = patients?.length > 0 && selectedPatients?.length === patients?.length;
  const isPartiallySelected = selectedPatients?.length > 0 && selectedPatients?.length < patients?.length;

  const formatLastActivity = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges?.[status] || badges?.inactive}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const renderSortHeader = (field, label) => (
    <button
      onClick={() => onSort?.(field)}
      className="flex items-center space-x-1 text-left font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      <span>{label}</span>
      <Icon name={getSortIcon(field)} size={14} />
    </button>
  );

  if (patients?.length === 0) {
    return (
      <div className="p-8 text-center">
        <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
        <p className="text-muted-foreground mb-4">
          No patients match your current search criteria.
        </p>
        {permissions?.canAdd && (
          <Button onClick={() => onPatientEdit?.()}>
            <Icon name="Plus" size={16} className="mr-2" />
            Add First Patient
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="bg-muted/50">
            <th className="w-12 p-4">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isPartiallySelected}
                onCheckedChange={(checked) => onSelectAll?.(checked)}
              />
            </th>
            <th className="text-left p-4">
              {renderSortHeader('name', 'Patient')}
            </th>
            <th className="text-left p-4">Contact</th>
            <th className="text-left p-4">Care Team</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">
              {renderSortHeader('totalDocuments', 'Documents')}
            </th>
            <th className="text-left p-4">
              {renderSortHeader('lastActivity', 'Last Activity')}
            </th>
            <th className="w-32 p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {patients?.map((patient) => {
            const isSelected = selectedPatients?.includes(patient?.id);
            
            return (
              <tr 
                key={patient?.id}
                className={`hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
              >
                <td className="p-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onPatientSelect?.(patient?.id, checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">
                      {patient?.firstName} {patient?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {patient?.patientId} | MRN: {patient?.mrn}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      DOB: {new Date(patient?.dateOfBirth)?.toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="text-sm">{patient?.phone}</div>
                    <div className="text-sm text-muted-foreground">{patient?.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{patient?.assignedSpecialty}</div>
                    <div className="text-sm text-muted-foreground">
                      {patient?.careTeam?.slice(0, 2)?.join(', ')}
                      {patient?.careTeam?.length > 2 && (
                        <span className="text-primary"> +{patient?.careTeam?.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(patient?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{patient?.totalDocuments}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="text-sm">{formatLastActivity(patient?.lastActivity)}</div>
                    <div className="text-xs text-muted-foreground">
                      by {patient?.lastUpdatedBy}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPatientView?.(patient)}
                      className="p-2"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    {permissions?.canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPatientEdit?.(patient)}
                        className="p-2"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                    )}
                    {permissions?.canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPatientDelete?.(patient?.id)}
                        className="p-2 text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;