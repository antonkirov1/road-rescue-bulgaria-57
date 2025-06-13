
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, UserX, Trash2 } from 'lucide-react';
import { EmployeeAccount } from '@/services/employeeAccountService';

interface EmployeeTableRowProps {
  employee: EmployeeAccount;
  onEdit: (employee: EmployeeAccount) => void;
  onStatusChange: (employee: EmployeeAccount, status: 'active' | 'inactive' | 'suspended') => void;
  onRemove: (employee: EmployeeAccount) => void;
}

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
  onEdit,
  onStatusChange,
  onRemove
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'support':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Support</Badge>;
      case 'technician':
        return <Badge variant="secondary">Technician</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{employee.username}</TableCell>
      <TableCell>{employee.email || 'N/A'}</TableCell>
      <TableCell>{employee.real_name || 'N/A'}</TableCell>
      <TableCell>{getRoleBadge(employee.employee_role || 'technician')}</TableCell>
      <TableCell>{getStatusBadge(employee.status || 'active')}</TableCell>
      <TableCell>
        <Badge variant={employee.is_available ? "default" : "secondary"}>
          {employee.is_available ? 'Available' : 'Unavailable'}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(employee.created_at)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {employee.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(employee, 'suspended')}
              className="text-orange-600 hover:text-orange-700"
            >
              <UserX className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(employee, 'active')}
              className="text-green-600 hover:text-green-700"
            >
              <UserX className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(employee)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
