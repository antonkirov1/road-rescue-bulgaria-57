
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, EyeOff, UserX, UserCheck, Trash2 } from 'lucide-react';
import { UserAccount } from '@/services/userAccountService';

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
    return <div className="text-center py-4">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.full_name || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {showPasswords[user.id] ? user.password_hash : '••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePassword(user.id)}
                    >
                      {showPasswords[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBan(user)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnban(user)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
