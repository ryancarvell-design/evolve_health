import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [importType, setImportType] = useState('file'); // 'file', 'url', 'library'
  const [importData, setImportData] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFileImport(files?.[0]);
  };

  const handleFileImport = (file) => {
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e?.target?.result);
        // Process imported data
        if (data?.components) {
          onImport(data?.components);
        } else {
          alert('Invalid file format. Please select a valid component file.');
        }
      } catch (error) {
        alert('Error reading file. Please check the file format.');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader?.readAsText(file);
  };

  const handleUrlImport = async () => {
    if (!importData?.trim()) return;

    setIsLoading(true);
    try {
      // Mock URL import - in real implementation, this would fetch from the URL
      const mockComponents = [
        {
          name: 'Imported Text Field',
          type: 'input',
          icon: 'Type',
          description: 'Imported from URL'
        },
        {
          name: 'Imported Checkbox',
          type: 'checkbox',
          icon: 'CheckSquare',
          description: 'Imported from URL'
        }
      ];
      
      setTimeout(() => {
        onImport(mockComponents);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      alert('Error importing from URL. Please check the URL.');
      setIsLoading(false);
    }
  };

  const handleLibraryImport = () => {
    // Mock library components
    const libraryComponents = [
      {
        name: 'Healthcare Header',
        type: 'header',
        icon: 'Heading1',
        description: 'Standard healthcare document header'
      },
      {
        name: 'Patient Info Section',
        type: 'patient-info',
        icon: 'User',
        description: 'Complete patient information form'
      },
      {
        name: 'Vital Signs Panel',
        type: 'vital-signs',
        icon: 'Activity',
        description: 'Comprehensive vital signs collection'
      }
    ];
    
    onImport(libraryComponents);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-clinical-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Download" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Import Components</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Import Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Import Source</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setImportType('file')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  importType === 'file' ?'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="Upload" size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">File Upload</div>
                <div className="text-xs text-muted-foreground">JSON, CSV files</div>
              </button>
              
              <button
                onClick={() => setImportType('url')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  importType === 'url' ?'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="Link" size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">From URL</div>
                <div className="text-xs text-muted-foreground">External source</div>
              </button>
              
              <button
                onClick={() => setImportType('library')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  importType === 'library' ?'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="Database" size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">Component Library</div>
                <div className="text-xs text-muted-foreground">Pre-built components</div>
              </button>
            </div>
          </div>

          {/* Import Interface */}
          {importType === 'file' && (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports JSON component files, CSV data files
              </p>
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => handleFileImport(e?.target?.files?.[0])}
                className="hidden"
                id="file-import"
              />
              <label
                htmlFor="file-import"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Choose File
              </label>
            </div>
          )}

          {importType === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Component URL
                </label>
                <input
                  type="url"
                  value={importData}
                  onChange={(e) => setImportData(e?.target?.value)}
                  placeholder="https://example.com/components.json"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button 
                onClick={handleUrlImport} 
                disabled={!importData?.trim() || isLoading}
                loading={isLoading}
                className="w-full"
              >
                Import from URL
              </Button>
            </div>
          )}

          {importType === 'library' && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Choose from our curated collection of healthcare-specific components:
              </div>
              
              <div className="grid gap-3">
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Icon name="Heart" size={20} className="text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Healthcare Essentials</div>
                      <div className="text-sm text-muted-foreground">Patient info, vital signs, assessments</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={20} className="text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Documentation Templates</div>
                      <div className="text-sm text-muted-foreground">Pre-built form sections and layouts</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Icon name="BarChart3" size={20} className="text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Data Visualization</div>
                      <div className="text-sm text-muted-foreground">Charts, graphs, and progress indicators</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleLibraryImport} className="w-full">
                Import Selected Components
              </Button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Import components to enhance your template builder
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
            <div className="bg-card p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Importing components...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportModal;