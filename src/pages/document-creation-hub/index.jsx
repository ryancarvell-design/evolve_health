import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import TemplateSelector from './components/TemplateSelector';

const DocumentCreationHub = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCreateNewDocument = () => {
    navigate('/document-editor');
  };

  const handleUseTemplate = () => {
    setShowTemplateSelector(true);
  };

  const handleTemplateSelected = (template) => {
    const templateData = encodeURIComponent(JSON.stringify({
      id: template?.id,
      name: template?.name,
      content: template?.templateContent,
      sampleContent: template?.templateContent?.sampleContent
    }));
    navigate(`/document-editor?template=${templateData}`);
  };

  const handleCloseTemplateSelector = () => {
    setShowTemplateSelector(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      
      <main className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="min-h-screen flex flex-col">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Icon name="FileText" size={40} className="text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    Start Your Documentation
                  </h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    Choose how you'd like to begin your healthcare documentation. Create a blank document or use one of our professionally crafted templates.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Icon name="Clock" size={16} />
                    <span className="text-sm">Save time with templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Icon name="Shield" size={16} />
                    <span className="text-sm">HIPAA compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Icon name="Users" size={16} />
                    <span className="text-sm">Collaborative editing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-6xl mx-auto px-6 py-16">
            {/* Decision Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Create New Document Card */}
              <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200">
                <div className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6">
                    <Icon name="Plus" size={24} className="text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    Create New Document
                  </h2>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Start with a blank canvas and build your documentation from scratch. Perfect for unique cases or when you prefer complete creative control over your document structure.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="Edit3" size={16} className="text-emerald-500" />
                      <span>Rich text editor with formatting tools</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="Bot" size={16} className="text-emerald-500" />
                      <span>AI assistance for content generation</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="Mic" size={16} className="text-emerald-500" />
                      <span>Voice-to-text transcription</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="Users2" size={16} className="text-emerald-500" />
                      <span>Real-time collaboration</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateNewDocument}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Icon name="ArrowRight" size={18} className="mr-2" />
                    Start Fresh Document
                  </Button>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Use Existing Template Card */}
              <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200">
                <div className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6">
                    <Icon name="FileTemplate" size={24} className="text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    Use Existing Template
                  </h2>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Choose from our comprehensive library of healthcare templates. Pre-structured formats designed by clinical professionals to ensure compliance and thoroughness.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="CheckCircle2" size={16} className="text-blue-500" />
                      <span>Clinically validated templates</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="Clock" size={16} className="text-blue-500" />
                      <span>Save time with pre-filled sections</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="FileText" size={16} className="text-blue-500" />
                      <span>Sample clinical documentation included</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name="Target" size={16} className="text-blue-500" />
                      <span>Specialized by therapy discipline</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleUseTemplate}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Icon name="Library" size={18} className="mr-2" />
                    Browse Template Library
                  </Button>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Powerful Documentation Features
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our document editor is packed with features designed specifically for healthcare professionals
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Brain" size={24} className="text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Assistance</h4>
                  <p className="text-gray-600 text-sm">
                    Get intelligent suggestions for documentation, diagnosis coding, and treatment plans
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Mic" size={24} className="text-orange-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Voice Transcription</h4>
                  <p className="text-gray-600 text-sm">
                    Dictate your notes hands-free with accurate medical terminology recognition
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={24} className="text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                  <p className="text-gray-600 text-sm">
                    Work together with colleagues in real-time with secure sharing and commenting
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/document-library')}
                  className="text-gray-600 border-gray-300 hover:border-gray-400"
                >
                  <Icon name="FolderOpen" size={16} className="mr-2" />
                  View All Documents
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={handleCreateNewDocument}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 text-left group"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Icon name="FileText" size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Progress Note</div>
                    <div className="text-xs text-gray-500">Start blank note</div>
                  </div>
                </button>

                <button 
                  onClick={handleUseTemplate}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 text-left group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon name="Activity" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">PT Assessment</div>
                    <div className="text-xs text-gray-500">From template</div>
                  </div>
                </button>

                <button 
                  onClick={handleUseTemplate}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 text-left group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Icon name="Users" size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">OT Evaluation</div>
                    <div className="text-xs text-gray-500">From template</div>
                  </div>
                </button>

                <button 
                  onClick={handleUseTemplate}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 text-left group"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Icon name="MessageCircle" size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Speech Eval</div>
                    <div className="text-xs text-gray-500">From template</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onTemplateSelect={handleTemplateSelected}
          onClose={handleCloseTemplateSelector}
        />
      )}
    </div>
  );
};

export default DocumentCreationHub;