import React, { useState, useCallback, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useToast } from './NotificationToast';
import { supabase } from '../../utils/supabaseClient';

const PDFUploader = ({ 
  onUploadSuccess, 
  onUploadError,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  bucketName = 'documents',
  folderPath = '',
  accept = '.pdf',
  multiple = false,
  className = '',
  disabled = false,
  showPreview = true,
  isMobile = false 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  // File validation
  const validateFile = useCallback((file) => {
    const errors = [];

    // Check file type
    if (!file?.type?.includes('pdf')) {
      errors?.push('Only PDF files are allowed');
    }

    // Check file size
    if (file?.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      errors?.push(`File size must be less than ${maxSizeMB}MB`);
    }

    // Check file name
    if (file?.name?.length > 100) {
      errors?.push('File name is too long');
    }

    return errors;
  }, [maxFileSize]);

  // Handle file selection
  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event?.target?.files || []);
    
    if (files?.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    files?.forEach(file => {
      const errors = validateFile(file);
      if (errors?.length === 0) {
        validFiles?.push({
          file,
          id: Math.random()?.toString(36)?.substr(2, 9),
          name: file?.name,
          size: file?.size,
          type: file?.type,
          preview: null
        });
      } else {
        invalidFiles?.push({ file, errors });
      }
    });

    // Show validation errors
    if (invalidFiles?.length > 0) {
      invalidFiles?.forEach(({ file, errors }) => {
        addToast(`${file?.name}: ${errors?.join(', ')}`, 'error');
      });
    }

    // Update selected files
    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles?.slice(0, 1));
    }

    // Generate preview for first valid file
    if (validFiles?.length > 0 && showPreview) {
      generateFilePreview(validFiles?.[0]?.file);
    }

    // Clear input
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  }, [validateFile, multiple, showPreview, addToast]);

  // Generate file preview
  const generateFilePreview = useCallback((file) => {
    if (file?.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setPreviewFile({
        url: fileURL,
        name: file?.name,
        size: file?.size
      });
    }
  }, []);

  // Generate unique file path
  const generateFilePath = useCallback((fileName, userId) => {
    const timestamp = Date.now();
    const cleanFileName = fileName?.replace(/[^a-zA-Z0-9.-]/g, '_');
    const basePath = folderPath ? `${folderPath}` : '';
    return `${userId}/${basePath}/pdfs/${timestamp}_${cleanFileName}`;
  }, [folderPath]);

  // Upload single file to Supabase Storage
  const uploadFileToStorage = useCallback(async (fileData, userId) => {
    try {
      const filePath = generateFilePath(fileData?.name, userId);
      
      const { data, error } = await supabase?.storage?.from(bucketName)?.upload(filePath, fileData?.file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            'original-name': fileData?.name,
            'content-type': fileData?.type,
            'uploaded-by': userId,
            'upload-timestamp': new Date()?.toISOString()
          }
        });

      if (error) {
        throw error;
      }

      // Get the file URL (signed URL for private buckets)
      const { data: urlData, error: urlError } = await supabase?.storage?.from(bucketName)?.createSignedUrl(data?.path, 3600 * 24 * 7); // 7 days expiry

      if (urlError) {
        // If signed URL fails, try public URL
        const { data: publicUrlData } = supabase?.storage?.from(bucketName)?.getPublicUrl(data?.path);
        
        return {
          success: true,
          filePath: data?.path,
          fileUrl: publicUrlData?.publicUrl,
          originalName: fileData?.name,
          size: fileData?.size,
          contentType: fileData?.type,
          isPublic: true
        };
      }

      return {
        success: true,
        filePath: data?.path,
        fileUrl: urlData?.signedUrl,
        originalName: fileData?.name,
        size: fileData?.size,
        contentType: fileData?.type,
        isPublic: false
      };

    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error?.message,
        fileName: fileData?.name
      };
    }
  }, [bucketName, generateFilePath]);

  // Upload all selected files
  const handleUpload = useCallback(async () => {
    if (selectedFiles?.length === 0 || isUploading) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get current user
      const { data: { user }, error: userError } = await supabase?.auth?.getUser();
      if (userError || !user) {
        throw new Error('User authentication required');
      }

      const uploadResults = [];
      const totalFiles = selectedFiles?.length;

      // Upload files sequentially to show progress
      for (let i = 0; i < selectedFiles?.length; i++) {
        const file = selectedFiles?.[i];
        
        const result = await uploadFileToStorage(file, user?.id);
        uploadResults?.push(result);
        
        // Update progress
        const progress = Math.round(((i + 1) / totalFiles) * 100);
        setUploadProgress(progress);
      }

      // Separate successful and failed uploads
      const successfulUploads = uploadResults?.filter(result => result?.success);
      const failedUploads = uploadResults?.filter(result => !result?.success);

      // Show results
      if (successfulUploads?.length > 0) {
        const message = `Successfully uploaded ${successfulUploads?.length} PDF${successfulUploads?.length > 1 ? 's' : ''}`;
        addToast(message, 'success');
        
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(successfulUploads);
        }
      }

      if (failedUploads?.length > 0) {
        failedUploads?.forEach(result => {
          addToast(`Failed to upload ${result?.fileName}: ${result?.error}`, 'error');
        });

        if (onUploadError) {
          onUploadError(failedUploads);
        }
      }

      // Clear selected files on complete success
      if (failedUploads?.length === 0) {
        setSelectedFiles([]);
        setPreviewFile(null);
      }

    } catch (error) {
      console.error('Upload process error:', error);
      addToast(`Upload failed: ${error?.message}`, 'error');
      
      if (onUploadError) {
        onUploadError([{ error: error?.message }]);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFiles, isUploading, uploadFileToStorage, onUploadSuccess, onUploadError, addToast]);

  // Remove selected file
  const removeFile = useCallback((fileId) => {
    setSelectedFiles(prev => prev?.filter(f => f?.id !== fileId));
    
    // Clear preview if removing the previewed file
    if (selectedFiles?.length === 1) {
      setPreviewFile(null);
    }
  }, [selectedFiles?.length]);

  // Clear all files
  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    setPreviewFile(null);
    if (previewFile?.url) {
      URL.revokeObjectURL(previewFile?.url);
    }
  }, [previewFile]);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  }, []);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewFile?.url) {
        URL.revokeObjectURL(previewFile?.url);
      }
    };
  }, [previewFile]);

  return (
    <div className={`pdf-uploader ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      {/* Upload Area */}
      <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
        disabled ? 'border-muted bg-muted/20' : 'border-border hover:border-primary/50 hover:bg-primary/5'
      }`}>
        <div className="text-center">
          <div className="mb-4">
            <Icon name="Upload" size={48} className={`mx-auto ${
              disabled ? 'text-muted-foreground' : 'text-primary'
            }`} />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Upload PDF Documents</h3>
          <p className="text-muted-foreground mb-4">
            {multiple ? 'Select one or more PDF files to upload' : 'Select a PDF file to upload'}
          </p>
          
          <Button
            onClick={() => fileInputRef?.current?.click()}
            disabled={disabled || isUploading}
            variant="outline"
            className="mb-3"
          >
            <Icon name="FolderOpen" size={16} className="mr-2" />
            {multiple ? 'Choose PDF Files' : 'Choose PDF File'}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB</p>
            <p>Supported format: PDF only</p>
          </div>
        </div>
      </div>
      {/* Selected Files List */}
      {selectedFiles?.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Selected Files ({selectedFiles?.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isUploading}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear All
            </Button>
          </div>

          <div className="space-y-3">
            {selectedFiles?.map((file) => (
              <div
                key={file?.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border"
              >
                <Icon name="FileText" size={24} className="text-red-600" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file?.size)} • PDF Document
                  </p>
                </div>

                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file?.id)}
                    className="text-muted-foreground hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles?.length === 0}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload {selectedFiles?.length > 1 ? `${selectedFiles?.length} Files` : 'File'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      {/* Preview Section */}
      {previewFile && showPreview && !isMobile && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Preview</h4>
          <div className="border border-border rounded-lg overflow-hidden max-h-96">
            <iframe
              src={previewFile?.url}
              className="w-full h-96"
              title={`Preview of ${previewFile?.name}`}
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Preview: {previewFile?.name} ({formatFileSize(previewFile?.size)})
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;