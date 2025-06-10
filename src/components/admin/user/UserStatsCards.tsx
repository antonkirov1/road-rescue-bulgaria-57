
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, Plus, Ban } from 'lucide-react';

interface UserAccount {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  gender?: string;
  full_name?: string;
  created_at: string;
  created_by_admin?: boolean;
  status?: 'active' | 'banned';
}

interface UserStatsCardsProps {
  users: UserAccount[];
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status !== 'banned').length}</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Created</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.created_by_admin).length}</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Banned Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'banned').length}</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
              <Ban className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsCards;
