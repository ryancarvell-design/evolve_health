import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickFilters = ({ activeFilter, onFilterChange, isMobile = false }) => {
  const filters = [
    { id: 'recent', label: 'Recent', icon: 'Clock', count: 12 },
    { id: 'drafts', label: 'Drafts', icon: 'FileEdit', count: 8 },
    { id: 'pending', label: 'Pending Review', icon: 'AlertCircle', count: 5 },
    { id: 'approved', label: 'Approved', icon: 'CheckCircle', count: 23 },
    { id: 'urgent', label: 'Urgent', icon: 'AlertTriangle', count: 3 },
    { id: 'this-month', label: 'This Month', icon: 'Calendar', count: 45 }
  ];

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => onFilterChange(filter?.id)}
            className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
              activeFilter === filter?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center min-w-0">
              <Icon name={filter?.icon} size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{filter?.label}</span>
            </div>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 ${
              activeFilter === filter?.id 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {filter?.count}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Filters</h3>
        <div className="space-y-1">
          {filters?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => onFilterChange(filter?.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                activeFilter === filter?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center">
                <Icon name={filter?.icon} size={16} className="mr-3" />
                <span>{filter?.label}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeFilter === filter?.id 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {filter?.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Document Stats</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Total Documents</span>
            <span className="font-medium">96</span>
          </div>
          <div className="flex justify-between">
            <span>Storage Used</span>
            <span className="font-medium">2.4 GB</span>
          </div>
          <div className="flex justify-between">
            <span>This Week</span>
            <span className="font-medium text-success">+12</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button variant="outline" className="w-full text-sm">
          <Icon name="Download" size={14} className="mr-2" />
          Export All
        </Button>
      </div>
    </div>
  );
};

export default QuickFilters;