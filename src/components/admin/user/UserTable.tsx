
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import UserTableRow from './UserTableRow';

interface UserAccount {
  id: string;
  username: string;
  email: string;
  name?: string;
  created_at: string;
  ban_count?: number;
  banned_until?: string;
}

interface UserTableProps {
  users: UserAccount[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showPasswords: {[key: string]: boolean};
  onEdit: (user: UserAccount) => void;
  onTogglePassword: (userId: string) => void;
  onBan: (user: UserAccount) => void;
  onUnban: (user: UserAccount) => void;
  onRemove: (user: UserAccount) => void;
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
  onUnban,
  onRemove
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-white">Users ({users.length})</h3>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm ? 'No users found matching your search' : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="dark:text-gray-200">Username</TableHead>
                <TableHead className="dark:text-gray-200">Email</TableHead>
                <TableHead className="dark:text-gray-200">Name</TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Ban Count</TableHead>
                <TableHead className="dark:text-gray-200">Created</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
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
                  onRemove={onRemove}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
