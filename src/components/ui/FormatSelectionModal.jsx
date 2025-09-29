import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import { getSupportedFormats, getFormatDisplayNames, getFormatIcons, getFormatColors, supportsRichContent } from '../../utils/fileExport';

const FormatSelectionModal = ({ 
  isOpen, 
  onClose, 
  onSelectFormat, 
  type = 'document', // 'document' or 'template'
  documentTitle = '',
  isMobile = false
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedDestination, setSelectedDestination] = useState('download');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get format options from utility functions
  const supportedFormats = getSupportedFormats();
  const formatNames = getFormatDisplayNames();
  const formatIcons = getFormatIcons();
  const formatColors = getFormatColors();

  const formatOptions = supportedFormats?.map(formatId => ({
    id: formatId,
    name: formatNames?.[formatId] || formatId?.toUpperCase(),
    extension: `.${formatId}`,
    description: getFormatDescription(formatId),
    icon: formatIcons?.[formatId] || 'FileText',
    recommended: formatId === 'pdf',
    color: formatColors?.[formatId] || 'text-gray-600',
    supportsRich: supportsRichContent(formatId)
  }));

  function getFormatDescription(format) {
    const descriptions = {
      pdf: 'Portable Document Format - Best for sharing and printing',
      docx: 'Microsoft Word format - Editable document',
      xlsx: 'Microsoft Excel format - For data and tables',
      txt: 'Simple text format - Compatible with all systems',
      html: 'HTML format - Viewable in web browsers',
      rtf: 'Rich Text Format - Cross-platform compatibility'
    };
    return descriptions?.[format] || `${format?.toUpperCase()} format`;
  }

  const destinationOptions = [
    {
      id: 'download',
      name: 'Download to Browse Files',
      description: 'Save file to your computer\'s downloads folder',
      icon: 'Download',
      color: 'text-blue-600',
      recommended: true
    },
    {
      id: 'library',
      name: type === 'template' ? 'Save to Template Library' : 'Save to Document Library',
      description: type === 'template' ? 'Store in your template library for future use' : 'Store in your document library with metadata',
      icon: type === 'template' ? 'Library' : 'FolderOpen',
      color: 'text-green-600',
      recommended: false
    },
    {
      id: 'pdf-storage',
      name: 'Save as PDF to Storage',
      description: 'Convert and save as PDF in secure document storage',
      icon: 'FileText',
      color: 'text-red-600',
      recommended: false
    }
  ];

  const handleFormatSelect = (formatId) => {
    setSelectedFormat(formatId);
  };

  const handleDestinationSelect = (destinationId) => {
    setSelectedDestination(destinationId);
  };

  const handleProceed = async () => {
    if (!selectedFormat || !selectedDestination) return;

    setIsProcessing(true);
    
    try {
      const selectedFormatData = formatOptions?.find(f => f?.id === selectedFormat);
      const selectedDestinationData = destinationOptions?.find(d => d?.id === selectedDestination);
      
      // Call the parent callback with the selected format and destination
      await onSelectFormat(selectedFormat, selectedFormatData, selectedDestination, selectedDestinationData);
      
      // Close modal after successful processing
      onClose();
      
    } catch (error) {
      console.error('Error processing format selection:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedFormatData = formatOptions?.find(f => f?.id === selectedFormat);
  const selectedDestinationData = destinationOptions?.find(d => d?.id === selectedDestination);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
        isMobile ? 'w-full max-w-sm max-h-[90vh]' : 'w-full max-w-4xl max-h-[95vh]'
      }`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Save" size={24} className="text-blue-600" />
                Export Options
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose format and destination for your {type}
                {documentTitle && `: "${documentTitle}"`}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Icon name="X" size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`px-6 py-4 overflow-y-auto ${isMobile ? 'max-h-[65vh]' : 'max-h-[70vh]'}`}>
          {/* Destination Selection Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="MapPin" size={18} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Choose Destination</h3>
            </div>
            
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {destinationOptions?.map((destination) => (
                <div
                  key={destination?.id}
                  onClick={() => handleDestinationSelect(destination?.id)}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                    selectedDestination === destination?.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Recommended Badge */}
                  {destination?.recommended && (
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Default
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${
                      selectedDestination === destination?.id ? 'bg-green-100' : ''
                    }`}>
                      <Icon 
                        name={destination?.icon} 
                        size={20} 
                        className={`${destination?.color} ${
                          selectedDestination === destination?.id ? 'text-green-600' : ''
                        }`} 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {destination?.name}
                      </h4>
                      
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {destination?.description}
                      </p>

                      {/* Selection Indicator */}
                      {selectedDestination === destination?.id && (
                        <div className="flex items-center gap-1 mt-2 text-green-600">
                          <Icon name="CheckCircle" size={16} />
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="FileType" size={18} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Choose Format</h3>
            </div>
            
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
              {formatOptions?.map((format) => (
                <div
                  key={format?.id}
                  onClick={() => handleFormatSelect(format?.id)}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                    selectedFormat === format?.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Recommended Badge */}
                  {format?.recommended && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Recommended
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${
                      selectedFormat === format?.id ? 'bg-blue-100' : ''
                    }`}>
                      <Icon 
                        name={format?.icon} 
                        size={20} 
                        className={`${format?.color} ${
                          selectedFormat === format?.id ? 'text-blue-600' : ''
                        }`} 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {format?.name}
                        </h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {format?.extension}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {format?.description}
                      </p>

                      {/* Format Features */}
                      <div className="flex items-center gap-2 mt-2">
                        {format?.supportsRich && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                            Rich Content
                          </span>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {selectedFormat === format?.id && (
                        <div className="flex items-center gap-1 mt-2 text-blue-600">
                          <Icon name="CheckCircle" size={16} />
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Preview */}
        {selectedFormatData && selectedDestinationData && (
          <div className="px-6 py-3 bg-gray-50 border-t border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedDestinationData?.name === 'Download to Browse Files' ? 'Will download as:' : 'Will save to library as:'} {selectedFormatData?.name}
                </span>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Icon name={selectedDestinationData?.icon} size={12} />
                File: {documentTitle?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase() || (type === 'template' ? 'template' : 'document')}{selectedFormatData?.extension}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="Clock" size={14} />
            <span>Processing typically takes a few seconds</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="min-w-[80px]"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleProceed}
              disabled={!selectedFormat || !selectedDestination || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name={selectedDestinationData?.icon || "Save"} size={16} />
                  <span>{selectedDestinationData?.id === 'download' ? 'Download' : 'Save to Library'}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatSelectionModal;