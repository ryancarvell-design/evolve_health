import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ImportModal from './ImportModal';

const ComponentLibrary = ({ onDragStart, onElementAdd, isCollapsed, onToggle, orientation = 'vertical' }) => {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const componentCategories = [
    {
      id: 'formatting',
      name: 'Formatting',
      icon: 'Edit3',
      components: [
        {
          id: 'undo-button',
          name: 'Undo Button',
          icon: 'Undo',
          description: 'Undo last action button',
          type: 'undo-button'
        },
        {
          id: 'redo-button',
          name: 'Redo Button',
          icon: 'Redo',
          description: 'Redo last undone action button',
          type: 'redo-button'
        },
        {
          id: 'paragraph-format-dropdown',
          name: 'Paragraph Formats',
          icon: 'Type',
          description: 'Dropdown for paragraph and heading formats',
          type: 'paragraph-format-dropdown'
        },
        {
          id: 'font-format-dropdown',
          name: 'Font Formatting',
          icon: 'Bold',
          description: 'Dropdown for font formatting options',
          type: 'font-format-dropdown'
        },
        {
          id: 'insert-elements-dropdown',
          name: 'Insert Elements',
          icon: 'Plus',
          description: 'Dropdown for inserting tables and elements',
          type: 'insert-elements-dropdown'
        }
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      icon: 'Type',
      components: [
        {
          id: 'text-field',
          name: 'Text Field',
          icon: 'Type',
          description: 'Single line text input',
          type: 'input'
        },
        {
          id: 'textarea',
          name: 'Text Area',
          icon: 'AlignLeft',
          description: 'Multi-line text input',
          type: 'textarea'
        },
        {
          id: 'number-field',
          name: 'Number Field',
          icon: 'Hash',
          description: 'Numeric input field',
          type: 'number'
        },
        {
          id: 'date-field',
          name: 'Date Field',
          icon: 'Calendar',
          description: 'Date picker input',
          type: 'date'
        },
        {
          id: 'email-field',
          name: 'Email Field',
          icon: 'Mail',
          description: 'Email address input',
          type: 'email'
        },
        {
          id: 'phone-field',
          name: 'Phone Field',
          icon: 'Phone',
          description: 'Phone number input',
          type: 'phone'
        }
      ]
    },
    {
      id: 'selection',
      name: 'Selection',
      icon: 'CheckSquare',
      components: [
        {
          id: 'checkbox',
          name: 'Checkbox',
          icon: 'CheckSquare',
          description: 'Single checkbox option',
          type: 'checkbox'
        },
        {
          id: 'radio-group',
          name: 'Radio Group',
          icon: 'Circle',
          description: 'Multiple choice selection',
          type: 'radio'
        },
        {
          id: 'dropdown',
          name: 'Dropdown',
          icon: 'ChevronDown',
          description: 'Select from dropdown list',
          type: 'select'
        },
        {
          id: 'checkbox-group',
          name: 'Checkbox Group',
          icon: 'List',
          description: 'Multiple checkbox options',
          type: 'checkbox-group'
        },
        {
          id: 'toggle-switch',
          name: 'Toggle Switch',
          icon: 'ToggleLeft',
          description: 'On/off toggle control',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'medical',
      name: 'Medical',
      icon: 'Heart',
      components: [
        {
          id: 'vital-signs',
          name: 'Vital Signs',
          icon: 'Activity',
          description: 'Blood pressure, heart rate, etc.',
          type: 'vital-signs'
        },
        {
          id: 'pain-scale',
          name: 'Pain Scale',
          icon: 'Thermometer',
          description: '1-10 pain assessment scale',
          type: 'pain-scale'
        },
        {
          id: 'assessment-grid',
          name: 'Assessment Grid',
          icon: 'Grid3X3',
          description: 'Structured assessment table',
          type: 'assessment-grid'
        },
        {
          id: 'signature-block',
          name: 'Signature Block',
          icon: 'PenTool',
          description: 'Digital signature field',
          type: 'signature'
        },
        {
          id: 'medication-list',
          name: 'Medication List',
          icon: 'Pill',
          description: 'List of current medications',
          type: 'medication-list'
        },
        {
          id: 'diagnosis-codes',
          name: 'Diagnosis Codes',
          icon: 'FileText',
          description: 'ICD-10 diagnosis codes',
          type: 'diagnosis-codes'
        },
        {
          id: 'allergy-list',
          name: 'Allergy List',
          icon: 'AlertTriangle',
          description: 'Patient allergies and reactions',
          type: 'allergy-list'
        },
        {
          id: 'consent-form',
          name: 'Consent Form',
          icon: 'FileCheck',
          description: 'Treatment consent checkboxes',
          type: 'consent-form'
        },
        {
          id: 'progress-notes',
          name: 'Progress Notes',
          icon: 'FileText',
          description: 'Clinical progress documentation',
          type: 'progress-notes'
        },
        {
          id: 'lab-results',
          name: 'Lab Results',
          icon: 'TestTube',
          description: 'Laboratory test results table',
          type: 'lab-results'
        }
      ]
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: 'Layout',
      components: [
        {
          id: 'section-header',
          name: 'Section Header',
          icon: 'Heading1',
          description: 'Section title and divider',
          type: 'header'
        },
        {
          id: 'two-column',
          name: 'Two Column',
          icon: 'Columns',
          description: 'Side-by-side layout',
          type: 'two-column'
        },
        {
          id: 'three-column',
          name: 'Three Column',
          icon: 'Columns',
          description: 'Three-column layout',
          type: 'three-column'
        },
        {
          id: 'spacer',
          name: 'Spacer',
          icon: 'Minus',
          description: 'Vertical spacing element',
          type: 'spacer'
        },
        {
          id: 'divider',
          name: 'Divider',
          icon: 'Separator',
          description: 'Horizontal line separator',
          type: 'divider'
        },
        {
          id: 'page-break',
          name: 'Page Break',
          icon: 'Split',
          description: 'Force page break in print',
          type: 'page-break'
        },
        {
          id: 'info-box',
          name: 'Info Box',
          icon: 'Info',
          description: 'Highlighted information box',
          type: 'info-box'
        },
        {
          id: 'warning-box',
          name: 'Warning Box',
          icon: 'AlertTriangle',
          description: 'Warning or alert message box',
          type: 'warning-box'
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: 'Settings',
      components: [
        {
          id: 'table',
          name: 'Data Table',
          icon: 'Table',
          description: 'Structured data table',
          type: 'table'
        },
        {
          id: 'image-placeholder',
          name: 'Image Placeholder',
          icon: 'Image',
          description: 'Image upload placeholder',
          type: 'image'
        },
        {
          id: 'barcode',
          name: 'Barcode/QR Code',
          icon: 'QrCode',
          description: 'Barcode or QR code field',
          type: 'barcode'
        },
        {
          id: 'calculated-field',
          name: 'Calculated Field',
          icon: 'Calculator',
          description: 'Auto-calculated value',
          type: 'calculated'
        },
        {
          id: 'chart-placeholder',
          name: 'Chart Placeholder',
          icon: 'BarChart3',
          description: 'Data visualization chart',
          type: 'chart'
        },
        {
          id: 'timeline',
          name: 'Timeline',
          icon: 'Clock',
          description: 'Event timeline component',
          type: 'timeline'
        },
        {
          id: 'rating-scale',
          name: 'Rating Scale',
          icon: 'Star',
          description: 'Star or numeric rating scale',
          type: 'rating-scale'
        },
        {
          id: 'file-upload',
          name: 'File Upload',
          icon: 'Upload',
          description: 'File upload component',
          type: 'file-upload'
        }
      ]
    },
    {
      id: 'charts',
      name: 'Charts',
      icon: 'BarChart3',
      components: [
        {
          id: 'line-chart',
          name: 'Line Chart',
          icon: 'TrendingUp',
          description: 'Line graph for trends',
          type: 'line-chart'
        },
        {
          id: 'bar-chart',
          name: 'Bar Chart',
          icon: 'BarChart3',
          description: 'Bar graph for comparisons',
          type: 'bar-chart'
        },
        {
          id: 'pie-chart',
          name: 'Pie Chart',
          icon: 'PieChart',
          description: 'Pie chart for proportions',
          type: 'pie-chart'
        },
        {
          id: 'progress-bar',
          name: 'Progress Bar',
          icon: 'BarChart2',
          description: 'Progress indicator bar',
          type: 'progress-bar'
        }
      ]
    }
  ];

  const handleDragStart = (e, component) => {
    if (e?.dataTransfer) {
      e?.dataTransfer?.setData('application/json', JSON.stringify({
        ...component,
        source: 'library'
      }));
      e.dataTransfer.effectAllowed = 'copy';
    }
    onDragStart && onDragStart(component);
  };

  const handleDoubleClick = (component) => {
    // Double-click to add component directly to canvas center
    const newElement = {
      id: `element_${Date.now()}`,
      ...component,
      x: 200,
      y: 150,
      width: 300,
      height: getDefaultHeight(component?.type),
      properties: getDefaultProperties(component?.type)
    };
    onElementAdd && onElementAdd(newElement);
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
      'calculated': 40,
      'undo-button': 40,
      'redo-button': 40,
      'paragraph-format-dropdown': 40,
      'font-format-dropdown': 40,
      'insert-elements-dropdown': 40
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
      'allergy-list': {
        label: 'Known Allergies',
        fields: ['Allergen', 'Reaction', 'Severity', 'Date Noted']
      },
      'consent-form': {
        label: 'Patient Consent',
        items: ['I consent to treatment', 'I understand the risks', 'I agree to privacy policy']
      },
      'progress-notes': {
        label: 'Progress Notes',
        sections: ['Subjective', 'Objective', 'Assessment', 'Plan']
      },
      'lab-results': {
        label: 'Lab Results',
        fields: ['Test Name', 'Result', 'Reference Range', 'Date']
      },
      'header': { text: 'Section Header', level: 2 },
      'two-column': { leftWidth: 50, rightWidth: 50 },
      'three-column': { col1Width: 33, col2Width: 33, col3Width: 34 },
      'spacer': { height: 20 },
      'divider': { style: 'solid', color: '#e2e8f0' },
      'page-break': { visible: false },
      'info-box': { 
        title: 'Information',
        content: 'Important information for the user',
        type: 'info'
      },
      'warning-box': {
        title: 'Warning',
        content: 'Important warning or alert message',
        type: 'warning'
      },
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
      },
      'chart': {
        label: 'Chart',
        chartType: 'bar',
        data: 'Sample Data'
      },
      'timeline': {
        label: 'Timeline',
        events: ['Event 1', 'Event 2', 'Event 3']
      },
      'rating-scale': {
        label: 'Rating',
        scale: 5,
        type: 'stars'
      },
      'file-upload': {
        label: 'File Upload',
        acceptedTypes: 'application/pdf,image/*',
        maxSize: '10MB'
      },
      'line-chart': {
        label: 'Line Chart',
        xAxis: 'Time',
        yAxis: 'Value'
      },
      'bar-chart': {
        label: 'Bar Chart',
        xAxis: 'Category',
        yAxis: 'Value'
      },
      'pie-chart': {
        label: 'Pie Chart',
        segments: ['Segment 1', 'Segment 2', 'Segment 3']
      },
      'progress-bar': {
        label: 'Progress',
        value: 75,
        max: 100
      },
      'undo-button': {
        label: 'Undo',
        action: 'undo',
        shortcut: 'Ctrl+Z',
        functionality: 'undoAction'
      },
      'redo-button': {
        label: 'Redo',
        action: 'redo',
        shortcut: 'Ctrl+Y',
        functionality: 'redoAction'
      },
      'paragraph-format-dropdown': {
        label: 'Paragraph Format',
        options: [
          { name: 'Normal', icon: 'Type', key: 'normal', tag: 'p' },
          { name: 'Heading 1', icon: 'Heading1', key: 'h1', tag: 'h1' },
          { name: 'Heading 2', icon: 'Heading2', key: 'h2', tag: 'h2' },
          { name: 'Heading 3', icon: 'Heading3', key: 'h3', tag: 'h3' },
          { name: 'Bulleted List', icon: 'List', key: 'bulletList', tag: 'ul' },
          { name: 'Numbered List', icon: 'ListOrdered', key: 'numberedList', tag: 'ol' },
          { name: 'Check List', icon: 'CheckSquare', key: 'checkList', tag: 'checklist' }
        ],
        defaultOption: 'normal'
      },
      'font-format-dropdown': {
        label: 'Font Format',
        options: [
          { name: 'Bold', icon: 'Bold', key: 'bold' },
          { name: 'Italics', icon: 'Italic', key: 'italic' },
          { name: 'Underline', icon: 'Underline', key: 'underline' },
          { name: 'Strikethrough', icon: 'Strikethrough', key: 'strikethrough' },
          { name: 'Subscript', icon: 'Subscript', key: 'subscript' },
          { name: 'Superscript', icon: 'Superscript', key: 'superscript' }
        ],
        allowMultiple: true
      },
      'insert-elements-dropdown': {
        label: 'Insert Elements',
        options: [
          { name: 'Horizontal Rule', icon: 'Minus', key: 'horizontalRule' },
          { name: 'Insert Table', icon: 'Table', key: 'insertTable' },
          { name: 'Outdent', icon: 'Outdent', key: 'outdent' },
          { name: 'Indent', icon: 'Indent', key: 'indent' }
        ],
        hasTableModal: true
      }
    };
    return defaults?.[type] || {};
  };

  // Filter components based on search term
  const filteredComponents = componentCategories?.find(cat => cat?.id === activeCategory)
    ?.components?.filter(component =>
      component?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      component?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    ) || [];

  const handleImportComponents = () => {
    setShowImportModal(true);
  };

  const handleCustomComponents = () => {
    setShowCustomModal(true);
  };

  const handleTemplateComponents = () => {
    setShowTemplateModal(true);
  };

  if (isCollapsed) {
    return (
      <div className="h-full bg-card flex flex-col items-center justify-start py-6 border-l border-border">
        <button
          onClick={onToggle}
          className="flex flex-col items-center justify-center w-10 h-16 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-all duration-200 mb-4 group"
          title="Expand Component Library"
        >
          <Icon name="Layers" size={18} className="text-primary mb-1 group-hover:scale-110 transition-transform" />
          <Icon name="ChevronLeft" size={12} className="text-muted-foreground" />
        </button>
        <div className="writing-mode-vertical text-sm font-medium text-muted-foreground tracking-wider">
          COMPONENTS
        </div>
        <div className="mt-4 text-xs text-center text-muted-foreground px-1">
          <Icon name="MousePointer" size={12} className="mx-auto mb-1" />
          <div>Click to expand</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card flex flex-col border-l border-border">
      {/* Enhanced Header with Better Visibility */}
      <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Layers" size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Component Library</h2>
              <p className="text-xs text-muted-foreground">Drag to add components</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-all duration-200 group"
            title="Collapse Component Library"
          >
            <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={12} />
            </button>
          )}
        </div>
      </div>
      {/* Enhanced Category Tabs with Better Visual Hierarchy */}
      <div className="border-b border-border bg-background/50">
        <div className="grid grid-cols-2 gap-1 p-2">
          {componentCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex flex-col items-center px-2 py-3 text-xs font-medium rounded-lg transition-all duration-200 group ${
                activeCategory === category?.id
                  ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              <Icon name={category?.icon} size={16} className={`mb-1 transition-transform group-hover:scale-110 ${
                activeCategory === category?.id ? 'text-primary' : ''
              }`} />
              <span className="font-medium">{category?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Enhanced Components List with Better Drag Visual Feedback */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredComponents?.length > 0 ? (
          <div className="p-3 space-y-2">
            <div className="mb-3 px-1">
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <Icon name="Info" size={12} className="mr-1" />
                <span>Drag components to canvas or double-click to add</span>
              </div>
            </div>
            {filteredComponents?.map((component) => (
              <div
                key={component?.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                onDoubleClick={() => handleDoubleClick(component)}
                className="group p-3 bg-background border border-border rounded-lg cursor-grab hover:border-primary/40 hover:shadow-md transition-all duration-200 active:cursor-grabbing active:scale-95 active:shadow-lg"
                title="Drag to canvas or double-click to add"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/15 group-hover:to-accent/15 transition-all duration-200 group-hover:scale-105">
                    <Icon name={component?.icon} size={16} className="text-primary group-hover:text-primary/80 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                      {component?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {component?.description}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleDoubleClick(component);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-200"
                      title="Add to canvas"
                    >
                      <Icon name="Plus" size={12} className="text-primary" />
                    </button>
                    <div className="w-6 h-1 bg-muted-foreground/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Icon name="GripVertical" size={8} className="text-muted-foreground/40" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Icon name="Search" size={24} className="mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">No components found</p>
            <p className="text-xs text-center px-4">Try searching with different keywords</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
      {/* Enhanced Quick Actions with Better CTAs */}
      <div className="p-3 border-t border-border bg-muted/10">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
            <Icon name="Zap" size={12} className="mr-1" />
            Quick Actions
          </div>
          <button 
            onClick={handleImportComponents}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/15 hover:border-primary/30 transition-all duration-200 group"
          >
            <Icon name="Download" size={14} className="mr-2 group-hover:scale-110 transition-transform" />
            Import Components
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleCustomComponents}
              className="flex flex-col items-center justify-center px-2 py-2 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted/50 hover:border-border/80 transition-all duration-200 group"
            >
              <Icon name="Plus" size={12} className="mb-1 group-hover:scale-110 transition-transform" />
              Custom
            </button>
            <button 
              onClick={handleTemplateComponents}
              className="flex flex-col items-center justify-center px-2 py-2 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted/50 hover:border-border/80 transition-all duration-200 group"
            >
              <Icon name="Save" size={12} className="mb-1 group-hover:scale-110 transition-transform" />
              Template
            </button>
          </div>
        </div>
      </div>
      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(components) => {
          // Handle imported components
          components?.forEach(component => {
            onElementAdd({
              id: `element_${Date.now()}_${Math.random()}`,
              ...component,
              x: 100,
              y: 100,
              width: 300,
              height: getDefaultHeight(component?.type),
              properties: getDefaultProperties(component?.type)
            });
          });
          setShowImportModal(false);
        }}
      />
      {/* Custom Components Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create Custom Component</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Custom component creation feature coming soon. This will allow you to create reusable components from your existing designs.
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Template Components Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Template Components</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Browse and add components from your saved templates. This feature will show components from your template library.
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;