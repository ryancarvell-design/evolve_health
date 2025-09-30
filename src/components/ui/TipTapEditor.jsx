import React, { useRef, useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import html2pdf from 'html2pdf.js';
import * as pdfjsLib from 'pdfjs-dist';

import Icon from '../AppIcon';
import { generateText, adjustDocumentTone } from '../../services/aiServices';
import DocumentUploader from './DocumentUploader';
import PDFDocumentEditor from './PDFDocumentEditor';
import documentService from '../../services/documentService';
import { useAuth } from '../../contexts/AuthContext';

// Configure PDF.js worker
const initializePDFJS = () => {
  if (typeof window !== 'undefined' && !pdfjsLib?.GlobalWorkerOptions?.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }
};

const TipTapEditor = ({ 
  content = '', 
  onChange, 
  onSelectionChange,
  isMobile = false,
  className = '' 
}) => {
  const { user } = useAuth();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Enhanced state management
  const [isLoading, setIsLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Document management state
  const [showUploader, setShowUploader] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [showDocumentList, setShowDocumentList] = useState(false);
  const [mode, setMode] = useState('editor'); // 'editor', 'uploader', 'document'

  // Initialize PDF.js on component mount
  useEffect(() => {
    initializePDFJS();
  }, []);

  // Load user documents
  const loadUserDocuments = async () => {
    if (!user) return;
    
    try {
      const documents = await documentService?.getUserDocuments();
      setUserDocuments(documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserDocuments();
    }
  }, [user]);

  // TipTap Editor with enhanced configuration
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || `
      <div class='welcome-message'>
        <h2>🏥 Professional Document Editor</h2>
        <p>Create, edit, and manage your healthcare documents with full PDF functionality.</p>
        <div class='feature-highlights'>
          <h3>✨ Features:</h3>
          <ul>
            <li><strong>📄 PDF Processing:</strong> Upload and edit PDF documents with backend processing</li>
            <li><strong>🤖 AI Integration:</strong> AI-powered content enhancement and suggestions</li>
            <li><strong>💾 Version Control:</strong> Track changes and maintain document history</li>
            <li><strong>🔐 Secure Storage:</strong> HIPAA-compliant document management</li>
            <li><strong>⚡ Real-time:</strong> Collaborative editing with live updates</li>
          </ul>
        </div>
        <p><em>Click "Upload Document" to get started with PDF processing, or continue writing below.</em></p>
      </div>
    `,
    onUpdate: ({ editor }) => {
      const html = editor?.getHTML();
      onChange?.(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor?.state?.selection || {};
      if (from !== undefined && to !== undefined) {
        const selectedText = editor?.state?.doc?.textBetween(from, to) || '';
        onSelectionChange?.(selectedText);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6',
        style: 'font-family: Georgia, "Times New Roman", serif; line-height: 1.7;'
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor?.getHTML()) {
      editor?.commands?.setContent(content);
    }
  }, [content, editor]);

  // Handle document upload complete
  const handleUploadComplete = (document) => {
    setCurrentDocument(document);
    setMode('document');
    setShowUploader(false);
    loadUserDocuments(); // Refresh document list
  };

  // Handle document selection
  const handleDocumentSelect = (document) => {
    setCurrentDocument(document);
    setMode('document');
    setShowDocumentList(false);
  };

  // Handle document close
  const handleCloseDocument = () => {
    setCurrentDocument(null);
    setMode('editor');
  };

  // Legacy PDF upload handler (keeping for backward compatibility)
  const handlePDFUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Enhanced file validation
    if (file?.type !== 'application/pdf') {
      const error = '⚠️ Please select a valid PDF file. Use the new uploader for better processing.';
      setErrorMessage(error);
      return;
    }

    if (file?.size > 25 * 1024 * 1024) {
      const error = '⚠️ File size too large. Please use the document uploader for files over 25MB.';
      setErrorMessage(error);
      return;
    }

    // Suggest using the new uploader
    const useNewUploader = confirm(
      'For better PDF processing and editing capabilities, would you like to use our enhanced document uploader instead?'
    );

    if (useNewUploader) {
      setMode('uploader');
      return;
    }

    // Keep legacy processing for backward compatibility
    setIsLoading(true);
    try {
      // Legacy PDF processing code here (simplified)
      setTimeout(() => {
        setIsLoading(false);
        if (editor) {
          editor?.commands?.setContent(`
            <div class="legacy-pdf-notice">
              <h3>📄 PDF Uploaded (Legacy Mode)</h3>
              <p><strong>File:</strong> ${file?.name}</p>
              <p><strong>Size:</strong> ${(file?.size / 1024 / 1024)?.toFixed(2)}MB</p>
              <p><em>For full PDF editing capabilities, please use the new document uploader.</em></p>
              <hr>
              <p>Continue editing below:</p>
            </div>
          `);
        }
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(`Legacy PDF processing failed: ${error?.message}`);
    }

    // Reset file input
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  // AI functions (keeping existing functionality)
  const rewriteWithAI = async (tone = 'professional') => {
    if (!editor) return;
    const text = editor?.getText();
    
    if (!text?.trim() || text?.length < 10) {
      alert('Please write some content first before using AI rewrite.');
      return;
    }

    setIsAiProcessing(true);
    try {
      let aiSuggestion;
      if (tone === 'professional') {
        aiSuggestion = await adjustDocumentTone(text, 'professional');
      } else {
        const prompt = `Please rewrite the following text to be clearer, more professional, and well-structured while maintaining the original meaning and key information:\n\n${text}\n\nRewritten text:`;
        aiSuggestion = await generateText(prompt);
      }

      if (aiSuggestion) {
        editor?.commands?.setContent(`<p>${aiSuggestion}</p>`);
      }
    } catch (error) {
      console.error('AI rewrite failed:', error);
      alert('AI rewrite failed. Please try again.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const getAISuggestions = async () => {
    if (!editor) return;
    const text = editor?.getText();
    
    if (!text?.trim() || text?.length < 10) {
      alert('Please write some content first before getting AI suggestions.');
      return;
    }

    try {
      const prompt = `Please provide 3-5 specific suggestions to improve the following document. Focus on:\n- Grammar and clarity\n- Structure and flow\n- Professional tone\n- Missing information that might be helpful\n\nDocument:\n${text?.substring(0, 1000)}...\n\nSuggestions:`;
      const suggestions = await generateText(prompt);
      
      const suggestionModal = document.createElement('div');
      suggestionModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div style="background: white; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; border-radius: 12px; padding: 30px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">🤖 AI Suggestions</h3>
              <button onClick="this.closest('div').parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
            </div>
            <div style="white-space: pre-wrap; line-height: 1.6; color: #374151; font-size: 14px;">${suggestions}</div>
            <div style="margin-top: 20px; text-align: right;">
              <button onClick="this.closest('div').parentElement.remove()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">Close</button>
            </div>
          </div>
        </div>
      `;
      document.body?.appendChild(suggestionModal);
    } catch (error) {
      console.error('AI suggestions failed:', error);
      alert('Failed to get AI suggestions. Please try again.');
    }
  };

  const exportPDF = () => {
    if (!editor) return;
    const html = editor?.getHTML();
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Georgia, 'Times New Roman', serif; line-height: 1.7;">
        ${html}
      </div>
    `;

    const options = {
      margin: [15, 10, 15, 10],
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()?.from(element)?.set(options)?.save();
  };

  const formatText = (format) => {
    if (!editor) return;

    switch (format) {
      case 'bold': editor?.chain()?.focus()?.toggleBold()?.run(); break;
      case 'italic': editor?.chain()?.focus()?.toggleItalic()?.run(); break;
      case 'heading1': editor?.chain()?.focus()?.toggleHeading({ level: 1 })?.run(); break;
      case 'heading2': editor?.chain()?.focus()?.toggleHeading({ level: 2 })?.run(); break;
      case 'heading3': editor?.chain()?.focus()?.toggleHeading({ level: 3 })?.run(); break;
      case 'bulletList': editor?.chain()?.focus()?.toggleBulletList()?.run(); break;
      case 'orderedList': editor?.chain()?.focus()?.toggleOrderedList()?.run(); break;
      case 'blockquote': editor?.chain()?.focus()?.toggleBlockquote()?.run(); break;
      case 'code': editor?.chain()?.focus()?.toggleCode()?.run(); break;
      default: break;
    }
  };

  const clearContent = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      editor?.commands?.setContent(`
        <div class='welcome-message'>
          <h2>🏥 Professional Document Editor</h2>
          <p>Create, edit, and manage your healthcare documents with full PDF functionality.</p>
          <p><em>Click "Upload Document" to get started with PDF processing, or continue writing below.</em></p>
        </div>
      `);
      setCurrentDocument(null);
      setMode('editor');
    }
  };

  // Render different modes
  if (mode === 'uploader') {
    return (
      <div className={`flex flex-col h-full bg-white ${className}`}>
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
            <button
              onClick={() => setMode('editor')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <DocumentUploader
            onUploadComplete={handleUploadComplete}
            className="h-full"
          />
        </div>
      </div>
    );
  }

  if (mode === 'document' && currentDocument) {
    return (
      <PDFDocumentEditor
        documentId={currentDocument?.id}
        onClose={handleCloseDocument}
        className={className}
      />
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Enhanced Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {/* Document Operations */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => setMode('uploader')}
              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              title="Upload Document - Advanced PDF processing with full editing capabilities"
            >
              <Icon name="Upload" size={14} />
              {!isMobile && 'Upload Document'}
            </button>
            
            {user && (
              <button
                onClick={() => setShowDocumentList(!showDocumentList)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                title="View Your Documents"
              >
                <Icon name="Folder" size={14} />
                {!isMobile && 'My Documents'}
              </button>
            )}
            
            {/* Legacy PDF Upload (hidden/deprecated) */}
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              ref={fileInputRef}
              className="hidden"
            />
            
            <button
              onClick={clearContent}
              disabled={isLoading}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
              title="Clear Content"
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button onClick={() => formatText('bold')} className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`} title="Bold">
              <Icon name="Bold" size={16} />
            </button>
            <button onClick={() => formatText('italic')} className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`} title="Italic">
              <Icon name="Italic" size={16} />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => formatText('heading1')}
              className={`px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors font-medium ${
                editor?.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => formatText('heading2')}
              className={`px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors font-medium ${
                editor?.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => formatText('heading3')}
              className={`px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors font-medium ${
                editor?.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists and Blocks */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => formatText('bulletList')}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Bullet List"
            >
              <Icon name="List" size={16} />
            </button>
            <button
              onClick={() => formatText('orderedList')}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Numbered List"
            >
              <Icon name="ListOrdered" size={16} />
            </button>
            <button
              onClick={() => formatText('blockquote')}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor?.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Quote"
            >
              <Icon name="Quote" size={16} />
            </button>
          </div>

          {/* AI Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => rewriteWithAI('professional')}
              disabled={isAiProcessing}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Icon name="Sparkles" size={14} />
              {isAiProcessing ? 'AI Working...' : (!isMobile && 'AI Rewrite')}
            </button>
            
            <button
              onClick={getAISuggestions}
              className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Icon name="Lightbulb" size={14} />
              {!isMobile && <span>Suggestions</span>}
            </button>
            
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Icon name="FileDown" size={14} />
              {!isMobile && <span>Export PDF</span>}
            </button>
          </div>
        </div>

        {/* Document List Dropdown */}
        {showDocumentList && userDocuments?.length > 0 && (
          <div className="mt-2 absolute top-full left-4 right-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <h4 className="font-medium text-gray-900 mb-2">Your Documents</h4>
              {userDocuments?.map((doc) => (
                <button
                  key={doc?.id}
                  onClick={() => handleDocumentSelect(doc)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-3"
                >
                  <Icon name="FileText" size={16} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{doc?.title}</p>
                    <p className="text-xs text-gray-500">
                      {doc?.page_count} pages • {doc?.status}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {errorMessage && (
          <div className="mt-2 px-3 py-2 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <Icon name="AlertCircle" size={16} />
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="ml-auto">
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative" ref={editorRef}>
        <EditorContent editor={editor} className="h-full overflow-auto" />
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Words: <strong>{editor?.getText()?.split(/\s+/)?.filter(word => word?.length > 0)?.length || 0}</strong></span>
            <span>Characters: <strong>{editor?.getText()?.length || 0}</strong></span>
            {user && <span className="text-green-600">Supabase Connected</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${errorMessage ? 'bg-red-500' : isLoading ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span>{errorMessage ? 'Error' : isLoading ? 'Processing' : 'Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;