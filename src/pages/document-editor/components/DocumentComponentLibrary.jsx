import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DocumentComponentLibrary = ({ isVisible, onToggle, onElementInsert, isMobile = false }) => {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [searchTerm, setSearchTerm] = useState('');

  const componentCategories = [
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
          insertText: '[Text Field: ___________________]'
        },
        {
          id: 'textarea',
          name: 'Text Area',
          icon: 'AlignLeft',
          description: 'Multi-line text input',
          insertText: '\n[Text Area]\n_________________________________\n_________________________________\n_________________________________\n'
        },
        {
          id: 'number-field',
          name: 'Number Field',
          icon: 'Hash',
          description: 'Numeric input field',
          insertText: '[Number Field: _______]'
        },
        {
          id: 'date-field',
          name: 'Date Field',
          icon: 'Calendar',
          description: 'Date picker input',
          insertText: '[Date: ___/___/_____]'
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
          insertText: '☐ [Checkbox Option]'
        },
        {
          id: 'radio-group',
          name: 'Radio Group',
          icon: 'Circle',
          description: 'Multiple choice selection',
          insertText: '○ Option 1\n○ Option 2\n○ Option 3'
        },
        {
          id: 'dropdown',
          name: 'Dropdown',
          icon: 'ChevronDown',
          description: 'Select from dropdown list',
          insertText: '[Dropdown: Select Option ▼]'
        },
        {
          id: 'checkbox-group',
          name: 'Checkbox Group',
          icon: 'List',
          description: 'Multiple checkbox options',
          insertText: '☐ Option 1\n☐ Option 2\n☐ Option 3\n☐ Other: ___________'
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
          insertText: '\n**VITAL SIGNS**\nBlood Pressure: ____/____\nHeart Rate: ______ bpm\nTemperature: ______ °F\nRespiratory Rate: ______ /min\nOxygen Saturation: ______%\n'
        },
        {
          id: 'pain-scale',
          name: 'Pain Scale',
          icon: 'Thermometer',
          description: '1-10 pain assessment scale',
          insertText: '\n**PAIN ASSESSMENT**\nPain Level (1-10): [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]\nLocation: ________________________\nDescription: ________________________\n'
        },
        {
          id: 'signature-block',
          name: 'Signature Block',
          icon: 'PenTool',
          description: 'Digital signature field',
          insertText: '\n\nSignature: ________________________________ Date: ___________\nPrint Name: ________________________________\nTitle: ________________________________\n'
        },
        {
          id: 'medication-list',
          name: 'Medication List',
          icon: 'Pill',
          description: 'List of current medications',
          insertText: '\n**CURRENT MEDICATIONS**\n1. Medication: _____________ Dosage: _______ Frequency: _______\n2. Medication: _____________ Dosage: _______ Frequency: _______\n3. Medication: _____________ Dosage: _______ Frequency: _______\n'
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
          insertText: '\n\n## [SECTION TITLE]\n\n'
        },
        {
          id: 'two-column',
          name: 'Two Column',
          icon: 'Columns',
          description: 'Side-by-side layout',
          insertText: '\n\n| Column 1 | Column 2 |\n|----------|----------|\n| Content  | Content  |\n\n'
        },
        {
          id: 'divider',
          name: 'Divider',
          icon: 'Minus',
          description: 'Horizontal line separator',
          insertText: '\n\n---\n\n'
        },
        {
          id: 'info-box',
          name: 'Info Box',
          icon: 'Info',
          description: 'Highlighted information box',
          insertText: '\n\n> **INFORMATION**\n> Important information for the reader\n\n'
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
          insertText: '\n\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Row 1    | Data     | Data     |\n| Row 2    | Data     | Data     |\n| Row 3    | Data     | Data     |\n\n'
        },
        {
          id: 'image-placeholder',
          name: 'Image Placeholder',
          icon: 'Image',
          description: 'Image upload placeholder',
          insertText: '\n\n[📷 IMAGE PLACEHOLDER]\n*Click to upload image*\n\n'
        },
        {
          id: 'pdf-attachment',
          name: 'PDF Attachment',
          icon: 'FileText',
          description: 'PDF document attachment',
          insertText: '\n\n[📄 PDF ATTACHMENT]\n*Click to upload or view PDF document*\n*File: [Not selected]*\n\n'
        },
        {
          id: 'pdf-viewer',
          name: 'PDF Viewer',
          icon: 'Eye',
          description: 'Embedded PDF viewer',
          insertText: '\n\n[📖 PDF VIEWER]\n*PDF Document Viewer*\n*Click to load PDF document*\n\n'
        },
        {
          id: 'calculated-field',
          name: 'Calculated Field',
          icon: 'Calculator',
          description: 'Auto-calculated value',
          insertText: '[Calculated Field: _______ (Formula: _______)]'
        }
      ]
    },
    {
      id: 'charts',
      name: 'Charts',
      icon: 'BarChart3',
      components: [
        {
          id: 'progress-bar',
          name: 'Progress Bar',
          icon: 'BarChart2',
          description: 'Progress indicator bar',
          insertText: '\n\n**Progress**: [████████░░] 80%\n\n'
        },
        {
          id: 'chart-placeholder',
          name: 'Chart Placeholder',
          icon: 'BarChart3',
          description: 'Data visualization chart',
          insertText: '\n\n[📊 CHART PLACEHOLDER]\n*Chart Type: _______*\n*Data Source: _______*\n\n'
        }
      ]
    }
  ];

  const handleDragStart = (e, component) => {
    if (e?.dataTransfer) {
      e?.dataTransfer?.setData('text/plain', component?.insertText);
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  const handleDoubleClick = (component) => {
    // Insert component text at cursor position
    onElementInsert?.(component?.insertText);
  };

  // Filter components based on search term
  const filteredComponents = componentCategories?.find(cat => cat?.id === activeCategory)
    ?.components?.filter(component =>
      component?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      component?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    ) || [];

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`
      ${isMobile ? 'fixed inset-0 z-50 bg-background' : 'w-80 h-full bg-card'}
      flex flex-col border-l border-border shadow-lg
    `}>
      {/* Header */}
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
            title="Close Component Library"
          >
            <Icon name="X" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
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

      {/* Category Tabs */}
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

      {/* Components List */}
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
                  <button
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleDoubleClick(component);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-200"
                    title="Add to document"
                  >
                    <Icon name="Plus" size={12} className="text-primary" />
                  </button>
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

      {/* Quick Actions Footer */}
      <div className="p-3 border-t border-border bg-muted/10">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
            <Icon name="Zap" size={12} className="mr-1" />
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                onElementInsert?.('\n\n## New Section\n\n');
              }}
              className="flex flex-col items-center justify-center px-2 py-2 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted/50 hover:border-border/80 transition-all duration-200 group"
            >
              <Icon name="Plus" size={12} className="mb-1 group-hover:scale-110 transition-transform" />
              Section
            </button>
            <button 
              onClick={() => {
                onElementInsert?.('\n\n---\n\n');
              }}
              className="flex flex-col items-center justify-center px-2 py-2 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted/50 hover:border-border/80 transition-all duration-200 group"
            >
              <Icon name="Minus" size={12} className="mb-1 group-hover:scale-110 transition-transform" />
              Divider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComponentLibrary;