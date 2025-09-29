import React from 'react';
import Icon from '../../../components/AppIcon';

const OrganizationOverview = ({ data }) => {
  const getComplianceColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-clinical mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Organization Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {/* Total Members */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon name="Users" size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{data?.totalMembers}</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </div>
        </div>

        {/* Active Licenses */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Icon name="Shield" size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{data?.activeLicenses}</p>
            <p className="text-sm text-muted-foreground">Active Licenses</p>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Icon name="Clock" size={24} className="text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{data?.pendingInvitations}</p>
            <p className="text-sm text-muted-foreground">Pending Invitations</p>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Icon name="Award" size={24} className="text-purple-600" />
          </div>
          <div>
            <p className={`text-2xl font-bold ${getComplianceColor(data?.complianceScore)}`}>
              {data?.complianceScore}%
            </p>
            <p className="text-sm text-muted-foreground">Compliance Score</p>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Department Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {data?.departments?.map((dept, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-lg font-semibold text-foreground">{dept?.memberCount}</p>
              <p className="text-sm text-muted-foreground">{dept?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationOverview;