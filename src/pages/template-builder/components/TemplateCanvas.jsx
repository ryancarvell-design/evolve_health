import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TemplateCanvas = ({ 
  elements, 
  onElementAdd, 
  onElementSelect, 
  onElementUpdate, 
  onElementDelete, 
  selectedElement,
  canvasSize,
  currentPage 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState('');
  const [editingElement, setEditingElement] = useState(null);
  const [editingField, setEditingField] = useState('');
  const canvasRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const isDragStarted = useRef(false);

  const handleDragOver = (e) => {
    e?.preventDefault();
    if (!isDraggingElement) {
      setDragOver(true);
    }
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    if (!isDraggingElement) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    
    try {
      const transferData = e?.dataTransfer?.getData('application/json');
      if (!transferData) return;

      const componentData = JSON.parse(transferData);
      
      // Check if dragging from library only (not moving existing elements)
      if (componentData?.source === 'library') {
        // Adding new component from library
        const rect = canvasRef?.current?.getBoundingClientRect();
        const x = e?.clientX - rect?.left;
        const y = e?.clientY - rect?.top;
        
        const newElement = {
          id: `element_${Date.now()}`,
          ...componentData,
          x: Math.max(0, x - 100),
          y: Math.max(0, y - 20),
          width: 300,
          height: getDefaultHeight(componentData?.type),
          properties: getDefaultProperties(componentData?.type)
        };
        
        onElementAdd(newElement);
      }
    } catch (error) {
      console.error('Error parsing dropped component:', error);
    }
  };

  // Enhanced element interaction handlers with proper mouse-based dragging
  const handleElementMouseDown = useCallback((e, element) => {
    if (e?.button !== 0) return; // Only left click
    
    // Don't start drag if clicking on edit controls or input fields
    if (e?.target?.tagName === 'INPUT' || 
        e?.target?.tagName === 'TEXTAREA'|| e?.target?.closest('.edit-controls') ||
        e?.target?.closest('.resize-handle') ||
        editingElement === element?.id ||
        isResizing) {
      return;
    }
    
    e?.preventDefault();
    e?.stopPropagation();
    
    // Store initial mouse position
    dragStartPos.current = { x: e?.clientX, y: e?.clientY };
    isDragStarted.current = false;
    
    // Calculate offset from element's top-left corner
    const rect = canvasRef?.current?.getBoundingClientRect();
    const offsetX = e?.clientX - rect?.left - element?.x;
    const offsetY = e?.clientY - rect?.top - element?.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggedElement(element);
    
    // Select the element
    onElementSelect(element);

    // Add global mouse event listeners
    const handleMouseMove = (moveEvent) => {
      // Check if we've moved enough to start dragging (prevents accidental drags on clicks)
      const deltaX = Math.abs(moveEvent?.clientX - dragStartPos?.current?.x);
      const deltaY = Math.abs(moveEvent?.clientY - dragStartPos?.current?.y);
      
      if (!isDragStarted?.current && (deltaX > 5 || deltaY > 5)) {
        isDragStarted.current = true;
        setIsDraggingElement(true);
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }
      
      if (isDragStarted?.current) {
        // Update element position during drag
        const canvasRect = canvasRef?.current?.getBoundingClientRect();
        let newX = Math.max(0, moveEvent?.clientX - canvasRect?.left - offsetX);
        let newY = Math.max(0, moveEvent?.clientY - canvasRect?.top - offsetY);
        
        const updatedElement = {
          ...element,
          x: newX,
          y: newY
        };
        
        // Update element position in real-time
        onElementUpdate(updatedElement);
      }
    };

    const handleMouseUp = (upEvent) => {
      // Clean up event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Reset drag state
      setIsDraggingElement(false);
      setDraggedElement(null);
      isDragStarted.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      
      // If we didn't start dragging, treat as a simple click
      if (!isDragStarted?.current) {
        onElementSelect(element);
      }
    };
    
    // Add the event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
  }, [editingElement, isResizing, onElementSelect, onElementUpdate]);

  const handleElementClick = useCallback((e, element) => {
    e?.stopPropagation();
    if (!isDraggingElement) {
      onElementSelect(element);
    }
  }, [onElementSelect, isDraggingElement]);

  // Double-click to enter edit mode
  const handleElementDoubleClick = useCallback((e, element) => {
    e?.stopPropagation();
    setEditingElement(element?.id);
    setEditingField('text'); // Default field to edit
  }, []);

  // Inline editing functionality
  const handleInlineEdit = useCallback((element, field, value) => {
    const updatedElement = {
      ...element,
      properties: {
        ...element?.properties,
        [field]: value
      }
    };
    onElementUpdate(updatedElement);
  }, [onElementUpdate]);

  // Exit edit mode
  const handleEditComplete = useCallback(() => {
    setEditingElement(null);
    setEditingField('');
  }, []);

  // Delete element with keyboard shortcut
  const handleKeyDown = useCallback((e) => {
    if (e?.key === 'Delete' && selectedElement && !editingElement) {
      onElementDelete(selectedElement?.id);
    }
    if (e?.key === 'Escape') {
      handleEditComplete();
      onElementSelect(null);
    }
  }, [selectedElement, editingElement, onElementDelete, handleEditComplete, onElementSelect]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleResizeStart = useCallback((e, element, handle) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setDraggedElement(element);
    
    const handleMouseMove = (e) => {
      if (!isResizing || !draggedElement) return;
      
      const rect = canvasRef?.current?.getBoundingClientRect();
      const mouseX = e?.clientX - rect?.left;
      const mouseY = e?.clientY - rect?.top;
      
      let newWidth = draggedElement?.width;
      let newHeight = draggedElement?.height;
      let newX = draggedElement?.x;
      let newY = draggedElement?.y;
      
      switch (handle) {
        case 'se': // Southeast
          newWidth = Math.max(100, mouseX - draggedElement?.x);
          newHeight = Math.max(40, mouseY - draggedElement?.y);
          break;
        case 'sw': // Southwest
          newWidth = Math.max(100, draggedElement?.x + draggedElement?.width - mouseX);
          newHeight = Math.max(40, mouseY - draggedElement?.y);
          newX = Math.max(0, mouseX);
          break;
        case 'ne': // Northeast
          newWidth = Math.max(100, mouseX - draggedElement?.x);
          newHeight = Math.max(40, draggedElement?.y + draggedElement?.height - mouseY);
          newY = Math.max(0, mouseY);
          break;
        case 'nw': // Northwest
          newWidth = Math.max(100, draggedElement?.x + draggedElement?.width - mouseX);
          newHeight = Math.max(40, draggedElement?.y + draggedElement?.height - mouseY);
          newX = Math.max(0, mouseX);
          newY = Math.max(0, mouseY);
          break;
      }
      
      const updatedElement = {
        ...draggedElement,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
      
      onElementUpdate(updatedElement);
      setDraggedElement(updatedElement);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle('');
      setDraggedElement(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = getResizeCursor(handle);
    document.body.style.userSelect = 'none';
  }, [isResizing, draggedElement, onElementUpdate]);

  const getResizeCursor = (handle) => {
    const cursors = {
      'nw': 'nw-resize',
      'ne': 'ne-resize',
      'sw': 'sw-resize',
      'se': 'se-resize'
    };
    return cursors?.[handle] || 'default';
  };

  const getDefaultHeight = (type) => {
    const heights = {
      'input': 40, 'email': 40, 'phone': 40,
      'textarea': 80,
      'number': 40,
      'date': 40,
      'checkbox': 24, 'toggle': 24,
      'radio': 100,
      'select': 40,
      'checkbox-group': 120,
      'vital-signs': 200,
      'pain-scale': 60,
      'assessment-grid': 300,
      'signature': 100,
      'medication-list': 200,
      'diagnosis-codes': 150,
      'header': 50,
      'two-column': 200, 'three-column': 200,
      'spacer': 20,
      'divider': 2,
      'page-break': 10,
      'table': 300,
      'image': 200,
      'barcode': 100,
      'calculated': 40
    };
    return heights?.[type] || 40;
  };

  const getDefaultProperties = (type) => {
    const defaults = {
      'input': { label: 'Text Field', placeholder: 'Enter text...', required: false },
      'email': { label: 'Email Address', placeholder: 'Enter email...', required: false },
      'phone': { label: 'Phone Number', placeholder: 'Enter phone...', required: false },
      'textarea': { label: 'Text Area', placeholder: 'Enter description...', rows: 4, required: false },
      'number': { label: 'Number Field', placeholder: '0', min: '', max: '', required: false },
      'date': { label: 'Date Field', required: false },
      'checkbox': { label: 'Checkbox Option', checked: false },
      'toggle': { label: 'Toggle Option', checked: false },
      'radio': { label: 'Radio Group', options: ['Option 1', 'Option 2', 'Option 3'] },
      'select': { label: 'Dropdown', options: ['Select option...', 'Option 1', 'Option 2'] },
      'checkbox-group': { label: 'Checkbox Group', options: ['Option 1', 'Option 2', 'Option 3'] },
      'vital-signs': { fields: ['Blood Pressure', 'Heart Rate', 'Temperature', 'Respiratory Rate', 'Oxygen Saturation'] },
      'pain-scale': { label: 'Pain Level (1-10)', min: 1, max: 10 },
      'assessment-grid': { rows: 5, columns: 3, headers: ['Assessment', 'Score', 'Notes'] },
      'signature': { label: 'Signature', required: true },
      'medication-list': { 
        label: 'Current Medications',
        fields: ['Medication Name', 'Dosage', 'Frequency', 'Prescriber']
      },
      'diagnosis-codes': {
        label: 'Diagnosis Codes',
        allowMultiple: true,
        codeSystem: 'ICD-10'
      },
      'header': { text: 'Section Header', level: 2 },
      'two-column': { leftWidth: 50, rightWidth: 50 },
      'three-column': { col1Width: 33, col2Width: 33, col3Width: 34 },
      'spacer': { height: 20 },
      'divider': { style: 'solid', color: '#e2e8f0' },
      'page-break': { visible: false },
      'table': { 
        rows: 3, columns: 3, 
        headers: ['Column 1', 'Column 2', 'Column 3'],
        showBorders: true
      },
      'image': { 
        label: 'Image Upload', 
        acceptedTypes: 'image/*',
        maxSize: '5MB'
      },
      'barcode': { 
        label: 'Barcode/QR Code',
        type: 'qr',
        data: 'Sample Data'
      },
      'calculated': {
        label: 'Calculated Field',
        formula: 'SUM(field1, field2)',
        readonly: true
      }
    };
    return defaults?.[type] || {};
  };

  const renderElement = (element) => {
    const isSelected = selectedElement?.id === element?.id;
    const isDragging = isDraggingElement && draggedElement?.id === element?.id;
    const isEditing = editingElement === element?.id;
    
    return (
      <div
        key={element?.id}
        className={`absolute border-2 transition-all duration-200 group select-none ${
          isDragging 
            ? 'border-primary bg-primary/10 shadow-lg scale-105 z-20' 
            : isSelected 
            ? 'border-primary bg-primary/5 shadow-md z-10' 
            : 'border-transparent hover:border-primary/50 hover:shadow-sm z-0'
        } ${isDraggingElement && draggedElement?.id !== element?.id ? 'opacity-50' : ''} ${
          isEditing ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        }`}
        style={{
          left: element?.x,
          top: element?.y,
          width: element?.width,
          height: element?.height,
          cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab'
        }}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
        onClick={(e) => handleElementClick(e, element)}
        onDoubleClick={(e) => handleElementDoubleClick(e, element)}
      >
        {renderElementContent(element, isEditing)}
        
        {/* Enhanced Selection Handles with Resize Functionality and Edit Controls */}
        {isSelected && !isDraggingElement && (
          <>
            {/* Resize handles */}
            <div 
              className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nw-resize shadow-md hover:scale-110 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element, 'nw')}
            />
            <div 
              className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-ne-resize shadow-md hover:scale-110 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element, 'ne')}
            />
            <div 
              className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-sw-resize shadow-md hover:scale-110 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element, 'sw')}
            />
            <div 
              className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-se-resize shadow-md hover:scale-110 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element, 'se')}
            />
            
            {/* Element Info Badge with Edit Controls */}
            <div className="absolute -top-12 left-0 bg-primary text-white text-xs px-3 py-2 rounded shadow-md whitespace-nowrap edit-controls">
              <div className="flex items-center space-x-3">
                <span>{element?.name} ({element?.width}×{element?.height})</span>
                <div className="flex items-center space-x-1">
                  <button 
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleElementDoubleClick(e, element);
                    }}
                    title="Edit content"
                  >
                    <Icon name="Edit2" size={12} />
                  </button>
                  <button 
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    onClick={(e) => {
                      e?.stopPropagation();
                      const newElement = {
                        ...element,
                        id: `element_${Date.now()}`,
                        x: element?.x + 20,
                        y: element?.y + 20
                      };
                      onElementAdd(newElement);
                    }}
                    title="Duplicate element"
                  >
                    <Icon name="Copy" size={12} />
                  </button>
                  <button 
                    className="hover:bg-red-400 p-1 rounded transition-colors"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onElementDelete(element?.id);
                    }}
                    title="Delete element"
                  >
                    <Icon name="Trash2" size={12} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Mode Indicator */}
        {isEditing && (
          <div className="absolute -bottom-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap edit-controls">
            <div className="flex items-center space-x-2">
              <Icon name="Edit2" size={12} />
              <span>Editing - Press Escape to finish</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderElementContent = (element, isEditing = false) => {
    const commonProps = {
      style: isEditing ? {} : { pointerEvents: 'none' }
    };

    switch (element?.type) {
      case 'input': case'email': case'phone':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={element?.properties?.label || ''}
                  onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                  onBlur={handleEditComplete}
                  className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                  placeholder="Field label..."
                  autoFocus
                />
                <input
                  type="text"
                  value={element?.properties?.placeholder || ''}
                  onChange={(e) => handleInlineEdit(element, 'placeholder', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  placeholder="Placeholder text..."
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <input
                  type={element?.type === 'input' ? 'text' : element?.type}
                  placeholder={element?.properties?.placeholder}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  {...commonProps}
                  readOnly
                />
              </>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={element?.properties?.label || ''}
                  onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                  onBlur={handleEditComplete}
                  className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                  placeholder="Field label..."
                  autoFocus
                />
                <textarea
                  value={element?.properties?.placeholder || ''}
                  onChange={(e) => handleInlineEdit(element, 'placeholder', e?.target?.value)}
                  rows={element?.properties?.rows}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none bg-background"
                  placeholder="Placeholder text..."
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <textarea
                  placeholder={element?.properties?.placeholder}
                  rows={element?.properties?.rows}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none bg-background"
                  {...commonProps}
                  readOnly
                />
              </>
            )}
          </div>
        );

      case 'header':
        return (
          <div className="p-2 h-full flex items-center">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.text || ''}
                onChange={(e) => handleInlineEdit(element, 'text', e?.target?.value)}
                onBlur={handleEditComplete}
                className="text-lg font-semibold bg-transparent border-none outline-none border-b border-border pb-1 flex-1"
                placeholder="Header text..."
                autoFocus
              />
            ) : (
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-1 flex-1" {...commonProps}>
                {element?.properties?.text}
              </h2>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={element?.properties?.label || ''}
                  onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                  onBlur={handleEditComplete}
                  className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                  placeholder="Field label..."
                  autoFocus
                />
                <input
                  type="text"
                  value={element?.properties?.placeholder || ''}
                  onChange={(e) => handleInlineEdit(element, 'placeholder', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  placeholder="Placeholder text..."
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <input
                  type="number"
                  placeholder={element?.properties?.placeholder}
                  min={element?.properties?.min}
                  max={element?.properties?.max}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  {...commonProps}
                  readOnly
                />
              </>
            )}
          </div>
        );

      case 'date':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Field label..."
                autoFocus
              />
            ) : (
              <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                {element?.properties?.label}
              </label>
            )}
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
              {...commonProps}
              readOnly
            />
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="p-2 flex items-center h-full">
            <input type="checkbox" className="mr-2" {...commonProps} readOnly />
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="text-sm bg-transparent border-none outline-none flex-1"
                placeholder="Checkbox label..."
                autoFocus
              />
            ) : (
              <label className="text-sm text-foreground" {...commonProps}>{element?.properties?.label}</label>
            )}
          </div>
        );

      case 'allergy-list':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Field label..."
                autoFocus
              />
            ) : (
              <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                {element?.properties?.label}
              </label>
            )}
            <div className="text-xs text-muted-foreground">
              Fields: {element?.properties?.fields?.join(', ')}
            </div>
          </div>
        );

      case 'consent-form':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Field label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="space-y-1">
                  {element?.properties?.items?.slice(0, 2)?.map((item, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <input type="checkbox" className="mr-1 scale-75" readOnly />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                  {element?.properties?.items?.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{element?.properties?.items?.length - 2} more items
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );

      case 'progress-notes':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Field label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="text-xs text-muted-foreground">
                  SOAP: {element?.properties?.sections?.join(', ')}
                </div>
              </>
            )}
          </div>
        );

      case 'lab-results':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Field label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="text-xs text-muted-foreground">
                  Lab Table: {element?.properties?.fields?.slice(0, 2)?.join(', ')}...
                </div>
              </>
            )}
          </div>
        );

      case 'info-box':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={element?.properties?.title || ''}
                  onChange={(e) => handleInlineEdit(element, 'title', e?.target?.value)}
                  onBlur={handleEditComplete}
                  className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                  placeholder="Box title..."
                  autoFocus
                />
                <input
                  type="text"
                  value={element?.properties?.content || ''}
                  onChange={(e) => handleInlineEdit(element, 'content', e?.target?.value)}
                  className="w-full text-xs bg-transparent border-none outline-none"
                  placeholder="Box content..."
                />
              </>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 h-full">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{element?.properties?.title}</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">{element?.properties?.content}</p>
              </div>
            )}
          </div>
        );

      case 'warning-box':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={element?.properties?.title || ''}
                  onChange={(e) => handleInlineEdit(element, 'title', e?.target?.value)}
                  onBlur={handleEditComplete}
                  className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                  placeholder="Warning title..."
                  autoFocus
                />
                <input
                  type="text"
                  value={element?.properties?.content || ''}
                  onChange={(e) => handleInlineEdit(element, 'content', e?.target?.value)}
                  className="w-full text-xs bg-transparent border-none outline-none"
                  placeholder="Warning content..."
                />
              </>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded p-2 h-full">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={14} className="text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">{element?.properties?.title}</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">{element?.properties?.content}</p>
              </div>
            )}
          </div>
        );

      case 'chart': case'line-chart': case'bar-chart': case'pie-chart':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Chart label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="flex items-center justify-center h-full bg-muted/20 rounded">
                  <Icon name="BarChart3" size={24} className="text-muted-foreground" />
                </div>
              </>
            )}
          </div>
        );

      case 'progress-bar':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Progress label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${element?.properties?.value || 75}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {element?.properties?.value || 75}% Complete
                </div>
              </>
            )}
          </div>
        );

      case 'rating-scale':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Rating label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="flex space-x-1">
                  {Array.from({ length: element?.properties?.scale || 5 }, (_, index) => (
                    <Icon key={index} name="Star" size={16} className="text-yellow-400" />
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case 'file-upload':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Upload label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="border-2 border-dashed border-border rounded p-2 text-center">
                  <Icon name="Upload" size={20} className="text-muted-foreground mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">
                    {element?.properties?.acceptedTypes} • {element?.properties?.maxSize}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'timeline':
        return (
          <div className="p-2 h-full">
            {isEditing ? (
              <input
                type="text"
                value={element?.properties?.label || ''}
                onChange={(e) => handleInlineEdit(element, 'label', e?.target?.value)}
                onBlur={handleEditComplete}
                className="w-full text-sm font-medium bg-transparent border-none outline-none mb-1"
                placeholder="Timeline label..."
                autoFocus
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground mb-1" {...commonProps}>
                  {element?.properties?.label}
                </label>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">
                    {element?.properties?.events?.length || 0} events
                  </div>
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div className="p-2 flex items-center justify-center h-full bg-muted/30 rounded">
            <Icon name={element?.icon} size={20} className="text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground" {...commonProps}>{element?.name}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-background relative overflow-auto">
      {/* Enhanced Canvas Header with Canvas Size Info */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-30 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Template Canvas</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Layers" size={16} />
                <span>{elements?.length} element{elements?.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Monitor" size={16} />
                <span>{canvasSize?.name} ({canvasSize?.width} × {canvasSize?.height})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} />
                <span>{currentPage?.name}</span>
              </div>
              {selectedElement && (
                <div className="flex items-center space-x-2 text-primary">
                  <Icon name="MousePointer" size={16} />
                  <span>{selectedElement?.name}</span>
                </div>
              )}
              {editingElement && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Icon name="Edit2" size={16} />
                  <span>Edit Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={canvasRef}
        className={`min-h-screen p-8 transition-all duration-200 ${
          dragOver && !isDraggingElement
            ? 'bg-primary/5 border-2 border-dashed border-primary' 
            : isDraggingElement 
            ? 'bg-muted/30' :''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          if (e?.target === e?.currentTarget || e?.target?.closest('.canvas-paper')) {
            onElementSelect(null);
            handleEditComplete();
          }
        }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        {dragOver && !isDraggingElement && (
          <div className="absolute inset-8 border-2 border-dashed border-primary rounded-lg bg-primary/5 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <Icon name="Download" size={48} className="text-primary mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-semibold text-primary mb-2">Drop Component Here</h3>
              <p className="text-primary/70">Release to add component to your template</p>
            </div>
          </div>
        )}

        {/* Template Paper with Dynamic Canvas Size */}
        <div 
          className="canvas-paper relative bg-white shadow-clinical-lg mx-auto rounded-lg overflow-hidden" 
          style={{ 
            width: canvasSize?.width,
            minHeight: canvasSize?.height
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-5" />
          
          {elements?.map(renderElement)}
          
          {/* Enhanced Empty State with Canvas Size Info */}
          {elements?.length === 0 && !dragOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="MousePointer" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Start Building Your Template</h3>
                <p className="text-muted-foreground mb-2">Canvas: {canvasSize?.name} ({canvasSize?.width} × {canvasSize?.height})</p>
                <p className="text-muted-foreground mb-4">Drag components from the library to add them. Once placed, you can:</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="MousePointer2" size={16} />
                    <span>Double-click to edit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Move" size={16} />
                    <span>Drag to move</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Maximize" size={16} />
                    <span>Resize with handles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Trash2" size={16} />
                    <span>Delete key to remove</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Canvas Size Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
            {canvasSize?.name}: {canvasSize?.pixels?.width}×{canvasSize?.pixels?.height}px
          </div>

          {selectedElement && (
            <>
              <div 
                className="absolute border-l border-dashed border-primary/30 pointer-events-none z-5"
                style={{ 
                  left: selectedElement?.x,
                  top: 0,
                  bottom: 0
                }}
              />
              <div 
                className="absolute border-t border-dashed border-primary/30 pointer-events-none z-5"
                style={{ 
                  top: selectedElement?.y,
                  left: 0,
                  right: 0
                }}
              />
            </>
          )}
        </div>

        {/* Enhanced Instructions */}
        {isDraggingElement && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none">
            <div className="flex items-center space-x-2">
              <Icon name="Move" size={16} />
              <span className="text-sm font-medium">Moving element - release to place</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCanvas;