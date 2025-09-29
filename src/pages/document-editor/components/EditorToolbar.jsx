import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditorToolbar = ({ 
  onFormatChange, 
  onVoiceToggle, 
  isVoiceActive,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleComponentLibrary,
  isComponentLibraryVisible,
  isMobile,
  isTablet
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeFormat, setActiveFormat] = useState(new Set());
  const [showTableModal, setShowTableModal] = useState(false);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && dropdownRefs?.current?.[activeDropdown] && 
          !dropdownRefs?.current?.[activeDropdown]?.contains(event?.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Paragraph and heading options
  const paragraphOptions = [
    { name: 'Normal', icon: 'Type', key: 'normal', tag: 'p' },
    { name: 'Heading 1', icon: 'Heading1', key: 'h1', tag: 'h1' },
    { name: 'Heading 2', icon: 'Heading2', key: 'h2', tag: 'h2' },
    { name: 'Heading 3', icon: 'Heading3', key: 'h3', tag: 'h3' },
    { name: 'Bulleted List', icon: 'List', key: 'bulletList', tag: 'ul' },
    { name: 'Numbered List', icon: 'ListOrdered', key: 'numberedList', tag: 'ol' },
    { name: 'Check List', icon: 'CheckSquare', key: 'checkList', tag: 'checklist' }
  ];

  // Font formatting options
  const fontOptions = [
    { name: 'Bold', icon: 'Bold', key: 'bold' },
    { name: 'Italics', icon: 'Italic', key: 'italic' },
    { name: 'Underline', icon: 'Underline', key: 'underline' },
    { name: 'Strikethrough', icon: 'Strikethrough', key: 'strikethrough' },
    { name: 'Subscript', icon: 'Subscript', key: 'subscript' },
    { name: 'Superscript', icon: 'Superscript', key: 'superscript' }
  ];

  // Insert elements options
  const insertOptions = [
    { name: 'Horizontal Rule', icon: 'Minus', key: 'horizontalRule' },
    { name: 'Insert Table', icon: 'Table', key: 'insertTable' },
    { name: 'Outdent', icon: 'Outdent', key: 'outdent' },
    { name: 'Indent', icon: 'Indent', key: 'indent' }
  ];

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleFormatClick = (formatKey, closeDropdown = true) => {
    if (formatKey === 'insertTable') {
      setShowTableModal(true);
      setActiveDropdown(null);
      return;
    }

    const newActiveFormat = new Set(activeFormat);
    if (newActiveFormat?.has(formatKey)) {
      newActiveFormat?.delete(formatKey);
    } else {
      newActiveFormat?.add(formatKey);
    }
    setActiveFormat(newActiveFormat);
    onFormatChange(formatKey);
    
    if (closeDropdown) {
      setActiveDropdown(null);
    }
  };

  const handleUndo = () => {
    document.execCommand('undo');
    onFormatChange('undo');
  };

  const handleRedo = () => {
    document.execCommand('redo');
    onFormatChange('redo');
  };

  const handleTableInsert = (rows, cols) => {
    onFormatChange('insertTable', { rows, cols });
    setShowTableModal(false);
  };

  const DropdownButton = ({ name, icon, options, dropdownKey, defaultLabel }) => (
    <div 
      className="relative" 
      ref={el => dropdownRefs.current[dropdownKey] = el}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDropdownToggle(dropdownKey)}
        className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded ${
          activeDropdown === dropdownKey ? 'bg-gray-100 text-gray-900' : ''
        }`}
      >
        <Icon name={icon} size={16} />
        {!isMobile && <span className="text-sm">{defaultLabel || name}</span>}
        <Icon name="ChevronDown" size={14} className={`transition-transform ${
          activeDropdown === dropdownKey ? 'rotate-180' : ''
        }`} />
      </Button>
      
      {activeDropdown === dropdownKey && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {options?.map((option) => (
              <button
                key={option?.key}
                onClick={() => handleFormatClick(option?.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  activeFormat?.has(option?.key) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <Icon name={option?.icon} size={16} />
                <span>{option?.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TableInsertModal = () => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    if (!showTableModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Insert Table</h3>
            <button
              onClick={() => setShowTableModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of rows
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e?.target?.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of columns
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(parseInt(e?.target?.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTableModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleTableInsert(rows, cols)}
            >
              Insert Table
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Undo Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded"
              >
                <Icon name="Undo" size={16} />
                {!isMobile && <span className="text-sm">Undo</span>}
              </Button>

              {/* Redo Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded"
              >
                <Icon name="Redo" size={16} />
                {!isMobile && <span className="text-sm">Redo</span>}
              </Button>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Paragraph/Heading Formats Dropdown */}
              <DropdownButton
                name="Paragraph"
                icon="Type"
                options={paragraphOptions}
                dropdownKey="paragraph"
                defaultLabel="Paragraph"
              />

              {/* Font Formatting Dropdown */}
              <DropdownButton
                name="Format"
                icon="Bold"
                options={fontOptions}
                dropdownKey="font"
                defaultLabel="Format"
              />

              {/* Insert Elements Dropdown */}
              <DropdownButton
                name="Insert"
                icon="Plus"
                options={insertOptions}
                dropdownKey="insert"
                defaultLabel="Insert"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Component Library Button */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant={isComponentLibraryVisible ? "default" : "outline"} 
                  size="sm" 
                  onClick={onToggleComponentLibrary}
                  className={isComponentLibraryVisible 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" :"border-blue-200 text-blue-700 hover:bg-blue-50"
                  }
                >
                  <Icon name="Layers" size={16} className="mr-2" />
                  {!isMobile && "Components"}
                  {isMobile && !isComponentLibraryVisible && <Icon name="ChevronLeft" size={14} className="ml-1" />}
                  {isMobile && isComponentLibraryVisible && <Icon name="X" size={14} className="ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Insert Modal */}
      <TableInsertModal />
    </>
  );
};

export default EditorToolbar;