import React, { useState } from 'react';
        import Button from '../../../components/ui/Button';
        import Icon from '../../../components/AppIcon';
        import { formatDistanceToNow } from 'date-fns';

        const PatientDetailModal = ({ isOpen, onClose, patient, onEdit, permissions }) => {
          const [activeTab, setActiveTab] = useState('overview');

          if (!isOpen || !patient) return null;

          const formatDate = (dateString) => {
            return new Date(dateString)?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          };

          const getStatusBadge = (status) => {
            const badges = {
              active: 'bg-green-100 text-green-800 border-green-200',
              inactive: 'bg-gray-100 text-gray-800 border-gray-200'
            };
            
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges?.[status] || badges?.inactive}`}>
                {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
              </span>
            );
          };

          // Mock document history
          const documentHistory = [
            {
              id: 'doc_1',
              title: 'Initial Assessment',
              type: 'Assessment',
              createdAt: '2024-08-25T10:00:00Z',
              createdBy: 'Dr. Smith'
            },
            {
              id: 'doc_2',
              title: 'Treatment Plan Update',
              type: 'Treatment Plan',
              createdAt: '2024-08-20T14:30:00Z',
              createdBy: 'Nurse Wilson'
            },
            {
              id: 'doc_3',
              title: 'Progress Notes',
              type: 'Progress Note',
              createdAt: '2024-08-18T16:15:00Z',
              createdBy: 'Dr. Smith'
            }
          ];

          // Mock activity log
          const activityLog = [
            {
              id: 'act_1',
              action: 'Document created',
              details: 'Initial Assessment completed',
              timestamp: '2024-08-25T10:00:00Z',
              user: 'Dr. Smith'
            },
            {
              id: 'act_2',
              action: 'Patient updated',
              details: 'Contact information updated',
              timestamp: '2024-08-22T09:15:00Z',
              user: 'Nurse Wilson'
            },
            {
              id: 'act_3',
              action: 'Care team assigned',
              details: 'Added to Physical Therapy team',
              timestamp: '2024-08-20T11:30:00Z',
              user: 'Dr. Smith'
            }
          ];

          const tabs = [
            { id: 'overview', label: 'Overview', icon: 'User' },
            { id: 'documents', label: 'Documents', icon: 'FileText' },
            { id: 'activity', label: 'Activity', icon: 'Clock' }
          ];

          const renderTabContent = () => {
            switch (activeTab) {
              case 'overview':
                return (
                  <div className="space-y-6">
                    {/* Patient Information */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Patient Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Full Name</label>
                          <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Patient ID</label>
                          <p className="font-medium">{patient?.patientId}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Date of Birth</label>
                          <p className="font-medium">{formatDate(patient?.dateOfBirth)}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Gender</label>
                          <p className="font-medium">{patient?.gender}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">MRN</label>
                          <p className="font-medium">{patient?.mrn}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Status</label>
                          <div className="mt-1">
                            {getStatusBadge(patient?.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Phone</label>
                          <p className="font-medium">{patient?.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Email</label>
                          <p className="font-medium">{patient?.email}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm text-muted-foreground">Emergency Contact</label>
                          <p className="font-medium">{patient?.emergencyContact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Care Team */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Care Team</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Assigned Specialty</label>
                          <p className="font-medium">{patient?.assignedSpecialty}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Team Members</label>
                          <div className="space-y-1">
                            {patient?.careTeam?.map((member, index) => (
                              <p key={index} className="text-sm">{member}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Insurance & Notes */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Additional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Insurance</label>
                          <p className="font-medium">{patient?.insurance}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Total Documents</label>
                          <p className="font-medium">{patient?.totalDocuments}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm text-muted-foreground">Notes</label>
                          <p className="font-medium">{patient?.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case 'documents':
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Document History</h4>
                      <Button size="sm" variant="outline">
                        <Icon name="Plus" size={16} className="mr-2" />
                        New Document
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {documentHistory?.map((doc) => (
                        <div key={doc?.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h5 className="font-medium text-foreground">{doc?.title}</h5>
                              <p className="text-sm text-muted-foreground">{doc?.type}</p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>Created {formatDistanceToNow(new Date(doc?.createdAt), { addSuffix: true })}</span>
                                <span>•</span>
                                <span>by {doc?.createdBy}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Icon name="Eye" size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icon name="Download" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case 'activity':
                return (
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Recent Activity</h4>
                    <div className="space-y-4">
                      {activityLog?.map((activity) => (
                        <div key={activity?.id} className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{activity?.action}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(activity?.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity?.details}</p>
                            <p className="text-xs text-muted-foreground">by {activity?.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              default:
                return null;
            }
          };

          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg shadow-clinical max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {patient?.firstName} {patient?.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Patient ID: {patient?.patientId} | Last updated {formatDistanceToNow(new Date(patient?.lastActivity), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {permissions?.canEdit && (
                      <Button onClick={onEdit} variant="outline">
                        <Icon name="Edit" size={16} className="mr-2" />
                        Edit
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={onClose}>
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                  <nav className="flex px-6">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                        }`}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          );
        };

        export default PatientDetailModal;