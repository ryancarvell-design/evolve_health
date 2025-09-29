import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CollaborationPanel = ({ isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState('comments');

  const collaborators = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      status: "online",
      role: "Editor",
      lastActive: "Active now"
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: "away",
      role: "Reviewer",
      lastActive: "5 min ago"
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      status: "offline",
      role: "Viewer",
      lastActive: "2 hours ago"
    }
  ];

  const comments = [
    {
      id: 1,
      author: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      content: "Please verify the dosage information in paragraph 3. The current recommendation seems higher than standard protocol.",
      timestamp: "2 hours ago",
      line: 15,
      resolved: false,
      replies: [
        {
          id: 11,
          author: "Mike Johnson",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          content: "I've double-checked with the latest guidelines. The dosage is correct for this patient's weight and condition.",
          timestamp: "1 hour ago"
        }
      ]
    },
    {
      id: 2,
      author: "Lisa Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Great documentation overall. Consider adding the patient's response to previous treatments for completeness.",
      timestamp: "4 hours ago",
      line: 8,
      resolved: true,
      replies: []
    }
  ];

  const versions = [
    {
      id: 1,
      version: "v1.3",
      author: "Dr. Sarah Chen",
      timestamp: "2 hours ago",
      changes: "Updated treatment plan and medication dosage",
      isCurrent: true
    },
    {
      id: 2,
      version: "v1.2",
      author: "Mike Johnson",
      timestamp: "1 day ago",
      changes: "Added patient history and assessment notes",
      isCurrent: false
    },
    {
      id: 3,
      version: "v1.1",
      author: "Dr. Sarah Chen",
      timestamp: "2 days ago",
      changes: "Initial draft with basic patient information",
      isCurrent: false
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Collaboration</h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex mt-3 bg-muted rounded-md p-1">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 px-3 py-1 text-sm rounded transition-clinical ${
              activeTab === 'comments' ?'bg-card text-foreground shadow-clinical' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 px-3 py-1 text-sm rounded transition-clinical ${
              activeTab === 'team' ?'bg-card text-foreground shadow-clinical' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Team
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`flex-1 px-3 py-1 text-sm rounded transition-clinical ${
              activeTab === 'versions' ?'bg-card text-foreground shadow-clinical' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Versions
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'comments' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Comments</h4>
              <Button variant="outline" size="xs">
                <Icon name="Plus" size={12} className="mr-1" />
                Add
              </Button>
            </div>
            
            {comments?.map((comment) => (
              <div key={comment?.id} className={`p-3 rounded-md border ${comment?.resolved ? 'bg-success/5 border-success/20' : 'bg-muted border-border'}`}>
                <div className="flex items-start space-x-3">
                  <Image
                    src={comment?.avatar}
                    alt={comment?.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{comment?.author}</span>
                      {comment?.resolved && (
                        <Icon name="CheckCircle" size={14} className="text-success" />
                      )}
                    </div>
                    <p className="text-sm text-foreground mb-2">{comment?.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Line {comment?.line} • {comment?.timestamp}</span>
                      <Button variant="ghost" size="xs">
                        Reply
                      </Button>
                    </div>
                    
                    {/* Replies */}
                    {comment?.replies?.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-border space-y-2">
                        {comment?.replies?.map((reply) => (
                          <div key={reply?.id} className="flex items-start space-x-2">
                            <Image
                              src={reply?.avatar}
                              alt={reply?.author}
                              className="w-6 h-6 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="text-xs font-medium text-foreground">{reply?.author}</div>
                              <p className="text-xs text-foreground">{reply?.content}</p>
                              <span className="text-xs text-muted-foreground">{reply?.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Team Members</h4>
              <Button variant="outline" size="xs">
                <Icon name="UserPlus" size={12} className="mr-1" />
                Invite
              </Button>
            </div>
            
            {collaborators?.map((collaborator) => (
              <div key={collaborator?.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-clinical">
                <div className="relative">
                  <Image
                    src={collaborator?.avatar}
                    alt={collaborator?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                    collaborator?.status === 'online' ? 'bg-success' :
                    collaborator?.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{collaborator?.name}</div>
                  <div className="text-xs text-muted-foreground">{collaborator?.role} • {collaborator?.lastActive}</div>
                </div>
                <Button variant="ghost" size="xs">
                  <Icon name="MoreVertical" size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Version History</h4>
              <Button variant="outline" size="xs">
                <Icon name="GitBranch" size={12} className="mr-1" />
                Compare
              </Button>
            </div>
            
            {versions?.map((version) => (
              <div key={version?.id} className={`p-3 rounded-md border ${version?.isCurrent ? 'bg-primary/5 border-primary/20' : 'bg-muted border-border'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{version?.version}</span>
                    {version?.isCurrent && (
                      <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{version?.timestamp}</span>
                </div>
                <p className="text-sm text-foreground mb-2">{version?.changes}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">by {version?.author}</span>
                  {!version?.isCurrent && (
                    <Button variant="ghost" size="xs">
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;