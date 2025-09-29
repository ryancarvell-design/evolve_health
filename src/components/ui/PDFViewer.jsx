import React, { useState, useCallback, useEffect } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import Icon from '../AppIcon';
import Button from './Button';

// Import CSS for PDF viewer
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ 
  pdfFile, 
  onClose, 
  title = 'PDF Document',
  showDownload = true,
  showFullscreen = true,
  className = '',
  isMobile = false 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(SpecialZoomLevel?.PageFit);

  // Configure default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs?.[0], // Thumbnails
      defaultTabs?.[1], // Bookmarks
    ],
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: (zoom) => {
          setIsFullscreen(true);
        },
        onExitFullScreen: (zoom) => {
          setIsFullscreen(false);
        },
      },
    },
  });

  // Handle PDF loading
  const handleDocumentLoad = useCallback((e) => {
    setIsLoading(false);
    setHasError(false);
    console.log('PDF loaded successfully:', e?.doc?.numPages, 'pages');
  }, []);

  const handleDocumentLoadError = useCallback((error) => {
    setIsLoading(false);
    setHasError(true);
    console.error('PDF loading error:', error);
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Handle download
  const handleDownload = useCallback(() => {
    if (pdfFile) {
      const link = document.createElement('a');
      link.href = pdfFile;
      link.download = `${title?.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
    }
  }, [pdfFile, title]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape' && !isFullscreen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isFullscreen, onClose]);

  if (!pdfFile) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mb-4 mx-auto" />
          <p className="text-muted-foreground">No PDF file provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer-container ${className} ${
      isFullscreen ? 'fixed inset-0 z-[9999] bg-white' : 'relative'
    }`}>
      {/* PDF Viewer Header */}
      <div className={`flex items-center justify-between p-4 border-b border-border bg-muted/10 ${
        isFullscreen ? 'sticky top-0 z-50' : ''
      }`}>
        <div className="flex items-center gap-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">PDF Document</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls - Desktop only */}
          {!isMobile && (
            <div className="flex items-center gap-1 mr-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(SpecialZoomLevel?.PageWidth)}
                className="text-xs"
              >
                Fit Width
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(SpecialZoomLevel?.PageFit)}
                className="text-xs"
              >
                Fit Page
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Icon name="Download" size={16} />
              {!isMobile && <span>Download</span>}
            </Button>
          )}

          {showFullscreen && !isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="flex items-center gap-1"
            >
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} />
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </Button>
          )}

          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-1"
            >
              <Icon name="X" size={16} />
              {!isFullscreen && !isMobile && <span>Close</span>}
            </Button>
          )}
        </div>
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64 bg-muted/20">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}
      {/* Error State */}
      {hasError && (
        <div className="flex items-center justify-center h-64 bg-error/10">
          <div className="text-center">
            <Icon name="AlertTriangle" size={32} className="text-error mb-2" />
            <p className="text-sm text-error">Failed to load PDF</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please check the file format and try again
            </p>
          </div>
        </div>
      )}
      {/* PDF Viewer */}
      {!hasError && (
        <div className={`pdf-viewer-wrapper ${
          isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'
        } ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer
              fileUrl={pdfFile}
              plugins={[defaultLayoutPluginInstance]}
              onDocumentLoad={handleDocumentLoad}
              onDocumentLoadError={handleDocumentLoadError}
              defaultScale={zoomLevel}
              theme={{
                theme: 'light',
              }}
            />
          </Worker>
        </div>
      )}
      {/* Mobile-specific controls overlay */}
      {isMobile && !hasError && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(SpecialZoomLevel?.PageWidth)}
              className="text-xs"
            >
              Fit Width
            </Button>
            <div className="w-px h-4 bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(SpecialZoomLevel?.PageFit)}
              className="text-xs"
            >
              Fit Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;