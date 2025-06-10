
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Eye, EyeOff, Ban, UserCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  showPassword,
  onEdit,
  onTogglePassword,
  onBan,
  onUnban
}) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone_number || 'N/A'}</TableCell>
      <TableCell>{user.gender || 'N/A'}</TableCell>
      <TableCell>
        <Badge 
          variant={user.status === 'banned' ? 'destructive' : 'default'}
          className={user.status === 'banned' ? '' : 'bg-green-100 text-green-800 hover:bg-green-200'}
        >
          {user.status === 'banned' ? 'Banned' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <Badge 
          variant="outline"
          className={user.created_by_admin ? 'border-purple-200 text-purple-700 bg-purple-50' : 'border-green-200 text-green-700 bg-green-50'}
        >
          {user.created_by_admin ? 'Admin Created' : 'Self Registered'}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePassword(user.id)}>
              {showPassword ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Password
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Password
                </>
              )}
            </DropdownMenuItem>
            {user.status === 'banned' ? (
              <DropdownMenuItem onClick={() => onUnban(user)} className="text-green-600">
                <UserCheck className="h-4 w-4 mr-2" />
                Unban
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onBan(user)} className="text-red-600">
                <Ban className="h-4 w-4 mr-2" />
                Ban
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
