
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';
import { EmployeeAccountService, EmployeeAccount } from '@/services/employeeAccountService';

interface EmployeeManagementProps {
  onStatsUpdate?: () => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onStatsUpdate }) => {
  const [employees, setEmployees] = useState<EmployeeAccount[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeAccount | undefined>();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeAccountService.getAllEmployees();
      setEmployees(data);
      
      if (onStatsUpdate) {
        onStatsUpdate();
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee =>
      employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.real_name && employee.real_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: EmployeeAccount) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingEmployee(undefined);
    loadEmployees();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleStatusChange = async (employee: EmployeeAccount, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await EmployeeAccountService.updateEmployeeStatus(employee.id, status);
      toast({
        title: "Employee Updated",
        description: `${employee.username} status changed to ${status}.`
      });
      loadEmployees();
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast({
        title: "Error",
        description: "Failed to update employee status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveEmployee = async (employee: EmployeeAccount) => {
    if (!confirm(`Are you sure you want to permanently delete ${employee.username}? This action cannot be undone.`)) {
      return;
    }

    try {
      await EmployeeAccountService.deleteEmployee(employee.id);
      toast({
        title: "Employee Deleted",
        description: `${employee.username} has been permanently deleted.`
      });
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (showForm) {
    return (
      <EmployeeForm
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Employee Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage employee accounts and roles
              </p>
            </div>
            <Button onClick={handleCreateEmployee} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            employees={filteredEmployees}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={handleEditEmployee}
            onStatusChange={handleStatusChange}
            onRemove={handleRemoveEmployee}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
