import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';

const DocumentHeader = ({ 
  documentTitle, 
  onTitleChange, 
  saveStatus, 
  onSave,
  onFormatSelectionModalOpen, // New prop for opening format selection modal
  onToggleAI,
  onToggleCollaboration,
  isAIVisible,
  isCollaborationVisible,
  templateInfo,
  onPatientChange,
  onDocumentTypeChange,
  onVoiceToggle,
  isVoiceActive,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(documentTitle);
  
  // Auto-updating modified date
  const [lastModified, setLastModified] = useState(new Date());

  // Auto-update modified date when content changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastModified(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleTitleEdit = () => {
    setIsEditing(true);
    setTempTitle(documentTitle);
  };

  const handleTitleSave = () => {
    onTitleChange(tempTitle);
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(documentTitle);
    setIsEditing(false);
  };

  // Updated save handler to open format selection modal
  const handleSaveClick = () => {
    console.log('Save button clicked - opening format selection modal');
    if (onFormatSelectionModalOpen) {
      onFormatSelectionModalOpen();
    } else {
      // Fallback to direct save if format selection is not available
      onSave?.();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Library
              </Button>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e?.target?.value)}
                      className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 text-gray-900 min-w-0"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={handleTitleSave} className="text-green-600 hover:bg-green-50">
                      <Icon name="Check" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleTitleCancel} className="text-red-600 hover:bg-red-50">
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">{documentTitle}</h1>
                    <Button variant="ghost" size="sm" onClick={handleTitleEdit} className="text-gray-500 hover:text-gray-700">
                      <Icon name="Edit2" size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Enhanced Template Badge */}
              {templateInfo && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm rounded-full border border-blue-200">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <Icon name="FileText" size={10} className="text-white" />
                  </div>
                  <span className="font-medium">Template: {templateInfo?.name}</span>
                </div>
              )}
            </div>
            
            {/* Enhanced Save Status */}
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Saving...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <Icon name="Check" size={16} />
                  <span className="text-sm font-medium">Saved</span>
                </div>
              )}
              {saveStatus === 'unsaved' && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Icon name="Circle" size={16} />
                  <span className="text-sm font-medium">Unsaved changes</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex items-center gap-3">
            {templateInfo && (
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Icon name="Download" size={16} className="mr-2" />
                Export as Template
              </Button>
            )}
            
            {/* Updated Save Button - now opens format selection modal */}
            <Button variant="outline" size="sm" onClick={handleSaveClick} className="border-green-200 text-green-700 hover:bg-green-50">
              <Icon name="Save" size={16} className="mr-2" />
              Save
            </Button>

            {/* Enhanced Collaboration Toggle */}
            <Button 
              variant={isCollaborationVisible ? "default" : "outline"} 
              size="sm" 
              onClick={onToggleCollaboration}
              className={isCollaborationVisible 
                ? "bg-purple-600 hover:bg-purple-700 text-white" :"border-purple-200 text-purple-700 hover:bg-purple-50"
              }
            >
              <Icon name="Users" size={16} className="mr-2" />
              Collaborate
            </Button>

            {/* Enhanced AI Assistant Toggle */}
            <Button 
              variant={isAIVisible ? "default" : "outline"} 
              size="sm" 
              onClick={onToggleAI}
              className={isAIVisible 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" :"border-blue-200 text-blue-700 hover:bg-blue-50"
              }
            >
              <Icon name="Bot" size={16} className="mr-2" />
              AI Assistant
            </Button>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* Document Actions */}
            <Button variant="outline" size="sm" className="text-gray-700 hover:bg-gray-50">
              <Icon name="Share" size={16} className="mr-2" />
              Share
            </Button>

            {/* More Options */}
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>
        </div>

        {/* New Section: Moved buttons below Save button */}
        <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* Voice Button */}
            <Button 
              variant={isVoiceActive ? "default" : "outline"} 
              size="sm" 
              onClick={onVoiceToggle}
              className={isVoiceActive 
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" :"border-gray-200 text-gray-700 hover:bg-gray-50"
              }
            >
              <Icon name="Mic" size={16} className="mr-2" />
              {isVoiceActive ? "Stop Recording" : "Voice"}
            </Button>

            {/* Magnification (Zoom) Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                disabled={zoomLevel <= 50}
                className="w-9 h-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <Icon name="ZoomOut" size={16} />
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-12 text-center">
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                disabled={zoomLevel >= 200}
                className="w-9 h-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <Icon name="ZoomIn" size={16} />
              </Button>
              {zoomLevel !== 100 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomReset}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  title="Reset Zoom"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Preview Button */}
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Icon name="Eye" size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Simplified Document Info Bar - Removed patient info per requirements */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {/* Auto-updating Modified Field */}
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} className="text-orange-500" />
              <span>Modified: <strong className="text-gray-900">{format(lastModified, 'MM/dd/yyyy HH:mm')}</strong></span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {/* Enhanced Word and Character Counters */}
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={14} className="text-blue-500" />
                <span>Words: <strong className="text-gray-900" id="word-counter">0</strong></span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Type" size={14} className="text-green-500" />
                <span>Characters: <strong className="text-gray-900" id="character-counter">0</strong></span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-full">
                <Icon name="Shield" size={14} className="text-green-600" />
                <span className="text-green-700 font-medium text-xs">Auto-save: ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;