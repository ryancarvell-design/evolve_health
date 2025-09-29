import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import ComponentLibrary from './components/ComponentLibrary';
import TemplateCanvas from './components/TemplateCanvas';
import TemplateHeader from './components/TemplateHeader';
import PreviewModal from './components/PreviewModal';
import { saveTemplate } from '../../utils/storage';
import SaveModal from '../../components/ui/SaveModal';
import FormatSelectionModal from '../../components/ui/FormatSelectionModal';
import { useToast, ToastContainer } from '../../components/ui/NotificationToast';
import Icon from '../../components/AppIcon';
import { exportToFormat as exportUtility } from '../../utils/fileExport';

// Add missing function declarations
const validateExportData = (data, type) => {
  const errors = [];
  
  if (!data) {
    errors?.push('No data provided');
    return { isValid: false, errors };
  }
  
  if (!data?.name || data?.name?.trim()?.length === 0) {
    errors?.push('Name is required');
  }
  
  if (type === 'template' && (!data?.elements || data?.elements?.length === 0)) {
    errors?.push('Template must have at least one element');
  }
  
  return {
    isValid: errors?.length === 0,
    errors
  };
};

const TemplateBuilder = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [componentLibraryCollapsed, setComponentLibraryCollapsed] = useState(false);
  const [componentLibraryWidth, setComponentLibraryWidth] = useState(320);
  const [templateName, setTemplateName] = useState("Physical Therapy Assessment");
  
  // Enhanced state for multi-page and canvas size management
  const [pages, setPages] = useState([{
    id: 'page_1',
    name: 'Page 1',
    elements: []
  }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [canvasSize, setCanvasSize] = useState({
    name: 'A4',
    width: '8.27in',
    height: '11.69in',
    pixels: { width: 794, height: 1123 }
  });
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFormatSelectionModal, setShowFormatSelectionModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileComponentLibrary, setShowMobileComponentLibrary] = useState(false);

  // Initialize responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setSidebarCollapsed(width < 1024);

      // Auto-collapse component library on mobile/tablet
      if (mobile) {
        setComponentLibraryCollapsed(true);
        setComponentLibraryWidth(280);
      } else if (tablet) {
        setComponentLibraryCollapsed(false);
        setComponentLibraryWidth(300);
      } else {
        setComponentLibraryCollapsed(false);
        setComponentLibraryWidth(320);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Canvas size options
  const canvasSizes = [
    {
      name: 'A4',
      width: '8.27in',
      height: '11.69in',
      pixels: { width: 794, height: 1123 }
    },
    {
      name: 'Letter',
      width: '8.5in', 
      height: '11in',
      pixels: { width: 816, height: 1056 }
    },
    {
      name: 'Legal',
      width: '8.5in',
      height: '14in', 
      pixels: { width: 816, height: 1344 }
    },
    {
      name: 'Custom',
      width: '10in',
      height: '12in',
      pixels: { width: 960, height: 1152 }
    }
  ];

  // Get current page elements
  const elements = pages?.[currentPageIndex]?.elements || [];

  // Enhanced initial template elements with better positioning
  useEffect(() => {
    const mockElements = [
      {
        id: 'element_1',
        name: 'Section Header',
        type: 'header',
        icon: 'Heading1',
        x: 50,
        y: 50,
        width: isMobile ? 280 : 500,
        height: 50,
        properties: {
          text: 'Patient Information',
          level: 2
        }
      },
      {
        id: 'element_2',
        name: 'Text Field',
        type: 'input',
        icon: 'Type',
        x: 50,
        y: 120,
        width: isMobile ? 280 : 240,
        height: 60,
        properties: {
          label: 'Patient Name',
          placeholder: 'Enter full name...',
          required: true
        }
      },
      {
        id: 'element_3',
        name: 'Date Field',
        type: 'date',
        icon: 'Calendar',
        x: isMobile ? 50 : 310,
        y: isMobile ? 200 : 120,
        width: isMobile ? 280 : 240,
        height: 60,
        properties: {
          label: 'Date of Birth',
          required: true
        }
      }
    ];

    // Initialize first page with mock elements
    setPages([{
      id: 'page_1',
      name: 'Page 1', 
      elements: mockElements
    }]);
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleComponentLibraryToggle = () => {
    if (isMobile) {
      setShowMobileComponentLibrary(!showMobileComponentLibrary);
    } else {
      setComponentLibraryCollapsed(!componentLibraryCollapsed);
    }
  };

  // Page Management Functions
  const handleAddPage = () => {
    const newPageId = `page_${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: `Page ${pages?.length + 1}`,
      elements: []
    };
    
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages?.length);
    addToast(`Added ${newPage?.name}`, 'success');
  };

  const handleDeletePage = (pageIndex) => {
    if (pages?.length <= 1) {
      addToast('Cannot delete the last page', 'error');
      return;
    }

    const deletedPage = pages?.[pageIndex];
    setPages(prev => prev?.filter((_, index) => index !== pageIndex));
    
    // Adjust current page index if needed
    if (currentPageIndex >= pageIndex) {
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    }
    
    addToast(`Deleted ${deletedPage?.name}`, 'success');
  };

  const handlePageNameChange = (pageIndex, newName) => {
    setPages(prev => prev?.map((page, index) => 
      index === pageIndex ? { ...page, name: newName } : page
    ));
  };

  const handleCanvasSizeChange = (newSize) => {
    setCanvasSize(newSize);
    addToast(`Canvas size changed to ${newSize?.name}`, 'success');
  };

  // Resizer functionality for component library (horizontal resizing)
  const handleResizeStart = useCallback((e) => {
    if (isMobile) return; // Disable resizing on mobile
    
    setIsResizing(true);
    e?.preventDefault();

    const startX = e?.clientX;
    const startWidth = componentLibraryWidth;

    const handleMouseMove = (e) => {
      const deltaX = startX - e?.clientX; // Reversed for right-side panel
      const newWidth = Math.max(280, Math.min(500, startWidth + deltaX)); // Min 280px, Max 500px
      setComponentLibraryWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [componentLibraryWidth, isMobile]);

  const handleElementAdd = (element) => {
    // Adjust element positioning for mobile
    const adjustedElement = {
      ...element,
      x: isMobile ? Math.min(element?.x, 50) : element?.x,
      width: isMobile ? Math.min(element?.width, 280) : element?.width
    };

    setPages(prev => prev?.map((page, index) => 
      index === currentPageIndex 
        ? { ...page, elements: [...page?.elements, adjustedElement] }
        : page
    ));
    setSelectedElement(adjustedElement);
    
    // Close mobile component library after adding
    if (isMobile) {
      setShowMobileComponentLibrary(false);
    }
    
    // Show success toast for better UX
    addToast(`Added ${element?.name} to ${pages?.[currentPageIndex]?.name}`, 'success');
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  const handleElementUpdate = (updatedElement) => {
    setPages(prev => prev?.map((page, index) => 
      index === currentPageIndex 
        ? {
            ...page,
            elements: page?.elements?.map(el => 
              el?.id === updatedElement?.id ? updatedElement : el
            )
          }
        : page
    ));
    setSelectedElement(updatedElement);
  };

  const handleElementDelete = (elementId) => {
    const elementToDelete = elements?.find(el => el?.id === elementId);
    setPages(prev => prev?.map((page, index) => 
      index === currentPageIndex 
        ? {
            ...page,
            elements: page?.elements?.filter(el => el?.id !== elementId)
          }
        : page
    ));
    setSelectedElement(null);
    
    // Show success toast for better UX
    if (elementToDelete) {
      addToast(`Removed ${elementToDelete?.name} from template`, 'success');
    }
  };

  const handleDragStart = (component) => {
    // Add visual feedback or state updates if needed
    console.log('Drag started for:', component?.name);
  };

  const handleSave = async (saveData = null) => {
    if (saveData) {
      // Direct save with provided data
      setIsSaving(true);
      
      try {
        // Clean the elements data to prevent circular references
        const cleanElements = elements?.map(element => ({
          id: element?.id,
          name: element?.name,
          type: element?.type,
          icon: element?.icon,
          x: element?.x,
          y: element?.y,
          width: element?.width,
          height: element?.height,
          properties: element?.properties ? {
            ...element?.properties,
            // Remove any potential DOM references
            element: undefined,
            ref: undefined,
            domRef: undefined,
            nativeEvent: undefined,
            currentTarget: undefined,
            target: undefined
          } : {}
        }));

        const templateToSave = {
          ...currentTemplate,
          ...saveData,
          elements: cleanElements,
          templateContent: {
            sections: generateTemplateSections(),
            sampleContent: generateSampleContent()
          }
        };

        const result = await saveTemplate(templateToSave);
        
        if (result?.success) {
          setCurrentTemplate(result?.template);
          setIsSaving(false);
          setShowSaveModal(false);
          
          // Enhanced success message with cleanup info
          let message = result?.message;
          if (result?.cleanup) {
            message += ` (${result?.cleanup?.message})`;
          }
          
          addToast(message, 'success');
          
          // Show storage warning if approaching limit
          if (result?.quotaStatus?.isNearLimit) {
            addToast(
              `Storage is ${result?.quotaStatus?.totalSizeMB?.toFixed(1)}MB. Consider cleaning up old templates.`, 
              'warning'
            );
          }
        } else {
          setIsSaving(false);
          
          // Enhanced error handling for quota exceeded
          if (result?.error?.includes('quota') || result?.error?.includes('Storage')) {
            const storageInfo = result?.quotaStatus;
            if (storageInfo) {
              addToast(
                `${result?.message} (Current storage: ${storageInfo?.totalSizeMB?.toFixed(1)}MB)`, 
                'error'
              );
            } else {
              addToast(result?.message, 'error');
            }
            
            // Optionally show storage management options
            console.warn('Storage quota exceeded. Consider implementing storage management UI.');
          } else if (result?.error?.includes('too large')) {
            addToast(
              'Template is too large. Try reducing the number of elements or simplifying properties.', 
              'error'
            );
          } else {
            addToast(result?.message, 'error');
          }
        }
      } catch (error) {
        setIsSaving(false);
        console.error('Template save error:', error);
        
        if (error?.name === 'QuotaExceededError' || error?.code === 22) {
          addToast(
            'Storage quota exceeded. Please delete old templates or refresh the page and try again.', 
            'error'
          );
        } else {
          addToast('Failed to save template. Please try again.', 'error');
        }
      }
    } else {
      // Show format selection modal first
      setShowFormatSelectionModal(true);
    }
  };

  const handleFormatSelection = async (selectedFormat, formatData, selectedDestination, destinationData) => {
    try {
      // Close format selection modal
      setShowFormatSelectionModal(false);
      
      // Prepare template data for export
      const templateData = {
        ...currentTemplate,
        name: templateName,
        elements: elements?.map(element => ({
          id: element?.id,
          name: element?.name,
          type: element?.type,
          icon: element?.icon,
          x: element?.x,
          y: element?.y,
          width: element?.width,
          height: element?.height,
          properties: element?.properties || {}
        })),
        templateContent: {
          sections: generateTemplateSections(),
          sampleContent: generateSampleContent()
        },
        exportFormat: selectedFormat,
        createdDate: currentTemplate?.createdDate || new Date()?.toISOString(),
        lastModified: new Date()?.toISOString()
      };
      
      // Show loading state
      setIsSaving(true);
      
      if (selectedDestination === 'library') {
        // Save to template library
        addToast(`Saving template to library as ${formatData?.name}...`, 'info');
        
        // Add library-specific metadata
        templateData.savedToLibrary = true;
        templateData.libraryMetadata = {
          format: formatData,
          destination: destinationData,
          savedAt: new Date()?.toISOString()
        };
        
        const saveResult = await saveTemplate(templateData);
        
        if (saveResult?.success) {
          setCurrentTemplate(saveResult?.template);
          setIsSaving(false);
          
          // Enhanced success message with cleanup info
          let message = `Template saved to library as ${formatData?.name}`;
          if (saveResult?.cleanup) {
            message += ` (${saveResult?.cleanup?.message})`;
          }
          
          addToast(message, 'success');
          
          // Show storage warning if approaching limit
          if (saveResult?.quotaStatus?.isNearLimit) {
            addToast(
              `Storage is ${saveResult?.quotaStatus?.totalSizeMB?.toFixed(1)}MB. Consider cleaning up old templates.`, 
              'warning'
            );
          }
        } else {
          setIsSaving(false);
          
          // Enhanced error handling for quota exceeded
          if (saveResult?.error?.includes('quota') || saveResult?.error?.includes('Storage')) {
            const storageInfo = saveResult?.quotaStatus;
            if (storageInfo) {
              addToast(
                `${saveResult?.message} (Current storage: ${storageInfo?.totalSizeMB?.toFixed(1)}MB)`, 
                'error'
              );
            } else {
              addToast(saveResult?.message, 'error');
            }
            
            // Optionally show storage management options
            console.warn('Storage quota exceeded. Consider implementing storage management UI.');
          } else if (saveResult?.error?.includes('too large')) {
            addToast(
              'Template is too large. Try reducing the number of elements or simplifying properties.', 
              'error'
            );
          } else {
            addToast(saveResult?.message || 'Failed to save to template library', 'error');
          }
        }
      } else {
        // Download to browse files - USE THE PROPER EXPORT UTILITY
        addToast(`Preparing ${formatData?.name} download...`, 'info');
        
        // First save to internal storage if it's new or has changes
        if (!currentTemplate?.id) {
          const saveResult = await saveTemplate(templateData);
          
          if (saveResult?.success) {
            setCurrentTemplate(saveResult?.template);
            
            // Use the saved template data for export
            templateData.id = saveResult?.template?.id;
            templateData.createdDate = saveResult?.template?.createdDate;
            templateData.lastModified = saveResult?.template?.lastModified;
            templateData.createdBy = saveResult?.template?.createdBy;
            templateData.modifiedBy = saveResult?.template?.modifiedBy;
            templateData.version = saveResult?.template?.version;
            
            addToast('Template saved successfully!', 'success');
          } else {
            setIsSaving(false);
            addToast('Failed to save template before download. Please try again.', 'error');
            return;
          }
        }
        
        // Export in the selected format using the proper utility
        const exportResult = await exportUtility(templateData, selectedFormat, 'template');
        
        if (exportResult?.success) {
          setIsSaving(false);
          addToast(exportResult?.message, 'success');
        } else {
          setIsSaving(false);
          addToast(exportResult?.message, 'error');
        }
      }
      
    } catch (error) {
      console.error('Format selection error:', error);
      addToast('Failed to process save request. Please try again.', 'error');
      setShowFormatSelectionModal(false);
      setIsSaving(false);
    }
  };

  // Generate template sections from elements
  const generateTemplateSections = () => {
    // Group elements by sections or create a generic structure
    const sections = [];
    
    if (elements?.length === 0) {
      return [{
        title: 'General Information',
        fields: [
          { label: 'Title', type: 'text', placeholder: 'Enter title', required: true },
          { label: 'Description', type: 'textarea', placeholder: 'Enter description' }
        ]
      }];
    }
    
    // Convert elements to template sections
    const currentSection = {
      title: 'Template Fields',
      fields: elements?.map(element => ({
        label: element?.properties?.label || element?.name || 'Field',
        type: mapElementTypeToFieldType(element?.type),
        placeholder: element?.properties?.placeholder || `Enter ${element?.name?.toLowerCase()}`,
        required: element?.properties?.required || false,
        options: element?.properties?.options || []
      }))
    };
    
    sections?.push(currentSection);
    return sections;
  };

  // Map element types to field types
  const mapElementTypeToFieldType = (elementType) => {
    const typeMap = {
      'input': 'text',
      'textarea': 'textarea',
      'select': 'select',
      'checkbox': 'checkbox',
      'radio': 'radio',
      'date': 'date',
      'number': 'number',
      'email': 'email',
      'phone': 'tel'
    };
    return typeMap?.[elementType] || 'text';
  };

  // Generate sample content
  const generateSampleContent = () => {
    return `TEMPLATE: ${templateName}

Created: ${new Date()?.toLocaleDateString()}

This is a sample document generated from the "${templateName}" template.

${elements?.map((element, index) => 
  `${index + 1}. ${element?.properties?.label || element?.name}: [${element?.properties?.placeholder || 'Enter information'}]`
)?.join('\n')}

---

Template created with ${elements?.length} field${elements?.length !== 1 ? 's' : ''}
Generated by Template Builder`;
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleShare = () => {
    // Mock share functionality
    alert('Share functionality would open sharing options');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <TemplateHeader
          templateName={templateName}
          onTemplateNameChange={setTemplateName}
          onSave={handleSave}
          onPreview={handlePreview}
          onShare={handleShare}
          isSaving={isSaving}
          // Page management props
          pages={pages}
          currentPageIndex={currentPageIndex}
          onPageChange={setCurrentPageIndex}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onPageNameChange={handlePageNameChange}
          // Canvas size props
          canvasSize={canvasSize}
          canvasSizes={canvasSizes}
          onCanvasSizeChange={handleCanvasSizeChange}
          // Mobile props
          isMobile={isMobile}
          isTablet={isTablet}
        />
        
        <div className="p-3 sm:p-6">
          {/* Main workspace - Responsive layout */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} min-h-[calc(100vh-200px)] bg-card rounded-lg shadow-clinical overflow-hidden`}>
            {/* Template Canvas Section */}
            <div className={`${isMobile ? 'order-2' : 'order-1'} flex-1 min-w-0`}>
              <TemplateCanvas
                elements={elements}
                onElementAdd={handleElementAdd}
                onElementSelect={handleElementSelect}
                onElementUpdate={handleElementUpdate}
                onElementDelete={handleElementDelete}
                selectedElement={selectedElement}
                canvasSize={canvasSize}
                currentPage={pages?.[currentPageIndex]}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            </div>
            
            {/* Desktop: Resizer Bar for Component Library */}
            {!isMobile && !componentLibraryCollapsed && (
              <div
                className={`w-1 bg-border hover:bg-primary/20 cursor-ew-resize transition-colors duration-200 flex-shrink-0 ${
                  isResizing ? 'bg-primary/20' : ''
                } relative group order-2`}
                onMouseDown={handleResizeStart}
              >
                <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
                  <div className="h-8 w-0.5 bg-muted-foreground/40 group-hover:bg-primary/60 transition-colors duration-200 rounded-full" />
                </div>
              </div>
            )}
            
            {/* Desktop: Component Library Section */}
            {!isMobile && (
              <div 
                className={`${
                  componentLibraryCollapsed ? 'w-12' : ''
                } border-l border-border transition-all duration-300 flex-shrink-0 order-3`}
                style={!componentLibraryCollapsed ? { width: `${componentLibraryWidth}px` } : {}}
              >
                <ComponentLibrary 
                  onDragStart={handleDragStart}
                  onElementAdd={handleElementAdd}
                  isCollapsed={componentLibraryCollapsed}
                  onToggle={handleComponentLibraryToggle}
                  orientation="vertical"
                  isMobile={false}
                  isTablet={isTablet}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Component Library Bottom Sheet */}
      {isMobile && showMobileComponentLibrary && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setShowMobileComponentLibrary(false)} 
          />
          <div className="relative bg-white rounded-t-lg shadow-xl w-full max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Components</h3>
              <button
                onClick={() => setShowMobileComponentLibrary(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="overflow-auto">
              <ComponentLibrary 
                onDragStart={handleDragStart}
                onElementAdd={handleElementAdd}
                isCollapsed={false}
                onToggle={() => {}}
                orientation="horizontal"
                isMobile={true}
                isTablet={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <button
          onClick={handleComponentLibraryToggle}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 z-40"
        >
          <Icon name="Plus" size={24} />
        </button>
      )}
      
      {/* Enhanced Save Modal */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        type="template"
        initialData={{
          id: currentTemplate?.id,
          name: templateName,
          category: 'general',
          description: '',
          status: currentTemplate?.status,
          tags: currentTemplate?.tags || [],
          isPublic: currentTemplate?.isPublic || false
        }}
        isLoading={isSaving}
        isMobile={isMobile}
      />
      
      {/* Format Selection Modal */}
      <FormatSelectionModal
        isOpen={showFormatSelectionModal}
        onClose={() => setShowFormatSelectionModal(false)}
        onSelectFormat={handleFormatSelection}
        type="template"
        documentTitle={templateName}
        isMobile={isMobile}
      />
      
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pages={pages}
        templateName={templateName}
        canvasSize={canvasSize}
        isMobile={isMobile}
      />
      
      {/* Add Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default TemplateBuilder;