import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsToolbar = ({ selectedCount, onBulkAction }) => {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} member{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction('update_permissions')}
            className="flex items-center gap-2"
          >
            <Icon name="Key" size={16} />
            Update Permissions
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction('renew_licenses')}
            className="flex items-center gap-2"
          >
            <Icon name="Shield" size={16} />
            Renew Licenses
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction('send_communication')}
            className="flex items-center gap-2"
          >
            <Icon name="Mail" size={16} />
            Send Communication
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction('export_data')}
            className="flex items-center gap-2"
          >
            <Icon name="Download" size={16} />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;