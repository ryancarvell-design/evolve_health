import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import documentService from '../../services/documentService';
import Icon from '../AppIcon';

const PDFDocumentEditor = ({ 
  documentId = null,
  className = '',
  onSave = null,
  onClose = null
}) => {
  const { user } = useAuth();
  const [document, setDocument] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingPageId, setEditingPageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load document and pages
  const loadDocument = useCallback(async () => {
    if (!documentId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const documentData = await documentService?.getDocumentWithPages(documentId);
      setDocument(documentData);
      setPages(documentData?.pages || []);
      
      if (documentData?.status === 'processing') {
        setIsProcessing(true);
      }
    } catch (error) {
      setError(`Failed to load document: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // Load document on mount
  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Real-time subscription for processing status
  useEffect(() => {
    if (!documentId || !isProcessing) return;

    const subscription = documentService?.subscribeToDocument(
      documentId,
      (payload) => {
        if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
          loadDocument(); // Refresh document data
        }
      }
    );

    return () => {
      documentService?.unsubscribeFromDocument(subscription);
    };
  }, [documentId, isProcessing, loadDocument]);

  // Start editing page content
  const handleEditPage = (page) => {
    setEditingPageId(page?.id);
    setEditContent(page?.content || '');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditContent('');
  };

  // Save page content
  const handleSavePageContent = async () => {
    if (!editingPageId) return;

    setSaving(true);
    try {
      const updatedPage = await documentService?.updatePageContent(
        editingPageId,
        editContent,
        [] // Annotations can be added later
      );

      // Update local state
      setPages(prevPages => 
        prevPages?.map(page => 
          page?.id === editingPageId ? { ...page, content: editContent } : page
        )
      );

      setEditingPageId(null);
      setEditContent('');
      
      onSave?.(updatedPage);
    } catch (error) {
      setError(`Failed to save content: ${error?.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save document version
  const handleSaveVersion = async () => {
    if (!document?.id) return;

    setSaving(true);
    try {
      const content = {
        pages: pages?.map(page => ({
          page_number: page?.page_number,
          content: page?.content,
          annotations: page?.annotations
        }))
      };

      await documentService?.saveDocumentVersion(
        document?.id,
        content,
        'Document edits saved'
      );

      setError('');
    } catch (error) {
      setError(`Failed to save version: ${error?.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Export document
  const handleExport = async () => {
    if (!document?.id) return;

    try {
      setLoading(true);
      const downloadUrl = await documentService?.exportDocumentAsPDF(document?.id);
      
      // Open download
      const link = document?.createElement('a');
      link.href = downloadUrl;
      link.download = `${document?.title}.pdf`;
      document?.body?.appendChild(link);
      link?.click();
      document?.body?.removeChild(link);
    } catch (error) {
      setError(`Export failed: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter pages by search term
  const filteredPages = pages?.filter(page => 
    !searchTerm || page?.content?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const currentPageData = filteredPages?.find(page => page?.page_number === currentPage) || filteredPages?.[0];

  if (loading && !document) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <Icon name="AlertCircle" size={32} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDocument}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center max-w-md">
          <Icon name="FileText" size={48} className="text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing PDF Document</h3>
          <p className="text-gray-600 mb-4">
            We're extracting and processing your PDF content. This may take a few minutes...
          </p>
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
          <p className="text-sm text-gray-500">
            You'll be notified when processing is complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{document?.title}</h1>
              <p className="text-sm text-gray-600">
                {pages?.length} pages • Status: {document?.status}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveVersion}
              disabled={saving}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Icon name="Save" size={14} />
              {saving ? 'Saving...' : 'Save Version'}
            </button>
            
            <button
              onClick={handleExport}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Icon name="Download" size={14} />
              Export PDF
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Search and Navigation */}
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {pages?.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              
              <span className="text-sm text-gray-600 min-w-20 text-center">
                Page {currentPage} of {pages?.length}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(pages?.length, currentPage + 1))}
                disabled={currentPage >= pages?.length}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {currentPageData ? (
          <div className="h-full p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      Page {currentPageData?.page_number}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      {editingPageId === currentPageData?.id ? (
                        <>
                          <button
                            onClick={handleSavePageContent}
                            disabled={saving}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Icon name="Check" size={14} />
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            <Icon name="X" size={14} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditPage(currentPageData)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                        >
                          <Icon name="Edit" size={14} />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {editingPageId === currentPageData?.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e?.target?.value)}
                      rows={20}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed resize-none"
                      placeholder="Enter page content..."
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {currentPageData?.content || (
                          <span className="text-gray-500 italic">No content available for this page</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No pages match your search' : 'No pages available'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDocumentEditor;