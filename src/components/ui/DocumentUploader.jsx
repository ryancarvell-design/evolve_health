import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import documentService from '../../services/documentService';
import Icon from '../AppIcon';

const DocumentUploader = ({ 
  onUploadComplete = null,
  onUploadStart = null,
  className = '',
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = '.pdf,.doc,.docx,.txt'
}) => {
  const { user, loading, authError, debugAuth } = useAuth();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Enhanced auth debugging
  useEffect(() => {
    debugAuth?.('DocumentUploader auth state:', { 
      hasUser: !!user, 
      userEmail: user?.email,
      loading, 
      authError 
    });
  }, [user, loading, authError, debugAuth]);

  // File validation
  const validateFile = (file) => {
    if (!file) return 'No file selected';
    
    if (file?.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`;
    }
    
    const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();
    const allowedExtensions = acceptedTypes?.replace(/\./g, '')?.split(',');
    
    if (!allowedExtensions?.includes(fileExtension)) {
      return `File type not supported. Allowed types: ${acceptedTypes}`;
    }
    
    return null;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setTitle(file?.name?.replace(/\.[^/.]+$/, "")); // Remove extension
    setError('');
    setShowMetadataForm(true);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e?.dataTransfer?.files || []);
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e?.target?.files || []);
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  };

  // Enhanced upload with better error handling
  const handleUpload = async () => {
    if (!selectedFile || !title?.trim()) {
      setError('Please provide a title for the document');
      return;
    }

    // Enhanced auth checking with detailed error messages
    if (loading) {
      setError('Checking authentication, please wait...');
      debugAuth?.('Upload blocked: still loading auth state');
      return;
    }

    if (authError) {
      setError(`Authentication error: ${authError}`);
      debugAuth?.('Upload blocked: auth error present:', authError);
      return;
    }

    if (!user) {
      setError('Please sign in to upload documents');
      debugAuth?.('Upload blocked: no user found');
      return;
    }

    debugAuth?.('Starting upload for user:', user?.email);
    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      onUploadStart?.(selectedFile);

      // Test authentication first
      debugAuth?.('Testing user authentication...');
      
      if (!user?.id) {
        throw new Error('Authentication lost during upload');
      }

      debugAuth?.('Authentication test passed, proceeding with upload');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await documentService?.uploadDocument(
        selectedFile,
        title?.trim(),
        description?.trim()
      );

      debugAuth?.('Upload completed successfully:', result?.id);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        resetForm();
        onUploadComplete?.(result);
      }, 500);

    } catch (error) {
      debugAuth?.('Upload failed:', error);
      const errorMessage = error?.message || 'Upload failed';
      
      // Provide more specific error guidance
      if (errorMessage?.includes('not authenticated') || errorMessage?.includes('auth')) {
        setError('Authentication issue detected. Please try signing out and back in.');
      } else if (errorMessage?.includes('storage')) {
        setError('Storage access denied. Please check your permissions or contact support.');
      } else if (errorMessage?.includes('network') || errorMessage?.includes('connection')) {
        setError('Network connection issue. Please check your internet and try again.');
      } else {
        setError(errorMessage);
      }
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setShowMetadataForm(false);
    setUploadProgress(0);
    setError('');
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cancel upload
  const handleCancel = () => {
    resetForm();
  };

  // Get file size display
  const getFileSizeDisplay = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'FileText';
      case 'doc': 
      case 'docx': return 'FileType';
      case 'txt': return 'File';
      default: return 'File';
    }
  };

  if (showMetadataForm && selectedFile) {
    return (
      <div className={`p-6 border border-gray-200 rounded-lg bg-white ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Document</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Icon name={getFileIcon(selectedFile?.name)} size={24} className="text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{selectedFile?.name}</p>
              <p className="text-sm text-gray-600">{getFileSizeDisplay(selectedFile?.size)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document title"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a description for this document"
              disabled={uploading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-red-800">
                <Icon name="AlertCircle" size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleUpload}
              disabled={uploading || !title?.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name={uploading ? "Loader2" : "Upload"} size={16} className={uploading ? "animate-spin" : ""} />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || loading}
        />
        
        <div className="space-y-4">
          <Icon name="Upload" size={48} className="mx-auto text-gray-400" />
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Document
            </h3>
            <p className="text-gray-600">
              Drag and drop your document here, or{' '}
              <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                browse files
              </span>
            </p>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Supported formats: PDF, Word, Text</p>
            <p>Maximum file size: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </div>
      ) : authError ? (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <Icon name="AlertTriangle" size={16} />
            <div>
              <p className="font-medium">Authentication Error</p>
              <p>{authError}</p>
              <p className="text-xs mt-1">Try refreshing the page or signing in again</p>
            </div>
          </div>
        </div>
      ) : !user ? (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Icon name="Info" size={16} />
            <span>Please sign in to upload and edit documents</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Icon name="CheckCircle" size={16} />
            <span>Signed in as {user?.email} - Ready to upload</span>
          </div>
          {process.env?.NODE_ENV === 'development' && (
            <div className="text-xs text-green-700 mt-1">
              User ID: {user?.id?.substring(0, 8)}...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;