import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const AdvancedFilters = ({ isVisible, onApply, onClear }) => {
  const [filters, setFilters] = useState({
    dateRange: '',
    documentType: '',
    status: '',
    teamMember: '',
    patientAge: '',
    priority: ''
  });

  const documentTypes = [
    { value: 'assessment', label: 'Assessment' },
    { value: 'progress-note', label: 'Progress Note' },
    { value: 'treatment-plan', label: 'Treatment Plan' },
    { value: 'discharge-summary', label: 'Discharge Summary' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'consultation', label: 'Consultation' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending-review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'archived', label: 'Archived' }
  ];

  const teamMembers = [
    { value: 'dr-chen', label: 'Dr. Sarah Chen' },
    { value: 'pt-johnson', label: 'Mark Johnson, PT' },
    { value: 'ot-williams', label: 'Lisa Williams, OT' },
    { value: 'slp-davis', label: 'Jennifer Davis, SLP' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({
      dateRange: '',
      documentType: '',
      status: '',
      teamMember: '',
      patientAge: '',
      priority: ''
    });
    onClear();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-muted border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <Icon name="Filter" size={16} className="mr-2" />
          Advanced Filters
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Input
            label="Date Range"
            type="date"
            value={filters?.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
            className="mb-0"
          />
        </div>
        
        <div>
          <Select
            label="Document Type"
            options={documentTypes}
            value={filters?.documentType}
            onChange={(value) => handleFilterChange('documentType', value)}
            placeholder="All types"
          />
        </div>
        
        <div>
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="All statuses"
          />
        </div>
        
        <div>
          <Select
            label="Team Member"
            options={teamMembers}
            value={filters?.teamMember}
            onChange={(value) => handleFilterChange('teamMember', value)}
            placeholder="All members"
          />
        </div>
        
        <div>
          <Input
            label="Patient Age Range"
            type="text"
            placeholder="e.g., 18-65"
            value={filters?.patientAge}
            onChange={(e) => handleFilterChange('patientAge', e?.target?.value)}
            className="mb-0"
          />
        </div>
        
        <div>
          <Select
            label="Priority"
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => handleFilterChange('priority', value)}
            placeholder="All priorities"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
        <Button variant="outline" onClick={handleClear}>
          Clear All
        </Button>
        <Button onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters;