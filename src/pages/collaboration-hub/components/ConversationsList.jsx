import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationsList = ({ onSelectConversation, selectedConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      title: 'Patient J.D. - Therapy Team',
      participants: ['Dr. Sarah Chen', 'Mike Rodriguez', 'Lisa Park'],
      lastMessage: 'Updated treatment plan uploaded to shared folder',
      timestamp: '2025-08-26T02:30:00Z',
      isPrivate: false,
      unreadCount: 3,
      priority: 'high',
      tags: ['PT', 'Review']
    },
    {
      id: 2,
      title: 'Weekly Team Standup',
      participants: ['Dr. Sarah Chen', 'Mike Rodriguez', 'Lisa Park', 'James Wilson', 'Emma Davis'],
      lastMessage: 'See you all at 2 PM for our weekly standup meeting',
      timestamp: '2025-08-26T01:15:00Z',
      isPrivate: false,
      unreadCount: 0,
      priority: 'medium',
      tags: ['Meeting']
    },
    {
      id: 3,
      title: 'Patient M.S. - Speech Therapy',
      participants: ['Dr. Sarah Chen', 'Lisa Park'],
      lastMessage: 'Patient showing great progress with new exercises',
      timestamp: '2025-08-25T16:45:00Z',
      isPrivate: true,
      unreadCount: 1,
      priority: 'low',
      tags: ['Speech', 'Progress']
    },
    {
      id: 4,
      title: 'Emergency Protocol Update',
      participants: ['Dr. Sarah Chen', 'Mike Rodriguez', 'James Wilson', 'Emma Davis'],
      lastMessage: 'New HIPAA compliance guidelines have been updated',
      timestamp: '2025-08-25T14:20:00Z',
      isPrivate: false,
      unreadCount: 5,
      priority: 'urgent',
      tags: ['HIPAA', 'Urgent']
    }
  ];

  const filteredConversations = conversations?.filter(conversation =>
    conversation?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    conversation?.participants?.some(participant =>
      participant?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <Button size="sm" variant="outline">
            <Icon name="Plus" size={14} className="mr-1" />
            New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.map((conversation) => (
          <div
            key={conversation?.id}
            onClick={() => onSelectConversation(conversation)}
            className={`
              p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50
              ${selectedConversation?.id === conversation?.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''}
            `}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center flex-1 min-w-0">
                <Icon 
                  name={conversation?.isPrivate ? "Lock" : "MessageSquare"} 
                  size={14} 
                  className="text-muted-foreground mr-2 flex-shrink-0" 
                />
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {conversation?.title}
                </h3>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(conversation?.timestamp)}
                </span>
                {conversation?.unreadCount > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full min-w-5 text-center">
                    {conversation?.unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Participants */}
            <p className="text-xs text-muted-foreground mb-2">
              {conversation?.participants?.length} participants: {conversation?.participants?.slice(0, 2)?.join(', ')}
              {conversation?.participants?.length > 2 && ` +${conversation?.participants?.length - 2} more`}
            </p>

            {/* Last Message */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {conversation?.lastMessage}
            </p>

            {/* Tags and Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {conversation?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(conversation?.priority)}`}>
                {conversation?.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsList;