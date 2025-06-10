
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck } from 'lucide-react';
import UserFilters from './UserFilters';
import UserTableRow from './UserTableRow';

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

interface UserTableProps {
  users: UserAccount[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showPasswords: {[key: string]: boolean};
  onEdit: (user: UserAccount) => void;
  onTogglePassword: (userId: string) => void;
  onBan: (user: UserAccount) => void;
  onUnban: (user: UserAccount) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  searchTerm,
  onSearchChange,
  showPasswords,
  onEdit,
  onTogglePassword,
  onBan,
  onUnban
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Users ({users.length})</CardTitle>
            <CardDescription>
              View and manage all user accounts from the Existing User Accounts database
            </CardDescription>
          </div>
          <UserFilters 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    showPassword={showPasswords[user.id] || false}
                    onEdit={onEdit}
                    onTogglePassword={onTogglePassword}
                    onBan={onBan}
                    onUnban={onUnban}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTable;
