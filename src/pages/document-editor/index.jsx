import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import DocumentHeader from './components/DocumentHeader';
import EditorToolbar from './components/EditorToolbar';
import RichTextEditor from './components/RichTextEditor';
import AIAssistantPanel from './components/AIAssistantPanel';
import CollaborationPanel from './components/CollaborationPanel';
import VoiceTranscriptionPanel from './components/VoiceTranscriptionPanel';
import DocumentComponentLibrary from './components/DocumentComponentLibrary';
import Icon from '../../components/AppIcon';
import { useToast, ToastContainer } from '../../components/ui/NotificationToast';
import { AutoSave } from '../../components/ui/AutoSave';
import SaveModal from '../../components/ui/SaveModal';
import FormatSelectionModal from '../../components/ui/FormatSelectionModal';
import { saveDocument as saveDocumentToStorage } from '../../utils/storage';
import { exportToFormat } from '../../utils/fileExport';
import { initializePatientStorage } from '../../utils/patientRegistry';

const DocumentEditor = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('New Document');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isAIVisible, setIsAIVisible] = useState(false);
  const [isCollaborationVisible, setIsCollaborationVisible] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isComponentLibraryVisible, setIsComponentLibraryVisible] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [loadedTemplate, setLoadedTemplate] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Add new state for save functionality
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFormatSelectionModal, setShowFormatSelectionModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobilePanels, setShowMobilePanels] = useState(false);

  // Add state to track if sidebar protection is needed
  const [sidebarProtectionActive, setSidebarProtectionActive] = useState(true);

  // Initialize responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setSidebarCollapsed(width < 1024);

      // Auto-adjust zoom for mobile
      if (mobile) {
        setZoomLevel(60);
      } else if (tablet) {
        setZoomLevel(80);
      } else if (zoomLevel < 100) {
        setZoomLevel(100);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Add useEffect to ensure sidebar area is always clickable
  useEffect(() => {
    const protectSidebarArea = () => {
      // Create or update sidebar protection zone
      let protectionZone = document.getElementById('sidebar-protection-zone');
      
      if (!protectionZone) {
        protectionZone = document.createElement('div');
        protectionZone.id = 'sidebar-protection-zone';
        document.body?.appendChild(protectionZone);
      }

      // Style the protection zone
      protectionZone.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${sidebarCollapsed ? '64px' : '240px'};
        height: 100vh;
        z-index: 10000;
        pointer-events: none;
        background: transparent;
        transition: width 0.2s ease;
      `;

      // Only allow pointer events for sidebar elements
      const sidebarElements = protectionZone?.querySelectorAll('*');
      sidebarElements?.forEach(el => {
        el.style.pointerEvents = 'auto';
      });
    };

    if (sidebarProtectionActive) {
      protectSidebarArea();
      // Update on resize
      window.addEventListener('resize', protectSidebarArea);
      return () => {
        window.removeEventListener('resize', protectSidebarArea);
        let protectionZone = document.getElementById('sidebar-protection-zone');
        if (protectionZone) {
          protectionZone?.remove();
        }
      };
    }
  }, [sidebarCollapsed, sidebarProtectionActive]);

  // Initialize patient storage on component mount
  useEffect(() => {
    initializePatientStorage();
  }, []);

  // Define handleAutoSave function before using it
  const handleAutoSave = async (data, isAutoSave) => {
    if (!currentDocument?.id || saveStatus === 'saving') return;
    
    try {
      const documentToSave = {
        ...currentDocument,
        content: documentContent,
        lastModified: new Date()?.toISOString()
      };

      const result = await saveDocument(documentToSave);
      
      if (result?.success) {
        setCurrentDocument(result?.document);
        setSaveStatus('saved');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Define saveDocument function with patient registry integration
  const saveDocument = async (document) => {
    try {
      const result = await saveDocumentToStorage(document);
      
      // Show detailed success message with patient registry status
      if (result?.success && result?.patientUpdate?.success) {
        console.log('Document saved and patient registry updated:', {
          document: result?.document,
          patientUpdate: result?.patientUpdate
        });
      } else if (result?.success && result?.patientUpdate?.patientNotFound) {
        console.log('Document saved, but patient not found in registry:', result?.patientUpdate);
      }
      
      return result;
    } catch (error) {
      console.error('Save document error:', error);
      return {
        success: false,
        error: error?.message,
        message: 'Failed to save document. Please try again.'
      };
    }
  };

  // Define incrementTemplateUsage function
  const incrementTemplateUsage = async (templateId) => {
    // Mock implementation - replace with actual API call
    try {
      console.log('Incrementing usage for template:', templateId);
      // API call would go here
    } catch (error) {
      console.error('Failed to increment template usage:', error);
    }
  };

  // Initialize AutoSave instance with proper error handling
  const [autoSave] = useState(() => {
    try {
      return new AutoSave(handleAutoSave, 30000);
    } catch (error) {
      console.error('Failed to initialize AutoSave:', error);
      return null;
    }
  });

  // Cleanup AutoSave on component unmount
  useEffect(() => {
    return () => {
      if (autoSave) {
        autoSave?.destroy();
      }
    };
  }, [autoSave]);

  // Load template OR document from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location?.search);
    const templateParam = urlParams?.get('template');
    const documentParam = urlParams?.get('document');
    
    // Load existing document for editing
    if (documentParam) {
      try {
        const documentData = JSON.parse(decodeURIComponent(documentParam));
        setCurrentDocument(documentData);
        setDocumentTitle(documentData?.title || documentData?.documentName || 'Untitled Document');
        setDocumentContent(documentData?.content || '');
        
        // Set patient info if available
        if (documentData?.patientInfo) {
          const patientData = {
            id: documentData?.patientInfo?.id || documentData?.patientInfo?.patientId,
            firstName: documentData?.patientInfo?.name?.split(' ')?.[0] || '',
            lastName: documentData?.patientInfo?.name?.split(' ')?.slice(1)?.join(' ') || '',
            dateOfBirth: documentData?.patientInfo?.dob,
            mrn: documentData?.patientInfo?.mrn,
            patientId: documentData?.patientInfo?.patientId || documentData?.patientInfo?.id
          };
          setSelectedPatient(patientData);
        }
        
        // Set template reference if document was created from template
        if (documentData?.templateId && documentData?.templateName) {
          setLoadedTemplate({
            id: documentData?.templateId,
            name: documentData?.templateName
          });
        }
        
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error loading document:', error);
        addToast('Failed to load document for editing', 'error');
      }
    } 
    // Load template for new document creation
    else if (templateParam) {
      try {
        const templateData = JSON.parse(decodeURIComponent(templateParam));
        setLoadedTemplate(templateData);
        setDocumentTitle(`${templateData?.name} - New Document`);
        
        // Load template content
        if (templateData?.sampleContent) {
          setDocumentContent(templateData?.sampleContent);
        } else if (templateData?.content?.sections) {
          // Generate structured content from template sections
          const structuredContent = generateStructuredContent(templateData?.content?.sections);
          setDocumentContent(structuredContent);
        }
        
        setSaveStatus('unsaved');
      } catch (error) {
        console.error('Error loading template:', error);
        addToast('Failed to load template', 'error');
      }
    }
  }, [location?.search, addToast]);

  const generateStructuredContent = (sections) => {
    let content = `# ${loadedTemplate?.name || 'New Document'}\n\n`;
    content += `*Created from template: ${loadedTemplate?.name}*\n`;
    content += `*Date: ${new Date()?.toLocaleDateString()}*\n\n`;
    
    sections?.forEach(section => {
      content += `## ${section?.title}\n\n`;
      
      section?.fields?.forEach(field => {
        if (field?.type === 'textarea') {
          content += `**${field?.label}${field?.required ? ' *' : ''}:**\n`;
          content += `${field?.placeholder || '[Enter information here]'}\n\n`;
        } else if (field?.type === 'select') {
          content += `**${field?.label}${field?.required ? ' *' : ''}:**\n`;
          content += `[ ] ${field?.options?.join('\n[ ] ') || '[Select option]'}\n\n`;
        } else {
          content += `**${field?.label}${field?.required ? ' *' : ''}:** ${field?.placeholder || '[Enter information]'}\n\n`;
        }
      });
      
      content += '---\n\n';
    });
    
    return content;
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTitleChange = (newTitle) => {
    setDocumentTitle(newTitle);
    setSaveStatus('unsaved');
  };

  const handlePatientChange = (patient) => {
    setSelectedPatient(patient);
    setSaveStatus('unsaved');
  };

  const handleSave = async (saveData = null, isAutoSave = false) => {
    if (saveData) {
      // Direct save with provided data including patient metadata
      setSaveStatus('saving');
      
      try {
        const documentToSave = {
          ...currentDocument,
          ...saveData,
          content: documentContent,
          templateId: loadedTemplate?.id || null,
          templateName: loadedTemplate?.name || null,
          // Add patient metadata to document
          patientInfo: selectedPatient ? {
            id: selectedPatient?.id,
            name: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
            dob: selectedPatient?.dateOfBirth,
            mrn: selectedPatient?.mrn,
            patientId: selectedPatient?.patientId,
            selectedAt: new Date()?.toISOString()
          } : null
        };

        const result = await saveDocument(documentToSave);
        
        if (result?.success) {
          setCurrentDocument(result?.document);
          setSaveStatus('saved');
          setShowSaveModal(false);
          
          // Enhanced success messaging with patient registry status
          if (!isAutoSave) {
            let successMessage = result?.message;
            
            if (result?.patientUpdate?.success) {
              if (result?.patientUpdate?.documentAdded) {
                successMessage += ` Document added to ${selectedPatient?.firstName} ${selectedPatient?.lastName}'s record.`;
              } else if (result?.patientUpdate?.documentUpdated) {
                successMessage += ` Patient record updated for ${selectedPatient?.firstName} ${selectedPatient?.lastName}.`;
              }
            } else if (result?.patientUpdate?.patientNotFound && selectedPatient) {
              successMessage += `. Note: Patient not found in registry.`;
            }
            
            addToast(successMessage, 'success');
          }
          
          // Update template usage count if created from template
          if (loadedTemplate?.id && result?.isNewDocument) {
            incrementTemplateUsage(loadedTemplate?.id);
          }
        } else {
          setSaveStatus('unsaved');
          addToast(result?.message, 'error');
        }
      } catch (error) {
        setSaveStatus('unsaved');
        addToast('Failed to save document. Please try again.', 'error');
      }
    } else {
      // Show format selection modal first
      setShowFormatSelectionModal(true);
    }
  };

  // Add format selection modal handler
  const handleFormatSelectionModalOpen = () => {
    setShowFormatSelectionModal(true);
  };

  // Add format selection handler
  const handleFormatSelection = async (selectedFormat, formatData, selectedDestination, destinationData) => {
    try {
      // Close format selection modal
      setShowFormatSelectionModal(false);
      
      // Prepare document data for export - Updated structure to match utility expectations
      const documentData = {
        title: documentTitle || 'Untitled Document',
        documentName: documentTitle || 'Untitled Document',
        name: documentTitle || 'Untitled Document',
        content: documentContent || '',
        documentType: loadedTemplate?.category || 'General Document',
        status: currentDocument?.status || 'Draft',
        priority: currentDocument?.priority || 'Normal',
        createdDate: currentDocument?.createdDate || new Date()?.toISOString(),
        createdBy: currentDocument?.createdBy || 'Current User',
        lastModified: new Date()?.toISOString(),
        modifiedBy: 'Current User',
        version: currentDocument?.version || 1,
        tags: currentDocument?.tags || [],
        metadata: {
          wordCount: getWordCount(documentContent),
          characterCount: getCharacterCount(documentContent)
        },
        // Include patient metadata if selected
        patientInfo: selectedPatient ? {
          id: selectedPatient?.id,
          name: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
          dob: selectedPatient?.dateOfBirth,
          mrn: selectedPatient?.mrn,
          patientId: selectedPatient?.patientId
        } : null,
        // Template information
        templateId: loadedTemplate?.id,
        templateName: loadedTemplate?.name,
        templateCategory: loadedTemplate?.category
      };
      
      // Show loading state
      setSaveStatus('saving');
      
      if (selectedDestination === 'library') {
        // Save to document library
        addToast(`Saving ${formatData?.name} to document library...`, 'info');
        
        // First save the document with library metadata
        const documentToSave = {
          ...currentDocument,
          ...documentData,
          templateId: loadedTemplate?.id || null,
          templateName: loadedTemplate?.name || null,
          exportFormat: selectedFormat,
          savedToLibrary: true,
          libraryMetadata: {
            format: formatData,
            destination: destinationData,
            savedAt: new Date()?.toISOString()
          }
        };

        const saveResult = await saveDocument(documentToSave);
        
        if (saveResult?.success) {
          setCurrentDocument(saveResult?.document);
          setSaveStatus('saved');
          
          // Enhanced success messaging for library save
          let successMessage = `Document saved to library as ${formatData?.name}`;
          
          if (saveResult?.patientUpdate?.success) {
            if (saveResult?.patientUpdate?.documentAdded) {
              successMessage += ` and added to ${selectedPatient?.firstName} ${selectedPatient?.lastName}'s record.`;
            } else if (saveResult?.patientUpdate?.documentUpdated) {
              successMessage += ` and patient record updated for ${selectedPatient?.firstName} ${selectedPatient?.lastName}.`;
            }
          } else if (saveResult?.patientUpdate?.patientNotFound && selectedPatient) {
            successMessage += `. Note: Patient not found in registry.`;
          }
          
          addToast(successMessage, 'success');
          
          // Update template usage count if created from template
          if (loadedTemplate?.id && saveResult?.isNewDocument) {
            incrementTemplateUsage(loadedTemplate?.id);
          }
        } else {
          setSaveStatus('unsaved');
          addToast(saveResult?.message || 'Failed to save to document library', 'error');
        }
      } else {
        // Download to browse files - Use the proper utility function
        addToast(`Preparing ${formatData?.name} download...`, 'info');
        
        // Use the imported exportToFormat function from fileExport utility
        const exportResult = await exportToFormat(documentData, selectedFormat, 'document');
        
        if (exportResult?.success) {
          setSaveStatus('saved');
          addToast(exportResult?.message, 'success');
          
          // Also save to internal storage for backup if document doesn't exist
          if (!currentDocument?.id) {
            try {
              await handleSave({
                ...documentData,
                downloadedAs: selectedFormat,
                downloadedAt: new Date()?.toISOString()
              });
            } catch (storageError) {
              console.warn('Failed to save backup to storage:', storageError);
            }
          }
        } else {
          setSaveStatus('unsaved');
          addToast(exportResult?.message || `Failed to export as ${formatData?.name}`, 'error');
        }
      }
      
    } catch (error) {
      console.error('Format selection error:', error);
      setSaveStatus('unsaved');
      addToast('Failed to process save request. Please try again.', 'error');
      setShowFormatSelectionModal(false);
    }
  };

  // Helper functions for word and character count
  const getWordCount = (content) => {
    if (!content) return 0;
    return content?.trim()?.split(/\s+/)?.filter(word => word?.length > 0)?.length;
  };

  const getCharacterCount = (content) => {
    return content ? content?.length : 0;
  };

  const handleDocumentTypeChange = () => {
    // Placeholder for document type change functionality
  };

  const handleToggleComponentLibrary = () => {
    setIsComponentLibraryVisible(!isComponentLibraryVisible);
  };

  const handleElementInsert = (elementText) => {
    // Insert element into the rich text editor
    if (window?.documentEditorInsertElement) {
      window?.documentEditorInsertElement(elementText);
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const handleToggleAI = () => {
    if (isMobile || isTablet) {
      setShowMobilePanels(!showMobilePanels);
    }
    setIsAIVisible(!isAIVisible);
  };

  const handleToggleCollaboration = () => {
    if (isMobile || isTablet) {
      setShowMobilePanels(!showMobilePanels);
    }
    setIsCollaborationVisible(!isCollaborationVisible);
  };

  const handleContentChange = (content, metadata) => {
    setDocumentContent(content);
    setSaveStatus('unsaved');
    
    // Handle metadata updates for patient and document type
    if (metadata?.patientInfo) {
      setSelectedPatient(metadata?.patientInfo);
    }
    
    // Schedule auto-save if document exists and autoSave is available
    if (currentDocument?.id && autoSave) {
      autoSave?.schedule({ content, metadata });
    }
  };

  const handleSelectionChange = (selectedText) => {
    console.log('Text selected:', selectedText);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    if (isMobile) {
      setZoomLevel(60);
    } else if (isTablet) {
      setZoomLevel(80);
    } else {
      setZoomLevel(100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 document-editor-container">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      <main 
        className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}
        style={{
          // Remove problematic event handlers and use CSS isolation instead
          isolation: 'isolate',
          position: 'relative'
        }}
      >
        {/* Document Header - Add isolation wrapper */}
        <div style={{ isolation: 'isolate', position: 'relative', zIndex: 1 }}>
          <DocumentHeader
            documentTitle={documentTitle}
            onTitleChange={handleTitleChange}
            saveStatus={saveStatus}
            onSave={handleSave}
            onFormatSelectionModalOpen={handleFormatSelectionModalOpen}
            onToggleAI={handleToggleAI}
            onToggleCollaboration={handleToggleCollaboration}
            isAIVisible={isAIVisible}
            isCollaborationVisible={isCollaborationVisible}
            templateInfo={loadedTemplate}
            onPatientChange={handlePatientChange}
            onDocumentTypeChange={handleDocumentTypeChange}
            onVoiceToggle={handleVoiceToggle}
            isVoiceActive={isVoiceActive}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </div>

        {/* Editor Toolbar - Add isolation wrapper */}
        <div style={{ isolation: 'isolate', position: 'relative', zIndex: 1 }}>
          <EditorToolbar
            onVoiceToggle={handleVoiceToggle}
            isVoiceActive={isVoiceActive}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onToggleComponentLibrary={handleToggleComponentLibrary}
            isComponentLibraryVisible={isComponentLibraryVisible}
            onFormatChange={() => {}}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </div>

        {/* Main Editor Area - Apply strategic containment */}
        <div 
          className="flex-1 flex bg-card relative"
          style={{ 
            isolation: 'isolate',
            position: 'relative',
            zIndex: 1,
            // Ensure this area doesn't interfere with sidebar
            marginLeft: 0,
            contain: 'layout style'
          }}
        >
          {/* Document Canvas Area */}
          <div 
            className={`flex-1 flex flex-col bg-muted/30 p-2 sm:p-4 lg:p-8 overflow-auto transition-all duration-300 relative ${
              isComponentLibraryVisible && !isMobile && !isTablet ? 'mr-80' : ''
            }`}
            style={{ 
              contain: 'style paint',
              // Ensure content doesn't overflow into sidebar area
              maxWidth: 'calc(100vw - (var(--sidebar-width, 240px) + 32px))'
            }}
          >
            {/* Document Container */}
            <div className="flex-1 flex justify-center relative">
              <div 
                className="bg-card shadow-2xl rounded-lg overflow-hidden border border-border w-full max-w-4xl relative"
                style={{
                  minHeight: isMobile ? '60vh' : isTablet ? '70vh' : '297mm',
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
                  willChange: 'transform'
                }}
              >
                <RichTextEditor
                  content={documentContent}
                  onChange={handleContentChange}
                  onSelectionChange={handleSelectionChange}
                  templateSections={loadedTemplate?.content?.sections}
                  isA4Format={!isMobile && !isTablet}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  onElementInsert={handleElementInsert}
                />
              </div>
            </div>
            
            {/* Document Controls - Mobile Optimized */}
            <div className={`mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-4 ${isMobile ? 'flex-wrap' : ''}`}>
              <button
                onClick={handleZoomOut}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-card rounded-lg shadow-sm border border-border hover:bg-muted transition-colors duration-200 text-xs sm:text-sm"
                disabled={zoomLevel <= 50}
              >
                <Icon name="ZoomOut" size={14} />
                {!isMobile && <span>Zoom Out</span>}
              </button>
              <span className="px-2 sm:px-3 py-1.5 sm:py-2 bg-card rounded-lg shadow-sm border border-border text-xs sm:text-sm font-medium">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-card rounded-lg shadow-sm border border-border hover:bg-muted transition-colors duration-200 text-xs sm:text-sm"
                disabled={zoomLevel >= 200}
              >
                <Icon name="ZoomIn" size={14} />
                {!isMobile && <span>Zoom In</span>}
              </button>
              <button
                onClick={handleZoomReset}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-card rounded-lg shadow-sm border border-border hover:bg-muted transition-colors duration-200 text-xs sm:text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Side Panels - Desktop only - Apply proper isolation */}
          {!isMobile && !isTablet && (
            <div style={{ isolation: 'isolate', position: 'relative', zIndex: 2 }}>
              <AIAssistantPanel
                isVisible={isAIVisible}
                onToggle={handleToggleAI}
              />
              <CollaborationPanel
                isVisible={isCollaborationVisible}
                onToggle={handleToggleCollaboration}
              />
            </div>
          )}

          {/* Component Library Panel - Use proper positioning */}
          {!isMobile && !isTablet && (
            <div 
              className={`absolute top-0 right-0 bottom-0 w-80 transition-transform duration-300 ease-in-out ${
                isComponentLibraryVisible ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ 
                zIndex: 30,
                isolation: 'isolate',
                position: 'absolute'
              }}
            >
              <DocumentComponentLibrary
                isVisible={isComponentLibraryVisible}
                onToggle={handleToggleComponentLibrary}
                onElementInsert={handleElementInsert}
                isMobile={isMobile}
              />
            </div>
          )}
        </div>

        {/* Mobile/Tablet Component Library Overlay */}
        {(isMobile || isTablet) && isComponentLibraryVisible && (
          <div 
            className="fixed inset-0 flex"
            style={{ zIndex: 1000 }}
          >
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={handleToggleComponentLibrary}
              style={{ zIndex: 1001 }}
            />
            <div style={{ zIndex: 1002 }}>
              <DocumentComponentLibrary
                isVisible={isComponentLibraryVisible}
                onToggle={handleToggleComponentLibrary}
                onElementInsert={handleElementInsert}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Voice Transcription Panel */}
        <VoiceTranscriptionPanel
          isActive={isVoiceActive}
          onToggle={handleVoiceToggle}
          isMobile={isMobile}
        />

        {/* Modals - Apply proper z-index hierarchy */}
        <div style={{ isolation: 'isolate', position: 'relative', zIndex: 2000 }}>
          <SaveModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSave}
            type="document"
            initialData={{
              id: currentDocument?.id,
              title: documentTitle,
              content: documentContent,
              documentType: loadedTemplate?.category || 'General Document',
              patientInfo: selectedPatient ? {
                id: selectedPatient?.id,
                name: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
                dob: selectedPatient?.dateOfBirth,
                mrn: selectedPatient?.mrn,
                patientId: selectedPatient?.patientId
              } : {},
              templateId: loadedTemplate?.id,
              templateName: loadedTemplate?.name,
              status: currentDocument?.status,
              priority: currentDocument?.priority,
              tags: currentDocument?.tags || []
            }}
            isLoading={saveStatus === 'saving'}
            isMobile={isMobile}
          />

          <FormatSelectionModal
            isOpen={showFormatSelectionModal}
            onClose={() => setShowFormatSelectionModal(false)}
            onSelectFormat={handleFormatSelection}
            type="document"
            documentTitle={documentTitle}
            isMobile={window.innerWidth < 768}
          />
        </div>

        {/* Toast Container */}
        <div style={{ isolation: 'isolate', position: 'relative', zIndex: 3000 }}>
          <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </div>

        {/* Mobile Floating Actions */}
        {isMobile && (
          <div 
            className="fixed bottom-6 right-6 flex flex-col gap-3"
            style={{ zIndex: 1500 }}
          >
            <button
              onClick={handleToggleComponentLibrary}
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 ${
                isComponentLibraryVisible 
                  ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
              }`}
            >
              <Icon name="Layers" size={20} />
            </button>
            <button
              onClick={() => setShowMobilePanels(true)}
              className="w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200"
            >
              <Icon name="MessageCircle" size={20} />
            </button>
            <button
              onClick={handleVoiceToggle}
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 ${
                isVoiceActive 
                  ? 'bg-error text-error-foreground' : 'bg-primary text-primary-foreground'
              }`}
            >
              <Icon name={isVoiceActive ? "MicOff" : "Mic"} size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentEditor;