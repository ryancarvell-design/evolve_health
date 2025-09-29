import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceTranscriptionPanel = ({ isActive, onToggle }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [medicalTerms, setMedicalTerms] = useState([]);

  const mockTranscriptionText = `Patient presents with acute lower back pain radiating to the left leg. Pain began approximately 3 days ago following heavy lifting at work. Patient describes the pain as sharp and shooting, rated 7 out of 10 on the pain scale. Range of motion is limited in lumbar flexion and extension.`;

  const detectedMedicalTerms = [
    { term: 'acute', confidence: 95, suggestion: 'Confirmed medical term' },
    { term: 'radiating', confidence: 92, suggestion: 'Correct usage' },
    { term: 'lumbar flexion', confidence: 98, suggestion: 'Anatomical term verified' },
    { term: 'extension', confidence: 96, suggestion: 'Medical terminology confirmed' }
  ];

  useEffect(() => {
    if (isActive && isListening) {
      // Simulate real-time transcription
      const interval = setInterval(() => {
        const words = mockTranscriptionText?.split(' ');
        const currentLength = transcriptionText?.split(' ')?.length;
        if (currentLength < words?.length) {
          const nextWords = words?.slice(0, currentLength + 2)?.join(' ');
          setTranscriptionText(nextWords);
          setConfidence(Math.floor(Math.random() * 20) + 80);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, isListening, transcriptionText]);

  const handleStartListening = () => {
    setIsListening(true);
    setTranscriptionText('');
    setMedicalTerms([]);
  };

  const handleStopListening = () => {
    setIsListening(false);
    setMedicalTerms(detectedMedicalTerms);
  };

  const handleInsertText = () => {
    // This would insert the transcribed text into the main editor
    console.log('Inserting transcribed text:', transcriptionText);
  };

  const handleClearText = () => {
    setTranscriptionText('');
    setMedicalTerms([]);
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-card border border-border rounded-lg shadow-clinical-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Mic" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Voice Transcription</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Voice Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isListening ? (
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleStartListening}
              className="bg-primary hover:bg-primary/90"
            >
              <Icon name="Mic" size={20} className="mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              size="lg" 
              onClick={handleStopListening}
              className="bg-error hover:bg-error/90"
            >
              <Icon name="Square" size={20} className="mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        {/* Recording Status */}
        {isListening && (
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
            <span>Listening... Confidence: {confidence}%</span>
          </div>
        )}

        {/* Transcription Display */}
        {transcriptionText && (
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <h4 className="text-sm font-medium text-foreground mb-2">Transcribed Text</h4>
              <p className="text-sm text-foreground leading-relaxed">{transcriptionText}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="default" size="sm" onClick={handleInsertText} className="flex-1">
                <Icon name="Plus" size={16} className="mr-2" />
                Insert Text
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearText}>
                <Icon name="Trash2" size={16} className="mr-2" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Medical Terms Recognition */}
        {medicalTerms?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Medical Terms Detected</h4>
            <div className="space-y-2">
              {medicalTerms?.map((term, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-accent/10 rounded-md">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{term?.term}</span>
                    <div className="text-xs text-muted-foreground">{term?.suggestion}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-accent font-medium">{term?.confidence}%</span>
                    <Icon name="CheckCircle" size={14} className="text-success" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-muted/50 rounded-md">
          <h5 className="text-xs font-medium text-foreground mb-1">Tips for Better Recognition</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Use standard medical terminology</li>
            <li>• Pause between sentences for better accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceTranscriptionPanel;