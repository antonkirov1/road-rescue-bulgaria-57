
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EmployeeTableRow from './EmployeeTableRow';

interface EmployeeAccount {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  employee_role?: 'technician' | 'support' | 'admin';
  status?: string;
  real_name?: string;
  created_at: string;
}

interface EmployeeTableProps {
  employees: EmployeeAccount[];
  loading: boolean;
  showPasswords: {[key: string]: boolean};
  onEditEmployee: (employee: EmployeeAccount) => void;
  onTogglePassword: (employeeId: string) => void;
  onBanEmployee: (employee: EmployeeAccount) => void;
  onUnbanEmployee: (employee: EmployeeAccount) => void;
  onRemoveEmployee: (employee: EmployeeAccount) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  showPasswords,
  onEditEmployee,
  onTogglePassword,
  onBanEmployee,
  onUnbanEmployee,
  onRemoveEmployee
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading employees...</div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">No employees found</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <EmployeeTableRow
              key={employee.id}
              employee={employee}
              showPassword={showPasswords[employee.id] || false}
              onEdit={onEditEmployee}
              onTogglePassword={onTogglePassword}
              onBan={onBanEmployee}
              onUnban={onUnbanEmployee}
              onRemove={onRemoveEmployee}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
