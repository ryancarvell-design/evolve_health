import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const TemplateHeader = ({ 
  templateName, 
  onTemplateNameChange, 
  onSave, 
  onPreview, 
  onShare, 
  isSaving,
  // Page management props
  pages,
  currentPageIndex,
  onPageChange,
  onAddPage,
  onDeletePage,
  onPageNameChange,
  // Canvas size props
  canvasSize,
  canvasSizes,
  onCanvasSizeChange,
  isMobile,
  isTablet
}) => {
  const [isEditingPageName, setIsEditingPageName] = useState(false);
  const [editingPageIndex, setEditingPageIndex] = useState(-1);
  const [tempPageName, setTempPageName] = useState('');
  const [isEditingTemplateName, setIsEditingTemplateName] = useState(false);

  const handlePageNameEdit = (pageIndex, currentName) => {
    setEditingPageIndex(pageIndex);
    setTempPageName(currentName);
    setIsEditingPageName(true);
  };

  const handlePageNameSave = () => {
    if (tempPageName?.trim()) {
      onPageNameChange(editingPageIndex, tempPageName?.trim());
    }
    setIsEditingPageName(false);
    setEditingPageIndex(-1);
    setTempPageName('');
  };

  const handlePageNameCancel = () => {
    setIsEditingPageName(false);
    setEditingPageIndex(-1);
    setTempPageName('');
  };

  const handleTemplateNameClick = () => {
    setIsEditingTemplateName(true);
  };

  const handleTemplateNameBlur = () => {
    setIsEditingTemplateName(false);
  };

  const handleSaveClick = () => {
    // Add immediate feedback for save button click
    console.log('Save button clicked');
    onSave?.();
  };

  return (
    <div className="bg-card border-b border-border px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between min-h-10">
        {/* Left Section - Template Name */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={handleTemplateNameClick}>
            <Icon name="FileText" size={20} className="text-primary flex-shrink-0" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={templateName}
                onChange={(e) => onTemplateNameChange(e?.target?.value)}
                onBlur={handleTemplateNameBlur}
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') {
                    e?.target?.blur();
                  }
                }}
                className={`text-lg font-semibold bg-transparent border-none outline-none rounded px-2 py-1 transition-all min-w-0 max-w-80 ${
                  isEditingTemplateName 
                    ? 'ring-2 ring-primary/20 bg-background/50' :'hover:bg-muted/30 focus:ring-2 focus:ring-primary/20'
                }`}
                placeholder="Template name..."
              />
              <Icon 
                name="Edit2" 
                size={14} 
                className={`ml-1 transition-opacity flex-shrink-0 ${
                  isEditingTemplateName ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-70 text-muted-foreground'
                }`}
              />
            </div>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Click to edit
            </span>
          </div>
        </div>

        {/* Center Section - Page Controls */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          {/* Page Management */}
          <div className="flex items-center space-x-3">
            {/* Page Tabs */}
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
              {pages?.map((page, index) => (
                <div
                  key={page?.id}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all cursor-pointer group ${
                    index === currentPageIndex 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isEditingPageName && editingPageIndex === index ? (
                    <input
                      type="text"
                      value={tempPageName}
                      onChange={(e) => setTempPageName(e?.target?.value)}
                      onBlur={handlePageNameSave}
                      onKeyDown={(e) => {
                        if (e?.key === 'Enter') handlePageNameSave();
                        if (e?.key === 'Escape') handlePageNameCancel();
                      }}
                      className="bg-transparent border-none outline-none text-sm w-16 text-center"
                      autoFocus
                    />
                  ) : (
                    <>
                      <button
                        onClick={() => onPageChange(index)}
                        onDoubleClick={() => handlePageNameEdit(index, page?.name)}
                        className="text-sm font-medium truncate max-w-20"
                      >
                        {page?.name}
                      </button>
                      
                      {pages?.length > 1 && (
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            onDeletePage(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              
              {/* Add Page Button */}
              <button
                onClick={onAddPage}
                className="p-1.5 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
                title="Add new page"
              >
                <Icon name="Plus" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <Button variant="ghost" size="sm" onClick={onShare} className="whitespace-nowrap">
            <Icon name="Share2" size={16} className="mr-2" />
            Share
          </Button>
          
          <Button variant="outline" size="sm" onClick={onPreview} className="whitespace-nowrap">
            <Icon name="Eye" size={16} className="mr-2" />
            Preview
          </Button>
          
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${isSaving 
                ? 'bg-primary/50 text-primary-foreground cursor-not-allowed opacity-75' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md active:scale-95'
              }
            `}
          >
            {isSaving ? (
              <>
                <Icon name="Loader" size={16} className="animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">Saving</span>
              </>
            ) : (
              <>
                <Icon name="Save" size={16} />
                <span className="hidden sm:inline">Save Template</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper text for template naming */}
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground bg-muted/20 px-3 py-1 rounded-full inline-flex items-center">
          <Icon name="Info" size={12} className="mr-1" />
          Template will be saved as "{templateName}" • Click name to edit
        </div>
        
        {pages?.length > 1 && (
          <div className="text-xs text-muted-foreground bg-muted/20 px-3 py-1 rounded-full inline-flex items-center">
            <Icon name="MousePointer" size={12} className="mr-1" />
            Double-click page names to rename
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateHeader;