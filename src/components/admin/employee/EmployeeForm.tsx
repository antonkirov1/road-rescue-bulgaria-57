
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeAccountService } from '@/services/employeeAccountService';
import { toast } from '@/components/ui/use-toast';

interface EmployeeAccount {
  id?: string;
  username: string;
  email: string;
  phone_number?: string;
  employee_role?: 'technician' | 'support' | 'admin';
  status?: string;
  real_name?: string;
  created_at?: string;
}

interface EmployeeFormProps {
  employee?: EmployeeAccount;
  onSubmit: () => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    phone_number: string;
    employee_role: 'technician' | 'support' | 'admin';
    real_name: string;
  }>({
    username: employee?.username || '',
    email: employee?.email || '',
    phone_number: employee?.phone_number || '',
    employee_role: employee?.employee_role || 'technician',
    real_name: employee?.real_name || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (employee?.id) {
        // Update existing employee
        await EmployeeAccountService.updateEmployee(employee.id, formData);
        toast({
          title: "Employee Updated",
          description: "Employee account has been updated successfully."
        });
      } else {
        // Create new employee
        await EmployeeAccountService.createEmployeeAccount(formData);
        toast({
          title: "Employee Created",
          description: "Employee account has been created successfully."
        });
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: "Failed to save employee account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'employee_role' ? value as 'technician' | 'support' | 'admin' : value 
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{employee ? 'Edit Employee' : 'Create Employee'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="real_name">Full Name</Label>
            <Input
              id="real_name"
              value={formData.real_name}
              onChange={(e) => handleChange('real_name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="employee_role">Role</Label>
            <Select value={formData.employee_role} onValueChange={(value) => handleChange('employee_role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (employee ? 'Update' : 'Create')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
