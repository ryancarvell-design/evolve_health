import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentDocumentsTable = ({ documents }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800',
      'review': 'bg-purple-100 text-purple-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDocument = (docId) => {
    navigate(`/document-editor?id=${docId}&mode=view`);
  };

  const handleEditDocument = (docId) => {
    navigate(`/document-editor?id=${docId}&mode=edit`);
  };

  const handleDocumentOptions = (docId, docTitle) => {
    const options = [
      'View Document',
      'Edit Document', 
      'Share Document',
      'Download PDF',
      'View History',
      'Delete Document'
    ];
    
    const choice = prompt(`Document: ${docTitle}\n\nChoose an action:\n${options?.map((opt, i) => `${i + 1}. ${opt}`)?.join('\n')}`);
    
    if (choice && choice >= 1 && choice <= 6) {
      switch(parseInt(choice)) {
        case 1:
          handleViewDocument(docId);
          break;
        case 2:
          handleEditDocument(docId);
          break;
        case 3:
          alert('Share functionality would open sharing options');
          break;
        case 4:
          alert('PDF download would start');
          break;
        case 5:
          alert('Document history would be displayed');
          break;
        case 6:
          if (confirm('Are you sure you want to delete this document?')) {
            alert('Document would be deleted');
          }
          break;
      }
    }
  };

  const handleViewAllDocuments = () => {
    navigate('/document-library');
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Documents</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Documents you've created or edited recently
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewAllDocuments}>
            <Icon name="ExternalLink" size={16} className="mr-2" />
            View All
          </Button>
        </div>
      </div>

      {!documents || documents?.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No Recent Documents</h4>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't created or edited any documents yet.
          </p>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('/document-creation-hub')}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Create Your First Document
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-muted-foreground">Document</th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-muted-foreground">Last Modified</th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-muted-foreground">Your Role</th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents?.map((doc, index) => (
                <tr key={doc?.id} className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-primary-foreground">
                          {doc?.patientInitials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-foreground truncate block">
                          {doc?.patientName}
                        </span>
                        {doc?.patientMRN && (
                          <span className="text-xs text-muted-foreground">
                            MRN: {doc?.patientMRN}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center">
                      <Icon name={doc?.typeIcon} size={16} className="mr-2 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-foreground truncate block">{doc?.documentType}</span>
                        {doc?.aiEnhanced && (
                          <div className="flex items-center mt-1">
                            <Icon name="Brain" size={12} className="mr-1 text-accent" />
                            <span className="text-xs text-accent">AI Enhanced</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(doc?.lastModified)}
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc?.status)}`}>
                      {doc?.status?.charAt(0)?.toUpperCase() + doc?.status?.slice(1)?.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center">
                      {doc?.userActivity === 'created' && (
                        <div className="flex items-center text-green-600">
                          <Icon name="Plus" size={14} className="mr-1" />
                          <span className="text-xs font-medium">Created</span>
                        </div>
                      )}
                      {doc?.userActivity === 'edited' && (
                        <div className="flex items-center text-blue-600">
                          <Icon name="Edit3" size={14} className="mr-1" />
                          <span className="text-xs font-medium">Edited</span>
                        </div>
                      )}
                      {doc?.userActivity === 'assigned' && (
                        <div className="flex items-center text-purple-600">
                          <Icon name="UserCheck" size={14} className="mr-1" />
                          <span className="text-xs font-medium">Assigned</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewDocument(doc?.id)}
                        title="View Document"
                        className="h-8 w-8"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditDocument(doc?.id)}
                        title="Edit Document"
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDocumentOptions(doc?.id, doc?.documentType)}
                        title="More Options"
                        className="h-8 w-8"
                      >
                        <Icon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {documents && documents?.length > 0 && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Showing {documents?.length} recent documents</span>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center">
                  <Icon name="Plus" size={12} className="mr-1 text-green-600" />
                  <span className="text-xs">
                    {documents?.filter(d => d?.userActivity === 'created')?.length} Created
                  </span>
                </div>
                <div className="flex items-center">
                  <Icon name="Edit3" size={12} className="mr-1 text-blue-600" />
                  <span className="text-xs">
                    {documents?.filter(d => d?.userActivity === 'edited')?.length} Edited
                  </span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewAllDocuments}
              className="text-primary hover:text-primary-foreground"
            >
              View All Documents
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentDocumentsTable;