
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, EyeOff, UserX, UserCheck, Trash2 } from 'lucide-react';
import { EmployeeAccount } from '@/services/employeeAccountService';

interface EmployeeTableRowProps {
  employee: EmployeeAccount;
  showPassword: boolean;
  onEdit: (employee: EmployeeAccount) => void;
  onTogglePassword: (employeeId: string) => void;
  onBan: (employee: EmployeeAccount) => void;
  onUnban: (employee: EmployeeAccount) => void;
  onRemove: (employee: EmployeeAccount) => void;
}

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
  showPassword,
  onEdit,
  onTogglePassword,
  onBan,
  onUnban,
  onRemove
}) => {
  const isBanned = employee.status === 'suspended' || employee.status === 'inactive';

  const getRoleDisplayName = (role?: 'technician' | 'support' | 'admin') => {
    switch (role) {
      case 'technician':
        return 'Technician';
      case 'support':
        return 'Support';
      case 'admin':
        return 'Admin';
      default:
        return 'Technician';
    }
  };

  const getRoleVariant = (role?: 'technician' | 'support' | 'admin') => {
    switch (role) {
      case 'support':
        return 'secondary' as const;
      case 'admin':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium dark:text-gray-200">
        {employee.real_name || employee.username}
      </TableCell>
      <TableCell className="dark:text-gray-200">{employee.username}</TableCell>
      <TableCell className="dark:text-gray-200">{employee.email}</TableCell>
      <TableCell className="dark:text-gray-200">{employee.phone_number || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant={getRoleVariant(employee.employee_role)}>
          {getRoleDisplayName(employee.employee_role)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={isBanned ? "destructive" : "default"}>
          {isBanned ? 'Suspended' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={employee.is_available ? "default" : "secondary"}>
          {employee.is_available ? 'Available' : 'Busy'}
        </Badge>
      </TableCell>
      <TableCell className="dark:text-gray-200">
        {new Date(employee.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
            title="Edit Employee"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePassword(employee.id)}
            title="Toggle Password Visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          {isBanned ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnban(employee)}
              className="text-green-600 hover:text-green-700"
              title="Unban Employee"
            >
              <UserCheck className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBan(employee)}
              className="text-red-600 hover:text-red-700"
              title="Ban Employee"
            >
              <UserX className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(employee)}
            className="text-red-600 hover:text-red-700"
            title="Remove Employee"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
