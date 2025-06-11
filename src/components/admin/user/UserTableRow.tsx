
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, EyeOff, UserX, UserCheck, Trash2 } from 'lucide-react';

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
  const isBanned = user.status === 'banned';

  return (
    <TableRow>
      <TableCell className="font-medium">
        {user.full_name || user.username}
      </TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone_number || 'N/A'}</TableCell>
      <TableCell>{user.gender || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant={isBanned ? "destructive" : "default"}>
          {isBanned ? 'Banned' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePassword(user.id)}
            title="Toggle Password Visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          {isBanned ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnban(user)}
              className="text-green-600 hover:text-green-700"
              title="Unban User"
            >
              <UserCheck className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBan(user)}
              className="text-red-600 hover:text-red-700"
              title="Ban User"
            >
              <UserX className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(user)}
            className="text-red-600 hover:text-red-700"
            title="Remove User"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
