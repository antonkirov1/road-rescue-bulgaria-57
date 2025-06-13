
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Search } from 'lucide-react';
import { EmployeeAccountService } from '@/services/employeeAccountService';
import { toast } from '@/components/ui/use-toast';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';

interface EmployeeAccount {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  employee_role?: string;
  status?: string;
  real_name?: string;
  created_at: string;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeAccount[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeAccount | undefined>();
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

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
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.real_name && employee.real_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.employee_role && employee.employee_role.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleTogglePassword = (employeeId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const handleBanEmployee = async (employee: EmployeeAccount) => {
    try {
      await EmployeeAccountService.updateEmployeeStatus(employee.id, 'suspended');
      toast({
        title: "Employee Suspended",
        description: `${employee.username} has been suspended.`
      });
      loadEmployees();
    } catch (error) {
      console.error('Error suspending employee:', error);
      toast({
        title: "Error",
        description: "Failed to suspend employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnbanEmployee = async (employee: EmployeeAccount) => {
    try {
      await EmployeeAccountService.updateEmployeeStatus(employee.id, 'active');
      toast({
        title: "Employee Reactivated",
        description: `${employee.username} has been reactivated.`
      });
      loadEmployees();
    } catch (error) {
      console.error('Error reactivating employee:', error);
      toast({
        title: "Error",
        description: "Failed to reactivate employee. Please try again.",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Management</CardTitle>
            <Button onClick={handleCreateEmployee}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <EmployeeTable
            employees={filteredEmployees}
            loading={loading}
            showPasswords={showPasswords}
            onEditEmployee={handleEditEmployee}
            onTogglePassword={handleTogglePassword}
            onBanEmployee={handleBanEmployee}
            onUnbanEmployee={handleUnbanEmployee}
            onRemoveEmployee={handleRemoveEmployee}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
