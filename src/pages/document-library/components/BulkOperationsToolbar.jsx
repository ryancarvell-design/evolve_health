import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkOperationsToolbar = ({ selectedCount, onExport, onArchive, onShare, onDelete, onClearSelection }) => {
  const [showMobileActions, setShowMobileActions] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-16 lg:top-20 z-30 bg-primary border border-primary-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-clinical">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary-foreground">
          <Icon name="CheckSquare" size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm sm:text-base font-medium">
            {selectedCount} {selectedCount === 1 ? 'document' : 'documents'} selected
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExport}
            className="text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/20"
          >
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onShare}
            className="text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/20"
          >
            <Icon name="Share" size={16} className="mr-2" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onArchive}
            className="text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/20"
          >
            <Icon name="Archive" size={16} className="mr-2" />
            Archive
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-primary-foreground hover:bg-error/10 border-error/20"
          >
            <Icon name="Trash2" size={16} className="mr-2" />
            Delete
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearSelection}
            className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
          >
            Clear
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowMobileActions(!showMobileActions)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Icon name="MoreVertical" size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearSelection}
            className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>

      {/* Mobile Actions Dropdown */}
      {showMobileActions && (
        <div className="sm:hidden mt-3 pt-3 border-t border-primary-foreground/20">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExport}
              className="text-primary-foreground hover:bg-primary-foreground/10 justify-start"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onShare}
              className="text-primary-foreground hover:bg-primary-foreground/10 justify-start"
            >
              <Icon name="Share" size={16} className="mr-2" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onArchive}
              className="text-primary-foreground hover:bg-primary-foreground/10 justify-start"
            >
              <Icon name="Archive" size={16} className="mr-2" />
              Archive
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-primary-foreground hover:bg-error/10 justify-start"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperationsToolbar;