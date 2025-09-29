import React, { useState } from 'react';
        import Button from '../../../components/ui/Button';
        import Icon from '../../../components/AppIcon';

        const BulkActionsToolbar = ({ selectedCount, onBulkAction, permissions }) => {
          const [isLoading, setIsLoading] = useState(false);

          const handleAction = async (action) => {
            setIsLoading(true);
            try {
              await onBulkAction?.(action);
            } finally {
              setIsLoading(false);
            }
          };

          const actions = [
            {
              id: 'export',
              label: 'Export',
              icon: 'Download',
              variant: 'outline',
              show: true
            },
            {
              id: 'archive',
              label: 'Archive',
              icon: 'Archive',
              variant: 'outline',
              show: permissions?.canEdit
            },
            {
              id: 'delete',
              label: 'Delete',
              icon: 'Trash2',
              variant: 'destructive',
              show: permissions?.canDelete
            }
          ];

          return (
            <div className="bg-card rounded-lg shadow-clinical border border-border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckSquare" size={20} className="text-primary" />
                  <span className="font-medium text-foreground">
                    {selectedCount} patient{selectedCount !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {actions?.filter(action => action?.show)?.map((action) => (
                    <Button
                      key={action?.id}
                      variant={action?.variant}
                      size="sm"
                      onClick={() => handleAction(action?.id)}
                      disabled={isLoading}
                      className="flex items-center"
                    >
                      <Icon 
                        name={isLoading ? "Loader2" : action?.icon} 
                        size={16} 
                        className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                      />
                      {action?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          );
        };

        export default BulkActionsToolbar;