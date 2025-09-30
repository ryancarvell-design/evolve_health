import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { getPatients } from '../../../utils/patientRegistry';
import TipTapEditor from '../../../components/ui/TipTapEditor';

const RichTextEditor = ({
  content = '',
  onChange,
  onSelectionChange,
  templateSections,
  isA4Format = true,
  isMobile = false,
  isTablet = false,
  onElementInsert
}) => {
  const [currentFormat, setCurrentFormat] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [patients, setPatients] = useState([]);
  const [showTemplateHelper, setShowTemplateHelper] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState('');

  // New state for editor mode
  const [editorMode, setEditorMode] = useState('tiptap'); // 'tiptap' or 'classic'

  // Keep existing document types array
  const documentTypes = [
    'General Progress Note',
    'Consultation Report', 
    'Discharge Summary',
    'Procedure Note',
    'H&P (History & Physical)',
    'Operative Report',
    'Lab Report Analysis',
    'Radiology Report',
    'Treatment Plan',
    'Care Plan',
    'Medication Review',
    'Follow-up Note',
    'Referral Letter',
    'Insurance Authorization',
    'Patient Education Material',
    'Physical Therapy Assessment',
    'Occupational Therapy Evaluation',
    'Speech Language Assessment',
    'Mental Health Screening',
    'Initial Evaluation',
    'Nursing Assessment',
    'Dietitian Consultation'
  ];

  // Load patients on component mount
  useEffect(() => {
    const patientData = getPatients();
    setPatients(patientData);
  }, []);

  // Update word and character counts whenever content changes
  useEffect(() => {
    if (content) {
      const words = content?.trim()?.split(/\s+/)?.filter(word => word?.length > 0);
      setWordCount(words?.length);
      const plainText = content?.replace(/<[^>]*>/g, '');
      setCharacterCount(plainText?.length);
    } else {
      setWordCount(0);
      setCharacterCount(0);
    }
  }, [content]);

  // Show template helper if template sections are available
  useEffect(() => {
    if (templateSections && templateSections?.length > 0) {
      setShowTemplateHelper(true);
      const timer = setTimeout(() => {
        setShowTemplateHelper(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [templateSections]);

  const handlePatientSelect = (e) => {
    const selectedPatientId = e?.target?.value;
    const patient = patients?.find(p => p?.id === selectedPatientId);
    setSelectedPatient(patient);
    
    if (patient && onChange) {
      onChange?.(content || '', {
        patientInfo: {
          id: patient?.id,
          name: `${patient?.firstName} ${patient?.lastName}`,
          dob: patient?.dateOfBirth,
          mrn: patient?.mrn,
          patientId: patient?.patientId,
          selectedAt: new Date()?.toISOString()
        }
      });
    }
  };

  const handleDocumentTypeSelect = (e) => {
    const selectedType = e?.target?.value;
    setSelectedDocumentType(selectedType);
    
    if (selectedType && onChange) {
      onChange?.(content || '', {
        documentType: selectedType,
        selectedAt: new Date()?.toISOString()
      });
    }
  };

  const insertTemplateSection = (section) => {
    let sectionContent = `\n## ${section?.title}\n\n`;
    
    section?.fields?.forEach(field => {
      if (field?.type === 'textarea') {
        sectionContent += `**${field?.label}${field?.required ? ' *' : ''}:**\n`;
        sectionContent += `${field?.placeholder || '[Enter information here]'}\n\n`;
      } else if (field?.type === 'select') {
        sectionContent += `**${field?.label}${field?.required ? ' *' : ''}:**\n`;
        sectionContent += `[ ] ${field?.options?.join('\n[ ] ') || '[Select option]'}\n\n`;
      } else {
        sectionContent += `**${field?.label}${field?.required ? ' *' : ''}:** ${field?.placeholder || '[Enter information]'}\n\n`;
      }
    });
    
    sectionContent += '---\n\n';
    
    const newContent = (content || '') + sectionContent;
    onChange?.(newContent);
  };

  // Enhanced content change handler for TipTap
  const handleTipTapChange = (newContent) => {
    onChange?.(newContent);
  };

  const handleTipTapSelection = (selectedText) => {
    setSelectedText(selectedText);
    onSelectionChange?.(selectedText);
  };

  return (
    <div className={`flex flex-col h-full ${isA4Format ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Enhanced Editor Controls */}
      <div className="border-b border-gray-200 p-3 sm:p-4 bg-gray-50">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Editor Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setEditorMode('tiptap')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  editorMode === 'tiptap' ?'bg-blue-600 text-white' :'text-gray-600 hover:bg-gray-200'
                }`}
              >
                TipTap (Modern)
              </button>
              <button
                onClick={() => setEditorMode('classic')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  editorMode === 'classic' ?'bg-blue-600 text-white' :'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Classic
              </button>
            </div>
          </div>
          
          {/* Word and Character Counters */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs sm:text-sm">
              <Icon name="FileText" size={12} className="text-blue-600" />
              <span className="text-blue-700 font-medium">
                <strong>{wordCount}</strong> words
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs sm:text-sm">
              <Icon name="Type" size={12} className="text-green-600" />
              <span className="text-green-700 font-medium">
                <strong>{characterCount}</strong> chars
              </span>
            </div>
          </div>
        </div>

        {/* Patient and Document Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPatient?.id || ''}
              onChange={handlePatientSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">Choose a patient...</option>
              {patients?.map((patient) => (
                <option key={patient?.id} value={patient?.id}>
                  {patient?.firstName} {patient?.lastName} - MRN: {patient?.mrn}
                </option>
              ))}
            </select>
            {selectedPatient && (
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Patient ID:</strong> {selectedPatient?.patientId}</p>
                <p><strong>Date of Birth:</strong> {selectedPatient?.dateOfBirth}</p>
                <p><strong>MRN:</strong> {selectedPatient?.mrn}</p>
              </div>
            )}
          </div>

          {/* Document Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDocumentType}
              onChange={handleDocumentTypeSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">Select document type...</option>
              {documentTypes?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Helper */}
        {showTemplateHelper && templateSections && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Icon name="Sparkles" size={12} className="text-white" />
                </div>
                <h4 className="text-sm font-semibold text-blue-900">Template Sections Available</h4>
              </div>
              <button
                onClick={() => setShowTemplateHelper(false)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {templateSections?.map((section, index) => (
                <button
                  key={index}
                  onClick={() => insertTemplateSection(section)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 text-sm rounded-full border border-blue-200 hover:bg-blue-100 transition-colors duration-200 shadow-sm"
                >
                  <Icon name="Plus" size={14} />
                  Add {section?.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor Content - Conditional Rendering */}
      <div className="flex-1 relative">
        {editorMode === 'tiptap' ? (
          <TipTapEditor
            content={content}
            onChange={handleTipTapChange}
            onSelectionChange={handleTipTapSelection}
            isMobile={isMobile}
            className="h-full"
          />
        ) : (
          <div className={`h-full ${isA4Format ? 'p-12' : 'p-6'}`}>
            <textarea
              value={content || ''}
              onChange={(e) => onChange?.(e?.target?.value)}
              onSelect={(e) => {
                const selection = e?.target?.selectionStart !== e?.target?.selectionEnd 
                  ? e?.target?.value?.substring(e?.target?.selectionStart, e?.target?.selectionEnd)
                  : '';
                setSelectedText(selection);
                onSelectionChange?.(selection);
              }}
              className={`w-full h-full border-0 resize-none focus:outline-none bg-transparent ${
                isA4Format 
                  ? 'text-base leading-7 font-serif' 
                  : 'text-sm leading-relaxed font-mono'
              }`}
              placeholder={
                templateSections 
                  ? "Your template has been loaded. Start editing or add more sections using the helper above..." :"Start writing your document..."
              }
              style={{ 
                minHeight: isA4Format ? '265mm' : '100%',
                fontFamily: isA4Format ? 'Georgia, "Times New Roman", serif' : 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace'
              }}
            />
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="border-t border-gray-200 px-3 sm:px-4 py-2 bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Mode: <strong className="text-gray-900">{editorMode === 'tiptap' ? 'TipTap' : 'Classic'}</strong></span>
            <span>Document: <strong className="text-gray-900">{selectedDocumentType || 'Not selected'}</strong></span>
            {selectedPatient && (
              <span>Patient: <strong className="text-gray-900">{selectedPatient?.firstName} {selectedPatient?.lastName}</strong></span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Words: <strong className="text-gray-900">{wordCount}</strong></span>
            <span>Characters: <strong className="text-gray-900">{characterCount}</strong></span>
            <span className="text-green-600">● {editorMode === 'tiptap' ? 'AI-Enhanced' : 'Auto-save'} enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;