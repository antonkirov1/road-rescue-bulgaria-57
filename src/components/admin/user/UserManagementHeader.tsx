
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Download } from 'lucide-react';

interface UserManagementHeaderProps {
  onBack: () => void;
  onCreateUser: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ onBack, onCreateUser }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onCreateUser} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New User
        </Button>
      </div>
    </div>
  );
};

export default UserManagementHeader;
