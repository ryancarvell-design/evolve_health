import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SearchBar from './components/SearchBar';
import AdvancedFilters from './components/AdvancedFilters';
import DocumentTable from './components/DocumentTable';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import QuickFilters from './components/QuickFilters';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import TemplateLibrary from './components/TemplateLibrary';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getDocuments, getTemplates, deleteDocument, deleteTemplate, searchDocuments, searchTemplates } from '../../utils/storage';
import { ToastContainer, useToast } from '../../components/ui/NotificationToast';

const DocumentLibrary = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [activeQuickFilter, setActiveQuickFilter] = useState('recent');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recentCount, setRecentCount] = useState(0);
  const [sharedCount, setSharedCount] = useState(0);
  const [draftsCount, setDraftsCount] = useState(0);
  const { toasts, addToast, removeToast } = useToast();

  // Load real data on component mount
  useEffect(() => {
    loadDocuments();
    loadTemplates();
  }, []);

  const loadDocuments = () => {
    const loadedDocuments = getDocuments();
    setDocuments(loadedDocuments);
  };

  const loadTemplates = () => {
    const loadedTemplates = getTemplates();
    setTemplates(loadedTemplates);
  };

  const breadcrumbItems = [
    { label: 'Library', href: '/document-library' },
    { label: activeTab === 'documents' ? 'All Documents' : 'Template Library' }
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (searchTerm) => {
    if (activeTab === 'documents') {
      const filteredDocs = searchDocuments(searchTerm);
      setDocuments(filteredDocs);
    } else {
      const filteredTemplates = searchTemplates(searchTerm);
      setTemplates(filteredTemplates);
    }
  };

  const handleAdvancedFiltersToggle = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleApplyFilters = (filters) => {
    if (activeTab === 'documents') {
      const filteredDocs = searchDocuments('', filters);
      setDocuments(filteredDocs);
    } else {
      const filteredTemplates = searchTemplates('', filters);
      setTemplates(filteredTemplates);
    }
  };

  const handleClearFilters = () => {
    loadDocuments();
    loadTemplates();
  };

  const handleSelectDocument = (docId) => {
    setSelectedDocuments(prev => 
      prev?.includes(docId) 
        ? prev?.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDocuments(
      selectedDocuments?.length === documents?.length 
        ? [] 
        : documents?.map(doc => doc?.id)
    );
  };

  const handlePreviewDocument = (document) => {
    setPreviewDocument(document);
    setShowPreview(true);
  };

  const handleEditDocument = (document) => {
    // Navigate to document editor with document data using React Router
    const documentData = encodeURIComponent(JSON.stringify(document));
    navigate(`/document-editor?document=${documentData}`);
  };

  const handleCreateDocument = () => {
    navigate('/document-creation-hub');
  };

  const handleBulkExport = () => {
    console.log('Exporting documents:', selectedDocuments);
    // Implement bulk export logic
  };

  const handleBulkArchive = () => {
    console.log('Archiving documents:', selectedDocuments);
    // Implement bulk archive logic
  };

  const handleBulkShare = () => {
    console.log('Sharing documents:', selectedDocuments);
    // Implement bulk share logic
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedDocuments?.map(docId => 
        activeTab === 'documents' ? deleteDocument(docId) : deleteTemplate(docId)
      );
      
      await Promise.all(deletePromises);
      
      addToast(`${selectedDocuments?.length} ${activeTab === 'documents' ? 'document' : 'template'}${selectedDocuments?.length !== 1 ? 's' : ''} deleted successfully!`, 'success');
      
      // Reload data
      if (activeTab === 'documents') {
        loadDocuments();
      } else {
        loadTemplates();
      }
      
      setSelectedDocuments([]);
    } catch (error) {
      addToast('Failed to delete some items. Please try again.', 'error');
    }
  };

  const handleClearSelection = () => {
    setSelectedDocuments([]);
  };

  const handleQuickFilterChange = (filterId) => {
    setActiveQuickFilter(filterId);
    
    let filteredData;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    if (activeTab === 'documents') {
      const allDocs = getDocuments();
      
      switch (filterId) {
        case 'recent':
          filteredData = allDocs?.filter(doc => new Date(doc.createdDate) >= weekAgo);
          break;
        case 'drafts':
          filteredData = allDocs?.filter(doc => doc?.status === 'draft');
          break;
        case 'pending':
          filteredData = allDocs?.filter(doc => doc?.status === 'pending-review');
          break;
        case 'approved':
          filteredData = allDocs?.filter(doc => doc?.status === 'approved');
          break;
        case 'urgent':
          filteredData = allDocs?.filter(doc => doc?.priority === 'urgent');
          break;
        case 'this-month':
          filteredData = allDocs?.filter(doc => new Date(doc.createdDate) >= monthAgo);
          break;
        default:
          filteredData = allDocs;
      }
      
      setDocuments(filteredData);
    } else {
      const allTemplates = getTemplates();
      
      switch (filterId) {
        case 'recent':
          filteredData = allTemplates?.filter(template => new Date(template.createdDate) >= weekAgo);
          break;
        case 'active':
          filteredData = allTemplates?.filter(template => template?.status === 'active');
          break;
        case 'popular':
          filteredData = allTemplates?.sort((a, b) => (b?.usageCount || 0) - (a?.usageCount || 0));
          break;
        default:
          filteredData = allTemplates;
      }
      
      setTemplates(filteredData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      
      <main className={`transition-layout ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'} pt-16`}>
        <div className="p-3 sm:p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Document Library
                </h1>
                <p className="text-muted-foreground">
                  Manage your documents, templates, and healthcare records
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/document-creation-hub')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Icon name="Plus" size={18} />
                  <span className="hidden sm:inline">New Document</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-clinical border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Documents</p>
                  <p className="text-2xl font-bold text-primary">{documents?.length || 0}</p>
                </div>
                <Icon name="FileText" className="text-primary" size={24} />
              </div>
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-clinical border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Templates</p>
                  <p className="text-2xl font-bold text-accent">{templates?.length || 0}</p>
                </div>
                <Icon name="Layout" className="text-accent" size={24} />
              </div>
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-clinical border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Recent</p>
                  <p className="text-2xl font-bold text-warning">{recentCount}</p>
                </div>
                <Icon name="Clock" className="text-warning" size={24} />
              </div>
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-clinical border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Shared</p>
                  <p className="text-2xl font-bold text-secondary">{sharedCount}</p>
                </div>
                <Icon name="Users" className="text-secondary" size={24} />
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - Mobile Optimized */}
          <div className="mb-6">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search documents, templates, or content..."
            />
            
            {/* Mobile Quick Filters */}
            <div className="mt-4 block sm:hidden">
              <QuickFilters 
                activeFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                documentCounts={{
                  all: documents?.length + templates?.length,
                  documents: documents?.length,
                  templates: templates?.length,
                  recent: recentCount,
                  shared: sharedCount,
                  drafts: draftsCount
                }}
              />
            </div>
          </div>

          {/* Tab Navigation - Mobile Scrollable */}
          <div className="border-b border-border mb-4 sm:mb-6">
            <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <Icon name="FileText" size={16} className="inline mr-2" />
                Documents
                <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {documents?.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <Icon name="Layout" size={16} className="inline mr-2" />
                Template Library
                <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  6
                </span>
              </button>
            </nav>
          </div>

          {/* Mobile Quick Filters Toggle */}
          {activeTab === 'documents' && (
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full justify-between"
              >
                <span>Quick Filters</span>
                <Icon name={showMobileFilters ? 'ChevronUp' : 'ChevronDown'} size={16} />
              </Button>
              
              {showMobileFilters && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <QuickFilters 
                    activeFilter={activeQuickFilter}
                    onFilterChange={handleQuickFilterChange}
                    isMobile={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'documents' ? (
            <>
              <AdvancedFilters 
                isVisible={showAdvancedFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />

              <BulkOperationsToolbar 
                selectedCount={selectedDocuments?.length}
                onExport={handleBulkExport}
                onArchive={handleBulkArchive}
                onShare={handleBulkShare}
                onDelete={handleBulkDelete}
                onClearSelection={handleClearSelection}
              />

              <DocumentTable 
                documents={documents}
                selectedDocuments={selectedDocuments}
                onSelectDocument={handleSelectDocument}
                onSelectAll={handleSelectAll}
                onPreview={handlePreviewDocument}
                onEdit={handleEditDocument}
              />

              {/* Results Summary - Mobile Optimized */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
                <span>Showing {documents?.length} of {documents?.length} documents</span>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Per page:</span>
                  <select className="bg-background border border-border rounded px-2 py-1 text-foreground text-sm">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <TemplateLibrary />
          )}
        </div>
      </main>
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal 
        document={previewDocument}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onEdit={handleEditDocument}
      />
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default DocumentLibrary;