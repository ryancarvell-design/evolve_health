import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewModal = ({ isOpen, onClose, pages, templateName, canvasSize }) => {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  
  if (!isOpen) return null;

  // Enhanced element positioning for accurate preview
  const renderPreviewElement = (element, pageIndex) => {
    // Calculate scaling for accurate positioning
    const scaleX = 1; // Keep 1:1 scale for accurate preview
    const scaleY = 1;
    
    const elementStyle = {
      position: 'absolute',
      left: element?.x * scaleX,
      top: element?.y * scaleY,
      width: element?.width * scaleX,
      height: element?.height * scaleY,
      zIndex: 1
    };

    const renderElementContent = () => {
      switch (element?.type) {
        case 'input': case'email': case'phone':
          return (
            <div className="h-full flex flex-col justify-center">
              <label className="block text-xs font-medium text-foreground mb-1">
                {element?.properties?.label}
                {element?.properties?.required && <span className="text-error ml-1">*</span>}
              </label>
              <input
                type={element?.type === 'input' ? 'text' : element?.type}
                placeholder={element?.properties?.placeholder}
                className="flex-1 px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                style={{ fontSize: '10px' }}
              />
            </div>
          );

        case 'textarea':
          return (
            <div className="h-full flex flex-col">
              <label className="block text-xs font-medium text-foreground mb-1">
                {element?.properties?.label}
                {element?.properties?.required && <span className="text-error ml-1">*</span>}
              </label>
              <textarea
                placeholder={element?.properties?.placeholder}
                rows={Math.max(1, Math.floor(element?.height / 20) - 1)}
                className="flex-1 px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent resize-none"
                style={{ fontSize: '10px' }}
              />
            </div>
          );

        case 'header':
          const HeaderTag = `h${element?.properties?.level || 2}`;
          return (
            <div className="h-full flex items-center">
              <HeaderTag className={`font-semibold text-foreground border-b border-border pb-1 flex-1 ${
                element?.properties?.level === 1 ? 'text-lg' :
                element?.properties?.level === 2 ? 'text-base' :
                element?.properties?.level === 3 ? 'text-sm' : 'text-xs'
              }`}>
                {element?.properties?.text}
              </HeaderTag>
            </div>
          );

        case 'checkbox':
          return (
            <div className="h-full flex items-center">
              <input
                type="checkbox"
                defaultChecked={element?.properties?.checked}
                className="mr-2 rounded border-border text-primary focus:ring-primary scale-75"
              />
              <label className="text-xs text-foreground">{element?.properties?.label}</label>
            </div>
          );

        case 'date':
          return (
            <div className="h-full flex flex-col justify-center">
              <label className="block text-xs font-medium text-foreground mb-1">
                {element?.properties?.label}
                {element?.properties?.required && <span className="text-error ml-1">*</span>}
              </label>
              <input
                type="date"
                className="flex-1 px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                style={{ fontSize: '10px' }}
              />
            </div>
          );

        case 'number':
          return (
            <div className="h-full flex flex-col justify-center">
              <label className="block text-xs font-medium text-foreground mb-1">
                {element?.properties?.label}
                {element?.properties?.required && <span className="text-error ml-1">*</span>}
              </label>
              <input
                type="number"
                min={element?.properties?.min}
                max={element?.properties?.max}
                className="flex-1 px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                style={{ fontSize: '10px' }}
              />
            </div>
          );

        // Add more element types as needed...
        default:
          return (
            <div className="h-full flex items-center justify-center bg-muted/20 rounded border border-dashed border-muted-foreground">
              <div className="text-center">
                <Icon name={element?.icon || 'Square'} size={14} className="text-muted-foreground mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">{element?.name}</span>
              </div>
            </div>
          );
      }
    };

    return (
      <div
        key={element?.id}
        className="absolute"
        style={elementStyle}
      >
        {renderElementContent()}
      </div>
    );
  };

  const renderPage = (page, pageIndex) => {
    return (
      <div
        key={page?.id}
        className="relative bg-white shadow-clinical rounded-lg mx-auto overflow-hidden"
        style={{ 
          width: canvasSize?.width,
          minHeight: canvasSize?.height,
          transform: 'scale(0.8)', // Slightly scale down for better preview view
          transformOrigin: 'top center'
        }}
      >
        {/* Page Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-0" />
        
        {/* Page Content with Accurate Positioning */}
        <div className="relative w-full h-full">
          {page?.elements?.map(element => renderPreviewElement(element, pageIndex))}
          
          {page?.elements?.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Empty page</p>
              </div>
            </div>
          )}
        </div>

        {/* Page Footer */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
            {page?.name} • {page?.elements?.length} elements
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-clinical-lg max-w-6xl w-full max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Eye" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Template Preview</h2>
            <span className="text-sm text-muted-foreground">• {templateName}</span>
            <span className="text-sm text-muted-foreground">• {canvasSize?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Page Navigation */}
            {pages?.length > 1 && (
              <div className="flex items-center space-x-2 border-r border-border pr-4 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPreviewPage(Math.max(0, currentPreviewPage - 1))}
                  disabled={currentPreviewPage === 0}
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                <span className="text-sm text-muted-foreground min-w-20 text-center">
                  Page {currentPreviewPage + 1} of {pages?.length}
                </span>
                
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentPreviewPage(Math.min(pages?.length - 1, currentPreviewPage + 1))}
                  disabled={currentPreviewPage === pages?.length - 1}
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            )}
            
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Export PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Modal Content with Accurate Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center space-y-8">
            {/* Single Page View */}
            {pages?.length > 0 && renderPage(pages?.[currentPreviewPage], currentPreviewPage)}
            
            {/* Page Tabs for Multi-page */}
            {pages?.length > 1 && (
              <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-2">
                {pages?.map((page, index) => (
                  <button
                    key={page?.id}
                    onClick={() => setCurrentPreviewPage(index)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      index === currentPreviewPage
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {page?.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {pages?.reduce((total, page) => total + (page?.elements?.length || 0), 0)} total elements • 
            {pages?.length} page{pages?.length !== 1 ? 's' : ''} • 
            Canvas: {canvasSize?.name} ({canvasSize?.width} × {canvasSize?.height}) • 
            Last modified: {new Date()?.toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button variant="default">
              <Icon name="Save" size={16} className="mr-2" />
              Save & Use Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;