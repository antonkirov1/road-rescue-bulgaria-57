
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Ban, UserX, Trash2 } from 'lucide-react';

interface UserAccount {
  id: string;
  username: string;
  email: string;
  name?: string;
  created_at: string;
  ban_count?: number;
  banned_until?: string;
}

interface UserTableRowProps {
  user: UserAccount;
  showPassword: boolean;
  onEdit: (user: UserAccount) => void;
  onTogglePassword: (userId: string) => void;
  onBan: (user: UserAccount) => void;
  onUnban: (user: UserAccount) => void;
  onRemove: (user: UserAccount) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  showPassword,
  onEdit,
  onTogglePassword,
  onBan,
  onUnban,
  onRemove
}) => {
  const isBanned = user.banned_until && new Date(user.banned_until) > new Date();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>{user.email || 'N/A'}</TableCell>
      <TableCell>{user.name || 'N/A'}</TableCell>
      <TableCell>
        {isBanned ? (
          <Badge variant="destructive">
            Banned until {formatDate(user.banned_until!)}
          </Badge>
        ) : (
          <Badge variant="default">Active</Badge>
        )}
      </TableCell>
      <TableCell>{user.ban_count || 0}</TableCell>
      <TableCell>{formatDate(user.created_at)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {isBanned ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnban(user)}
              className="text-green-600 hover:text-green-700"
            >
              <UserX className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBan(user)}
              className="text-orange-600 hover:text-orange-700"
            >
              <Ban className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(user)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
