import React, { useState, useCallback } from 'react';
import PDFViewer from './PDFViewer';
import PDFUploader from './PDFUploader';
import Icon from '../AppIcon';
import Button from './Button';

const PDFComponent = ({ 
  mode = 'viewer', // 'viewer', 'uploader', 'both'
  pdfFile = null,
  title = 'PDF Document',
  bucketName = 'documents',
  folderPath = '',
  maxFileSize = 10 * 1024 * 1024,
  allowUpload = true,
  allowView = true,
  showControls = true,
  onUploadSuccess,
  onUploadError,
  className = '',
  isMobile = false 
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [currentPdfFile, setCurrentPdfFile] = useState(pdfFile);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handle successful upload
  const handleUploadSuccess = useCallback((uploadResults) => {
    setUploadedFiles(prev => [...prev, ...uploadResults]);
    
    // If only one file uploaded, switch to viewer mode
    if (uploadResults?.length === 1 && allowView) {
      setCurrentPdfFile(uploadResults?.[0]?.fileUrl);
      setCurrentMode('viewer');
    }

    // Call parent callback
    if (onUploadSuccess) {
      onUploadSuccess(uploadResults);
    }
  }, [allowView, onUploadSuccess]);

  // Handle upload error
  const handleUploadError = useCallback((errors) => {
    if (onUploadError) {
      onUploadError(errors);
    }
  }, [onUploadError]);

  // Switch between modes
  const switchMode = useCallback((newMode) => {
    setCurrentMode(newMode);
  }, []);

  // Handle file selection from uploaded files
  const handleFileSelect = useCallback((fileUrl, fileName) => {
    setCurrentPdfFile(fileUrl);
    setCurrentMode('viewer');
  }, []);

  // Render mode switcher
  const renderModeSwitcher = () => {
    if (!showControls || mode !== 'both') return null;

    return (
      <div className="flex items-center gap-2 mb-4 p-2 bg-muted/20 rounded-lg">
        <Button
          variant={currentMode === 'viewer' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchMode('viewer')}
          disabled={!allowView || !currentPdfFile}
          className="flex items-center gap-2"
        >
          <Icon name="Eye" size={16} />
          View PDF
        </Button>
        
        <Button
          variant={currentMode === 'uploader' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchMode('uploader')}
          disabled={!allowUpload}
          className="flex items-center gap-2"
        >
          <Icon name="Upload" size={16} />
          Upload PDF
        </Button>
      </div>
    );
  };

  // Render uploaded files list
  const renderUploadedFiles = () => {
    if (uploadedFiles?.length === 0 || currentMode !== 'uploader') return null;

    return (
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Icon name="CheckCircle" size={16} className="text-green-600" />
          Recently Uploaded Files
        </h4>
        <div className="space-y-2">
          {uploadedFiles?.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-green-600" />
                <div>
                  <p className="font-medium text-sm">{file?.originalName}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file?.size / (1024 * 1024))?.toFixed(2)} MB • PDF Document
                  </p>
                </div>
              </div>
              
              {allowView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileSelect(file?.fileUrl, file?.originalName)}
                  className="text-green-700 hover:text-green-800"
                >
                  <Icon name="Eye" size={16} className="mr-1" />
                  View
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`pdf-component ${className}`}>
      {renderModeSwitcher()}
      
      {currentMode === 'uploader' && allowUpload && (
        <div>
          {renderUploadedFiles()}
          <PDFUploader
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxFileSize={maxFileSize}
            bucketName={bucketName}
            folderPath={folderPath}
            multiple
            isMobile={isMobile}
          />
        </div>
      )}
      
      {currentMode === 'viewer' && allowView && (
        <div>
          {currentPdfFile ? (
            <PDFViewer
              pdfFile={currentPdfFile}
              title={title}
              onClose={() => mode === 'both' ? switchMode('uploader') : null}
              showDownload={true}
              showFullscreen={!isMobile}
              isMobile={isMobile}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
              <div className="text-center">
                <Icon name="FileText" size={48} className="text-muted-foreground mb-4 mx-auto" />
                <h3 className="font-medium text-foreground mb-2">No PDF Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {allowUpload ? 'Upload a PDF file to view it here' : 'No PDF file available'}
                </p>
                {allowUpload && mode === 'both' && (
                  <Button
                    variant="outline"
                    onClick={() => switchMode('uploader')}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Upload" size={16} />
                    Upload PDF
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFComponent;