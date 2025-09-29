import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateDocumentSuggestions, adjustDocumentTone, generateDocumentSummary } from '../../../services/aiServices';

const AIAssistantPanel = ({ isVisible, onToggle, documentContent = '' }) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [toneAdjustment, setToneAdjustment] = useState('professional');
  const [suggestions, setSuggestions] = useState([]);
  const [summaryData, setSummaryData] = useState({
    wordCount: 0,
    readingTime: '0 min',
    keyPoints: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal medical terminology' },
    { value: 'conversational', label: 'Conversational', description: 'Patient-friendly language' },
    { value: 'technical', label: 'Technical', description: 'Detailed clinical language' },
    { value: 'concise', label: 'Concise', description: 'Brief and to the point' }
  ];

  useEffect(() => {
    if (documentContent && activeTab === 'suggestions') {
      generateSuggestions();
    }
  }, [documentContent, activeTab]);

  useEffect(() => {
    if (documentContent && activeTab === 'summary') {
      generateSummary();
    }
  }, [activeTab]);

  const generateSuggestions = async () => {
    if (!documentContent?.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const aiSuggestions = await generateDocumentSuggestions(documentContent, 'therapy');
      setSuggestions(aiSuggestions?.slice(0, 5) || []);
    } catch (err) {
      setError('Failed to generate suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!documentContent?.trim()) {
      setSummaryData({ wordCount: 0, readingTime: '0 min', keyPoints: [] });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const summary = await generateDocumentSummary(documentContent);
      setSummaryData(summary);
    } catch (err) {
      setError('Failed to generate summary');
      setSummaryData({
        wordCount: documentContent?.split(/\s+/)?.length || 0,
        readingTime: Math.ceil((documentContent?.split(/\s+/)?.length || 0) / 200) + ' min',
        keyPoints: ['Unable to generate summary at this time']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTone = async () => {
    if (!documentContent?.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const adjustedContent = await adjustDocumentTone(documentContent, toneAdjustment);
      console.log('Adjusted content:', adjustedContent);
    } catch (err) {
      setError('Failed to adjust tone');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestionId) => {
    setSuggestions(prev => prev?.filter(s => s?.id !== suggestionId));
  };

  const dismissSuggestion = (suggestionId) => {
    setSuggestions(prev => prev?.filter(s => s?.id !== suggestionId));
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="flex mt-3 bg-muted rounded-md p-1">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-3 py-1 text-sm rounded transition-clinical ${
              activeTab === 'suggestions' ?'bg-card text-foreground shadow-clinical' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Suggestions
          </button>
          <button
            onClick={() => setActiveTab('tone')}
            className={`flex-1 px-3 py-1 text-sm rounded transition-clinical ${
              activeTab === 'tone' ?'bg-card text-foreground shadow-clinical' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tone
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 px-3 py-1 text-sm rounded transition-clinical ${
              activeTab === 'summary' ?'bg-card text-foreground shadow-clinical' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Summary
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'suggestions' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">AI Suggestions</h4>
              <div className="flex items-center space-x-2">
                {loading && <Icon name="Loader2" size={12} className="animate-spin text-muted-foreground" />}
                <span className="text-xs text-muted-foreground">{suggestions?.length} suggestions</span>
              </div>
            </div>
            
            {!documentContent?.trim() && (
              <div className="text-center text-muted-foreground text-sm py-8">
                Start typing to get AI suggestions
              </div>
            )}

            {suggestions?.map((suggestion, index) => (
              <div key={index} className="p-3 bg-muted rounded-md">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    suggestion?.type === 'grammar' ? 'bg-yellow-100 text-yellow-800' :
                    suggestion?.type === 'medical' ? 'bg-blue-100 text-blue-800' :
                    suggestion?.type === 'structure'? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {suggestion?.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{suggestion?.position}</span>
                </div>
                <p className="text-sm text-foreground mb-3">{suggestion?.text}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="xs" onClick={() => applySuggestion(index)}>
                    Apply
                  </Button>
                  <Button variant="ghost" size="xs" onClick={() => dismissSuggestion(index)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tone' && (
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-foreground">Tone Adjustment</h4>
            
            <div className="space-y-3">
              {toneOptions?.map((option) => (
                <label key={option?.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tone"
                    value={option?.value}
                    checked={toneAdjustment === option?.value}
                    onChange={(e) => setToneAdjustment(e?.target?.value)}
                    className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{option?.label}</div>
                    <div className="text-xs text-muted-foreground">{option?.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <Button 
              variant="default" 
              size="sm" 
              className="w-full mt-4" 
              onClick={handleApplyTone}
              disabled={loading || !documentContent?.trim()}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Adjusting...
                </>
              ) : (
                <>
                  <Icon name="Wand2" size={16} className="mr-2" />
                  Apply Tone Adjustment
                </>
              )}
            </Button>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Document Summary</h4>
              {loading && <Icon name="Loader2" size={12} className="animate-spin text-muted-foreground" />}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-md text-center">
                <div className="text-lg font-semibold text-foreground">{summaryData?.wordCount}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="p-3 bg-muted rounded-md text-center">
                <div className="text-lg font-semibold text-foreground">{summaryData?.readingTime}</div>
                <div className="text-xs text-muted-foreground">Reading Time</div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-foreground mb-3">Key Points</h5>
              <ul className="space-y-2">
                {summaryData?.keyPoints?.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="Circle" size={4} className="mt-2 text-primary" />
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={generateSummary}
              disabled={loading || !documentContent?.trim()}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Regenerate Summary
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPanel;