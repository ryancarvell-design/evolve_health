import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActionsPanel = ({ onAddMember }) => {
  const handleManageRoleTemplates = () => {
    alert('Role templates management would open here with predefined permission sets for different healthcare roles.');
  };

  const handleViewPendingInvitations = () => {
    alert('Pending invitations panel would open here showing:\n• Sent invitations\n• Acceptance status\n• Resend options');
  };

  const handleComplianceReport = () => {
    alert('Compliance report would open here with:\n• License status overview\n• Expiration alerts\n• Credentialing verification status');
  };

  const handleHipaaTraining = () => {
    alert('HIPAA training management would open here with:\n• Training status tracking\n• Compliance certification\n• Required renewals');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            onClick={onAddMember}
            className="w-full justify-start"
            variant="outline"
          >
            <Icon name="UserPlus" size={16} className="mr-2" />
            Add New Member
          </Button>
          
          <Button
            onClick={handleManageRoleTemplates}
            className="w-full justify-start"
            variant="ghost"
          >
            <Icon name="Users" size={16} className="mr-2" />
            Manage Role Templates
          </Button>
          
          <Button
            onClick={handleViewPendingInvitations}
            className="w-full justify-start"
            variant="ghost"
          >
            <Icon name="Clock" size={16} className="mr-2" />
            View Pending Invitations
          </Button>
        </div>
      </div>

      {/* Compliance & Training */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
        <h3 className="text-lg font-semibold text-foreground mb-4">Compliance & Training</h3>
        <div className="space-y-3">
          <Button
            onClick={handleComplianceReport}
            className="w-full justify-start"
            variant="ghost"
          >
            <Icon name="Award" size={16} className="mr-2" />
            Compliance Report
          </Button>
          
          <Button
            onClick={handleHipaaTraining}
            className="w-full justify-start"
            variant="ghost"
          >
            <Icon name="Shield" size={16} className="mr-2" />
            HIPAA Training Status
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">License Expiration</p>
              <p className="text-xs text-yellow-700">3 licenses expire within 30 days</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Credentialing Update</p>
              <p className="text-xs text-blue-700">2 members require verification</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">HIPAA Training</p>
              <p className="text-xs text-green-700">All members up to date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="UserPlus" size={14} className="text-green-600" />
            <div>
              <p className="text-foreground">Emma Davis joined</p>
              <p className="text-muted-foreground text-xs">2 days ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="Key" size={14} className="text-blue-600" />
            <div>
              <p className="text-foreground">Permissions updated for Mike Rodriguez</p>
              <p className="text-muted-foreground text-xs">3 days ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="Shield" size={14} className="text-orange-600" />
            <div>
              <p className="text-foreground">License renewed for Dr. Sarah Chen</p>
              <p className="text-muted-foreground text-xs">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;