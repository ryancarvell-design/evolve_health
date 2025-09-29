import React, { useState, useRef, useEffect } from 'react';

import Icon from '../../../components/AppIcon';
import { getPatients } from '../../../utils/patientRegistry';

const RichTextEditor = ({
  content = '',
  onChange,
  onSelectionChange,
  templateSections,
  isA4Format = true,
  isMobile = false,
  isTablet = false,
  onElementInsert // Add this new prop
}) => {
  const editorRef = useRef(null);
  const [currentFormat, setCurrentFormat] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Patient selection states - added per requirements
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [patients, setPatients] = useState([]);

  // Add missing state declarations
  const [showTemplateHelper, setShowTemplateHelper] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState('');

  // Document types for healthcare - Enhanced per requirements
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

  // Update word and character counts whenever content changes - Enhanced per requirements
  useEffect(() => {
    if (content) {
      // Count words (split by spaces and filter empty strings)
      const words = content?.trim()?.split(/\s+/)?.filter(word => word?.length > 0);
      setWordCount(words?.length);
      
      // Count characters (excluding HTML tags if any)
      const plainText = content?.replace(/<[^>]*>/g, '');
      setCharacterCount(plainText?.length);
      
      // Update counters in document header if they exist
      const wordCounterElement = document.getElementById('word-counter');
      const charCounterElement = document.getElementById('character-counter');
      
      if (wordCounterElement) {
        wordCounterElement.textContent = words?.length?.toString();
      }
      if (charCounterElement) {
        charCounterElement.textContent = plainText?.length?.toString();
      }
    } else {
      setWordCount(0);
      setCharacterCount(0);
      
      // Reset counters in document header
      const wordCounterElement = document.getElementById('word-counter');
      const charCounterElement = document.getElementById('character-counter');
      
      if (wordCounterElement) {
        wordCounterElement.textContent = '0';
      }
      if (charCounterElement) {
        charCounterElement.textContent = '0';
      }
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

  // Initialize with template content or placeholder
  useEffect(() => {
    if (content && editorRef?.current) {
      editorRef.current.value = content;
      updateWordCount(content);
    } else if (!content && !editorRef?.current?.value) {
      const placeholderContent = templateSections 
        ? "Your template has been loaded. Start editing or add more sections using the helper above..." :"Start writing your document...";
      setDocumentContent(placeholderContent);
    }
  }, [content, templateSections]);

  const setDocumentContent = (newContent) => {
    if (editorRef?.current) {
      editorRef.current.value = newContent;
      updateWordCount(newContent);
      onChange?.(newContent);
    }
  };

  const updateWordCount = (text) => {
    const plainText = text?.replace(/<[^>]*>/g, '') || '';
    const words = plainText?.trim()?.split(/\s+/)?.filter(word => word?.length > 0);
    const chars = plainText?.length;
    
    setWordCount(words?.length || 0);
    setCharacterCount(chars);
    
    // Estimate page count (approximate 250 words per page)
    const estimatedPages = Math.max(1, Math.ceil((words?.length || 0) / 250));
    setCurrentPage(estimatedPages);
  };

  const handleInput = (e) => {
    const content = e?.target?.value;
    updateWordCount(content);
    onChange?.(content);
  };

  const handleSelection = (e) => {
    const selection = e?.target?.selectionStart !== e?.target?.selectionEnd 
      ? e?.target?.value?.substring(e?.target?.selectionStart, e?.target?.selectionEnd)
      : '';
    setSelectedText(selection);
    onSelectionChange?.(selection);
  };

  const handlePatientSelect = (e) => {
    const selectedPatientId = e?.target?.value;
    const patient = patients?.find(p => p?.id === selectedPatientId);
    setSelectedPatient(patient);
    
    // Call parent onChange to save metadata
    if (patient && onChange) {
      // This will trigger the metadata save through the parent component
      const currentContent = editorRef?.current?.value || content || '';
      onChange?.(currentContent, {
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
    
    // Call parent onChange to save metadata
    if (selectedType && onChange) {
      const currentContent = editorRef?.current?.value || content || '';
      onChange?.(currentContent, {
        documentType: selectedType,
        selectedAt: new Date()?.toISOString()
      });
    }
  };

  // Add method to handle element insertion
  const insertElement = (elementText) => {
    if (editorRef?.current) {
      const editor = editorRef?.current;
      const currentContent = editor?.innerHTML || '';
      const selection = window?.getSelection();
      
      if (selection && selection?.rangeCount > 0) {
        const range = selection?.getRangeAt(0);
        const textNode = document?.createTextNode(elementText);
        range?.insertNode(textNode);
        
        // Move cursor after inserted text
        range?.setStartAfter(textNode);
        range?.setEndAfter(textNode);
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        // Trigger onChange with updated content
        onChange?.(editor?.innerHTML, { type: 'insert', element: elementText });
      } else {
        // If no selection, append to end
        const newContent = currentContent + elementText;
        editor.innerHTML = newContent;
        onChange?.(newContent, { type: 'insert', element: elementText });
      }
    }
  };

  // Expose insertElement method via ref or callback
  useEffect(() => {
    if (onElementInsert) {
      // Store the insert function for external use
      window.documentEditorInsertElement = insertElement;
    }
  }, [onElementInsert]);

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
    setDocumentContent(newContent);
  };

  const insertQuickTemplate = (templateType) => {
    const templates = {
      header: `# Document Title\n\n**Date:** ${new Date()?.toLocaleDateString()}\n**Author:** [Your Name]\n\n---\n\n`,
      section: `## Section Title\n\n[Section content goes here...]\n\n`,
      list: `### Key Points:\n\n- Point 1\n- Point 2\n- Point 3\n\n`,
      table: `| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |\n\n`,
      signature: `\n---\n\n**Signature:** ________________________\n\n**Name:** [Print Name]\n\n**Title:** [Title]\n\n**Date:** ${new Date()?.toLocaleDateString()}\n`
    };

    const templateContent = templates?.[templateType] || '';
    const newContent = (content || '') + templateContent;
    setDocumentContent(newContent);
  };

  return (
    <div className={`flex flex-col h-full ${isA4Format ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Enhanced Editor Controls - Patient & Document Type Selection per requirements */}
      <div className="border-b border-gray-200 p-3 sm:p-4 bg-gray-50">
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

          {/* Document Type Selection - Enhanced per requirements */}
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

        {/* Formatting Toolbar - Mobile Optimized */}
        
        {/* Enhanced Word and Character Counters - Made functional per requirements */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
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

        {/* Show template helper if template sections are available */}
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
      {/* Main Editor Area */}
      <div className="flex-1 relative">
        <div className={`h-full ${isA4Format ? 'p-12' : 'p-6'}`}>
          <textarea
            ref={editorRef}
            value={content || ''}
            onChange={handleInput}
            onSelect={handleSelection}
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
      </div>
      {/* Enhanced Status Bar - Updated per requirements */}
      <div className="border-t border-gray-200 px-3 sm:px-4 py-2 bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Document: <strong className="text-gray-900">{selectedDocumentType || 'Not selected'}</strong></span>
            {selectedPatient && (
              <span>Patient: <strong className="text-gray-900">{selectedPatient?.firstName} {selectedPatient?.lastName}</strong></span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Words: <strong className="text-gray-900">{wordCount}</strong></span>
            <span>Characters: <strong className="text-gray-900">{characterCount}</strong></span>
            <span className="text-green-600">● Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;