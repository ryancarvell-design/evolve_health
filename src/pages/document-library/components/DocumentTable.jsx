import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DocumentTable = ({ documents, selectedDocuments, onSelectDocument, onSelectAll, onPreview, onEdit }) => {
  const [sortField, setSortField] = useState('lastModified');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { bg: 'bg-warning/10', text: 'text-warning', label: 'Draft' },
      'pending-review': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending Review' },
      'approved': { bg: 'bg-success/10', text: 'text-success', label: 'Approved' },
      'archived': { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Archived' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = {
      'urgent': { icon: 'AlertTriangle', color: 'text-error' },
      'high': { icon: 'ArrowUp', color: 'text-warning' },
      'normal': { icon: 'Minus', color: 'text-muted-foreground' },
      'low': { icon: 'ArrowDown', color: 'text-success' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.normal;
    
    return <Icon name={config?.icon} size={16} className={config?.color} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedDocuments?.length === documents?.length}
                  onChange={onSelectAll}
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('documentName')}
                  className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Document Name
                  <Icon name={getSortIcon('documentName')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('patientId')}
                  className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Patient ID
                  <Icon name={getSortIcon('patientId')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('documentType')}
                  className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Document Type
                  <Icon name={getSortIcon('documentType')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('createdDate')}
                  className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Created
                  <Icon name={getSortIcon('createdDate')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('lastModified')}
                  className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Last Modified
                  <Icon name={getSortIcon('lastModified')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Team Member</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents?.map((doc) => (
              <tr key={doc?.id} className="border-b border-border hover:bg-muted/50 transition-clinical">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedDocuments?.includes(doc?.id)}
                    onChange={() => onSelectDocument(doc?.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Icon name="FileText" size={16} className="mr-2 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{doc?.title || doc?.documentName}</span>
                      {doc?.patientInfo?.name && (
                        <p className="text-xs text-muted-foreground">
                          Patient: {doc?.patientInfo?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    {doc?.patientInfo?.patientId ? (
                      <span className="font-mono text-sm text-foreground">{doc?.patientInfo?.patientId}</span>
                    ) : doc?.patientInfo?.mrn ? (
                      <span className="font-mono text-sm text-foreground">{doc?.patientInfo?.mrn}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No Patient</span>
                    )}
                    {doc?.patientInfo?.name && (
                      <span className="text-xs text-muted-foreground">{doc?.patientInfo?.name}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Icon name="FileText" size={16} className="mr-2 text-muted-foreground" />
                    <span className="text-sm text-foreground">{doc?.documentType}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{formatDate(doc?.createdDate)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{formatDate(doc?.lastModified)}</span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(doc?.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs text-secondary-foreground font-medium">
                        {doc?.modifiedBy?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{doc?.modifiedBy}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getPriorityIcon(doc?.priority)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onPreview(doc)}>
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Icon name="Download" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {documents?.map((doc) => (
          <div key={doc?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedDocuments?.includes(doc?.id)}
                  onChange={() => onSelectDocument(doc?.id)}
                  className="mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <Icon name="FileText" size={14} className="mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{doc?.title || doc?.documentName}</span>
                  </div>
                  {doc?.patientInfo?.name && (
                    <div className="flex items-center mt-1">
                      <Icon name="User" size={12} className="mr-1 text-blue-500" />
                      <span className="text-xs text-blue-700">{doc?.patientInfo?.name}</span>
                    </div>
                  )}
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">{doc?.documentType}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getPriorityIcon(doc?.priority)}
                {getStatusBadge(doc?.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
              <div>Created: {formatDate(doc?.createdDate)}</div>
              <div>Modified: {formatDate(doc?.lastModified)}</div>
              {doc?.patientInfo?.patientId && (
                <div>Patient ID: {doc?.patientInfo?.patientId}</div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs text-secondary-foreground font-medium">
                    {doc?.modifiedBy?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{doc?.modifiedBy}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => onPreview(doc)}>
                  <Icon name="Eye" size={14} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                  <Icon name="Edit" size={14} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Download" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentTable;