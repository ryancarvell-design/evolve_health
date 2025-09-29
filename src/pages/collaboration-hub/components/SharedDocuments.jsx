import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SharedDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    {
      id: 1,
      name: 'Patient Care Guidelines 2024',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2025-08-25T14:30:00Z',
      modifiedBy: 'Dr. Sarah Chen',
      collaborators: ['Dr. Sarah Chen', 'Mike Rodriguez', 'Lisa Park'],
      status: 'approved',
      tags: ['Guidelines', 'Patient Care']
    },
    {
      id: 2,
      name: 'HIPAA Compliance Checklist',
      type: 'DOC',
      size: '1.2 MB',
      lastModified: '2025-08-24T16:15:00Z',
      modifiedBy: 'Emma Davis',
      collaborators: ['Emma Davis', 'Dr. Robert Kim'],
      status: 'draft',
      tags: ['HIPAA', 'Compliance']
    },
    {
      id: 3,
      name: 'Therapy Protocol Templates',
      type: 'ZIP',
      size: '8.7 MB',
      lastModified: '2025-08-23T11:20:00Z',
      modifiedBy: 'James Wilson',
      collaborators: ['James Wilson', 'Dr. Sarah Chen', 'Mike Rodriguez', 'Lisa Park'],
      status: 'final',
      tags: ['Templates', 'Protocols']
    },
    {
      id: 4,
      name: 'Emergency Response Procedures',
      type: 'PDF',
      size: '3.1 MB',
      lastModified: '2025-08-22T09:45:00Z',
      modifiedBy: 'Dr. Robert Kim',
      collaborators: ['Dr. Robert Kim', 'Dr. Sarah Chen'],
      status: 'approved',
      tags: ['Emergency', 'Procedures']
    },
    {
      id: 5,
      name: 'Team Meeting Notes - August',
      type: 'DOC',
      size: '890 KB',
      lastModified: '2025-08-21T13:30:00Z',
      modifiedBy: 'Lisa Park',
      collaborators: ['Lisa Park', 'Dr. Sarah Chen', 'Mike Rodriguez', 'Emma Davis'],
      status: 'draft',
      tags: ['Meeting', 'Notes']
    }
  ];

  const filteredDocuments = documents?.filter(doc =>
    doc?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    doc?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'final': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'doc': return 'FileText';
      case 'zip': return 'Archive';
      default: return 'File';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Shared Documents</h2>
            <p className="text-muted-foreground">
              Collaborate on documents and share important files with your team.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Icon name="FolderPlus" size={16} className="mr-2" />
              New Folder
            </Button>
            <Button>
              <Icon name="Upload" size={16} className="mr-2" />
              Upload File
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Filter" size={14} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="SortAsc" size={14} className="mr-1" />
              Sort
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments?.map((document) => (
            <div
              key={document?.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {/* File Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getFileIcon(document?.type)} size={20} className="text-primary" />
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {document?.name}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getStatusStyle(document?.status)}`}>
                        {document?.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="mr-4">{document?.type}</span>
                    <span className="mr-4">{document?.size}</span>
                    <span>Modified {formatDate(document?.lastModified)} by {document?.modifiedBy}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Collaborators */}
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1">
                          {document?.collaborators?.slice(0, 3)?.map((collaborator, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 border-2 border-background rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium"
                              title={collaborator}
                            >
                              {collaborator?.split(' ')?.map(n => n?.[0])?.join('')}
                            </div>
                          ))}
                          {document?.collaborators?.length > 3 && (
                            <div className="w-6 h-6 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs text-muted-foreground">
                              +{document?.collaborators?.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {document?.collaborators?.length} collaborators
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center space-x-1">
                        {document?.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="Eye" size={14} className="mr-1" />
                        Preview
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Download" size={14} className="mr-1" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Share" size={14} className="mr-1" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedDocuments;