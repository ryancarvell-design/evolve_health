import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageArea = ({ conversation, onStartVideoCall }) => {
  const [newMessage, setNewMessage] = useState('');

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Select a Conversation
          </h3>
          <p className="text-muted-foreground">
            Choose a conversation from the list to start messaging your team.
          </p>
        </div>
      </div>
    );
  }

  const messages = [
    {
      id: 1,
      sender: 'Dr. Sarah Chen',
      senderInitials: 'SC',
      content: 'I\'ve reviewed the latest therapy notes for Patient J.D. The progress is looking very positive.',
      timestamp: '2025-08-26T02:00:00Z',
      isOwn: true,
      reactions: [{ emoji: '👍', count: 2 }]
    },
    {
      id: 2,
      sender: 'Mike Rodriguez',
      senderInitials: 'MR',
      content: 'Great to hear! I\'ve updated the treatment plan and uploaded it to the shared folder. Please review when you have a chance.',
      timestamp: '2025-08-26T02:15:00Z',
      isOwn: false,
      attachments: [
        { name: 'Treatment_Plan_Update_v2.pdf', size: '2.3 MB', type: 'pdf' }
      ]
    },
    {
      id: 3,
      sender: 'Lisa Park',
      senderInitials: 'LP',
      content: 'I can start implementing the new exercises tomorrow during our session. Should we schedule a quick call to discuss the details?',
      timestamp: '2025-08-26T02:30:00Z',
      isOwn: false
    }
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSendMessage = () => {
    if (newMessage?.trim()) {
      // Handle send message logic here
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {conversation?.title}
              </h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex -space-x-1 mr-3">
                  {conversation?.participants?.slice(0, 3)?.map((participant, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 border-2 border-background rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium"
                    >
                      {participant?.split(' ')?.map(n => n?.[0])?.join('')}
                    </div>
                  ))}
                  {conversation?.participants?.length > 3 && (
                    <div className="w-6 h-6 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs text-muted-foreground">
                      +{conversation?.participants?.length - 3}
                    </div>
                  )}
                </div>
                <span>{conversation?.participants?.length} participants</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Search" size={14} className="mr-1" />
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={onStartVideoCall}>
              <Icon name="Video" size={14} className="mr-1" />
              Video Call
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="MoreVertical" size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex space-x-3 ${message?.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center text-sm text-primary-foreground font-medium flex-shrink-0">
              {message?.senderInitials}
            </div>
            
            <div className="flex-1 max-w-2xl">
              <div className={`flex items-center space-x-2 mb-1 ${message?.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <span className="text-sm font-semibold text-foreground">
                  {message?.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(message?.timestamp)}
                </span>
              </div>
              
              <div className={`bg-card border border-border rounded-lg p-3 ${message?.isOwn ? 'bg-primary/5 border-primary/20' : ''}`}>
                <p className="text-sm text-foreground leading-relaxed">
                  {message?.content}
                </p>
                
                {/* Attachments */}
                {message?.attachments && (
                  <div className="mt-3 space-y-2">
                    {message?.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-background border border-border rounded-md p-2"
                      >
                        <Icon name="FileText" size={16} className="text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {attachment?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attachment?.size}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Icon name="Download" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Reactions */}
              {message?.reactions && (
                <div className="flex items-center space-x-2 mt-2">
                  {message?.reactions?.map((reaction, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-1 bg-muted hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-colors"
                    >
                      <span>{reaction?.emoji}</span>
                      <span className="text-muted-foreground">{reaction?.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Button variant="ghost" size="sm">
            <Icon name="Paperclip" size={14} />
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="Image" size={14} />
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="Smile" size={14} />
          </Button>
        </div>
        
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage?.trim()}>
            <Icon name="Send" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;