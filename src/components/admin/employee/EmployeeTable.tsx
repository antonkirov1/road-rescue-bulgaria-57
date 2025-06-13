
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import EmployeeTableRow from './EmployeeTableRow';
import { EmployeeAccount } from '@/services/employeeAccountService';

interface EmployeeTableProps {
  employees: EmployeeAccount[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (employee: EmployeeAccount) => void;
  onStatusChange: (employee: EmployeeAccount, status: 'active' | 'inactive' | 'suspended') => void;
  onRemove: (employee: EmployeeAccount) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  searchTerm,
  onSearchChange,
  onEdit,
  onStatusChange,
  onRemove
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-white">Employees ({employees.length})</h3>
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm ? 'No employees found matching your search' : 'No employees found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="dark:text-gray-200">Username</TableHead>
                <TableHead className="dark:text-gray-200">Email</TableHead>
                <TableHead className="dark:text-gray-200">Real Name</TableHead>
                <TableHead className="dark:text-gray-200">Role</TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Available</TableHead>
                <TableHead className="dark:text-gray-200">Created</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <EmployeeTableRow
                  key={employee.id}
                  employee={employee}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
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

export default EmployeeTable;
