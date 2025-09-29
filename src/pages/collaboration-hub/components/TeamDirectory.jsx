import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TeamDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      initials: 'SC',
      role: 'Lead Physical Therapist',
      specialties: 'Orthopedic rehabilitation, Sports medicine, Manual therapy',
      status: 'online',
      availability: 'available',
      currentCaseload: 18,
      email: 'sarah.chen@evolvehealth.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      initials: 'MR',
      role: 'Physical Therapist',
      specialties: 'Neurological rehabilitation, Stroke recovery, Balance training',
      status: 'online',
      availability: 'busy',
      currentCaseload: 15,
      email: 'mike.rodriguez@evolvehealth.com',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 3,
      name: 'Lisa Park',
      initials: 'LP',
      role: 'Speech-Language Pathologist',
      specialties: 'Voice therapy, Swallowing disorders, Pediatric speech',
      status: 'away',
      availability: 'available',
      currentCaseload: 12,
      email: 'lisa.park@evolvehealth.com',
      phone: '+1 (555) 345-6789'
    },
    {
      id: 4,
      name: 'James Wilson',
      initials: 'JW',
      role: 'Occupational Therapist',
      specialties: 'Hand therapy, Workplace ergonomics, Cognitive rehabilitation',
      status: 'online',
      availability: 'available',
      currentCaseload: 14,
      email: 'james.wilson@evolvehealth.com',
      phone: '+1 (555) 456-7890'
    },
    {
      id: 5,
      name: 'Emma Davis',
      initials: 'ED',
      role: 'Mental Health Counselor',
      specialties: 'Trauma therapy, Anxiety disorders, Group therapy',
      status: 'offline',
      availability: 'unavailable',
      currentCaseload: 16,
      email: 'emma.davis@evolvehealth.com',
      phone: '+1 (555) 567-8901'
    },
    {
      id: 6,
      name: 'Dr. Robert Kim',
      initials: 'RK',
      role: 'Clinical Director',
      specialties: 'Clinical oversight, Quality assurance, Staff development',
      status: 'online',
      availability: 'busy',
      currentCaseload: 0,
      email: 'robert.kim@evolvehealth.com',
      phone: '+1 (555) 678-9012'
    }
  ];

  const filteredMembers = teamMembers?.filter(member =>
    member?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    member?.role?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    member?.specialties?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getAvailabilityStyle = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-50 text-green-700 border-green-200';
      case 'busy': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'unavailable': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const onlineCount = teamMembers?.filter(member => member?.status === 'online')?.length;

  return (
    <div className="p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Team Directory</h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {onlineCount} of {teamMembers?.length} team members online
            </div>
          </div>
          <Button>
            <Icon name="UserPlus" size={16} className="mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers?.map((member) => (
            <div
              key={member?.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Avatar and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center text-lg text-primary-foreground font-semibold">
                    {member?.initials}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member?.status)}`}></div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getAvailabilityStyle(member?.availability)}`}>
                  {member?.availability}
                </span>
              </div>

              {/* Member Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {member?.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member?.specialties}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Current caseload: {member?.currentCaseload}</span>
                <span className="capitalize">{member?.status}</span>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="MessageSquare" size={14} className="mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Phone" size={14} />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Video" size={14} />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Mail" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDirectory;