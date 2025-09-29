import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DocumentPreviewModal = ({ document: documentData, isOpen, onClose, onEdit }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !documentData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Generate tag display from actual document tags
  const getDocumentTags = () => {
    const tags = documentData?.tags || [];
    
    // Add category-based tags if no custom tags exist
    if (tags?.length === 0) {
      const categoryTags = [];
      if (documentData?.documentType?.toLowerCase()?.includes('therapy')) {
        categoryTags?.push('Therapy');
      }
      if (documentData?.documentType?.toLowerCase()?.includes('assessment')) {
        categoryTags?.push('Assessment');
      }
      if (documentData?.priority === 'urgent') {
        categoryTags?.push('Urgent');
      }
      return categoryTags?.length > 0 ? categoryTags : ['Document'];
    }
    
    return tags;
  };

  // Format document content for preview
  const formatContentForPreview = (content) => {
    if (!content) return 'No content available';
    
    // Handle plain text content
    if (typeof content === 'string') {
      // Convert markdown-style headers to HTML
      let formattedContent = content?.replace(/^### (.+$)/gim, '<h3>$1</h3>')?.replace(/^## (.+$)/gim, '<h2>$1</h2>')?.replace(/^# (.+$)/gim, '<h1>$1</h1>')?.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')?.replace(/\*(.+?)\*/g, '<em>$1</em>')?.replace(/\n\n/g, '</p><p>')?.replace(/\n/g, '<br/>');
        
      return `<p>${formattedContent}</p>`;
    }
    
    return 'Content format not supported for preview';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative bg-card border border-border rounded-lg shadow-clinical-lg
        ${isMobile 
          ? 'w-full h-full m-0 rounded-none flex flex-col' :'w-full max-w-4xl h-[90vh] m-4'
        }
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 sm:p-6 border-b border-border
          ${isMobile ? 'flex-shrink-0' : ''}
        `}>
          <div className="flex items-center min-w-0 flex-1">
            <Icon name="FileText" size={20} className="mr-3 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {documentData?.title || documentData?.documentName || 'Untitled Document'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(documentData?.status)}
                <span className="text-xs text-muted-foreground">
                  Modified {formatDate(documentData?.lastModified)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(documentData)}>
              <Icon name="Edit" size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={`
          ${isMobile ? 'flex-1 overflow-hidden flex flex-col' : 'flex-1 flex overflow-hidden'}
        `}>
          {/* Document Info Sidebar */}
          <div className={`
            bg-muted border-r border-border p-4 sm:p-6
            ${isMobile ? 'border-r-0 border-b flex-shrink-0' : 'w-80 flex-shrink-0'}
          `}>
            <h3 className="font-semibold text-foreground mb-4">Document Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Patient Information
                </label>
                <div className="mt-1">
                  {documentData?.patientInfo?.patientId || documentData?.patientInfo?.id ? (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        ID: {documentData?.patientInfo?.patientId || documentData?.patientInfo?.id}
                      </p>
                      {documentData?.patientInfo?.name && (
                        <p className="text-sm text-muted-foreground">{documentData?.patientInfo?.name}</p>
                      )}
                      {documentData?.patientInfo?.dob && (
                        <p className="text-sm text-muted-foreground">DOB: {documentData?.patientInfo?.dob}</p>
                      )}
                      {documentData?.patientInfo?.mrn && (
                        <p className="text-sm text-muted-foreground">MRN: {documentData?.patientInfo?.mrn}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No patient assigned</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Document Type
                </label>
                <p className="text-sm text-foreground mt-1">{documentData?.documentType || 'General Document'}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created By
                </label>
                <div className="flex items-center mt-1">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-secondary-foreground font-medium">
                      {(documentData?.createdBy || documentData?.modifiedBy || 'Unknown')?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{documentData?.createdBy || documentData?.modifiedBy || 'Unknown User'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Dates
                </label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDate(documentData?.createdDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Modified: {formatDate(documentData?.lastModified)}
                  </p>
                </div>
              </div>

              {/* Show actual document metadata */}
              {documentData?.metadata && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Statistics
                  </label>
                  <div className="mt-1 space-y-1">
                    {documentData?.metadata?.wordCount && (
                      <p className="text-sm text-muted-foreground">
                        Words: {documentData?.metadata?.wordCount}
                      </p>
                    )}
                    {documentData?.metadata?.characterCount && (
                      <p className="text-sm text-muted-foreground">
                        Characters: {documentData?.metadata?.characterCount}
                      </p>
                    )}
                    {documentData?.version && (
                      <p className="text-sm text-muted-foreground">
                        Version: {documentData?.version}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Show template info if document was created from template */}
              {documentData?.templateName && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Template
                  </label>
                  <div className="mt-1">
                    <p className="text-sm text-foreground">{documentData?.templateName}</p>
                    <p className="text-xs text-muted-foreground">Created from template</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {getDocumentTags()?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-background text-xs text-foreground rounded border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            {isMobile && (
              <div className="flex gap-2 mt-6">
                <Button size="sm" className="flex-1">
                  <Icon name="Download" size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Share" size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>

          {/* Document Preview */}
          <div className={`
            flex-1 p-4 sm:p-6 overflow-auto
            ${isMobile ? 'min-h-0' : ''}
          `}>
            <div className="bg-white border border-border rounded-lg p-6 sm:p-8 h-full">
              <div className="max-w-none prose prose-sm sm:prose-base">
                {/* Document Title */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {documentData?.title || documentData?.documentName}
                  </h1>
                  {documentData?.patientInfo?.name && (
                    <p className="text-sm text-gray-600">
                      Patient: {documentData?.patientInfo?.name}
                      {documentData?.patientInfo?.patientId && ` (ID: ${documentData?.patientInfo?.patientId})`}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {documentData?.documentType} • Created {formatDate(documentData?.createdDate)}
                  </p>
                </div>

                {/* Actual Document Content */}
                {documentData?.content ? (
                  <div 
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatContentForPreview(documentData?.content) 
                    }}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No Content Available</p>
                    <p className="text-sm mt-1">This document appears to be empty or the content could not be loaded.</p>
                  </div>
                )}
                
                {/* Document Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                    <div>
                      <p>Document ID: {documentData?.id}</p>
                      <p>Created by {documentData?.createdBy || 'Unknown'} on {formatDate(documentData?.createdDate)}</p>
                      <p>Last modified by {documentData?.modifiedBy || 'Unknown'} on {formatDate(documentData?.lastModified)}</p>
                    </div>
                    <div className="text-right">
                      <p>Status: {documentData?.status || 'Unknown'}</p>
                      {documentData?.priority && (
                        <p>Priority: {documentData?.priority}</p>
                      )}
                      {documentData?.version && (
                        <p>Version: {documentData?.version}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Footer Actions */}
        {!isMobile && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Lock" size={14} />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Icon name="Download" size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Icon name="Share" size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Icon name="Archive" size={16} className="mr-2" />
                Archive
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreviewModal;