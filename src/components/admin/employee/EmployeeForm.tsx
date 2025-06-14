
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { EmployeeAccountService, EmployeeAccount } from '@/services/employeeAccountService';
import { UpperManagementService } from '@/services/upperManagementService';

interface EmployeeFormProps {
  employee?: EmployeeAccount;
  onSubmit: () => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: employee?.username || '',
    email: employee?.email || '',
    phone_number: employee?.phone_number || '',
    employee_role: employee?.employee_role || 'technician',
    real_name: employee?.real_name || '',
    is_available: employee?.is_available ?? true,
    is_simulated: employee?.is_simulated ?? false,
  });
  const [loading, setLoading] = useState(false);

  const isUpperManagementRole = (role: string) => {
    return ['supervisor', 'manager', 'district manager', 'owner', 'co-owner', 'partner'].includes(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (employee) {
        // Update existing employee
        const updatedEmployee = await EmployeeAccountService.updateEmployee(employee.id, formData);
        
        // Handle upper management role changes
        if (isUpperManagementRole(formData.employee_role)) {
          await UpperManagementService.createOrUpdateUpperManagement(
            updatedEmployee.id, 
            formData.employee_role as any
          );
        } else {
          // Remove from upper management if role changed to non-management
          await UpperManagementService.removeFromUpperManagement(updatedEmployee.id);
        }
      } else {
        // Create new employee
        const newEmployee = await EmployeeAccountService.createEmployeeAccount(formData);
        
        // Add to upper management if applicable
        if (isUpperManagementRole(formData.employee_role)) {
          await UpperManagementService.createOrUpdateUpperManagement(
            newEmployee.id, 
            formData.employee_role as any
          );
        }
      }

      toast({
        title: "Success",
        description: `Employee ${employee ? 'updated' : 'created'} successfully.`
      });
      onSubmit();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: `Failed to ${employee ? 'update' : 'create'} employee. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="real_name">Real Name</Label>
                <Input
                  id="real_name"
                  type="text"
                  value={formData.real_name}
                  onChange={(e) => handleInputChange('real_name', e.target.value)}
                  placeholder="Enter real name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_role">Role *</Label>
                <Select 
                  value={formData.employee_role} 
                  onValueChange={(value) => handleInputChange('employee_role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="district manager">District Manager</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="co-owner">Co-Owner</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_available">Availability Status</Label>
                <Select 
                  value={formData.is_available ? 'available' : 'unavailable'} 
                  onValueChange={(value) => handleInputChange('is_available', value === 'available')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_simulated">Account Type</Label>
                <Select 
                  value={formData.is_simulated ? 'simulated' : 'real'} 
                  onValueChange={(value) => handleInputChange('is_simulated', value === 'simulated')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real">Real Account</SelectItem>
                    <SelectItem value="simulated">Simulated Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isUpperManagementRole(formData.employee_role) && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This employee will be added to the upper management accounts due to their selected role.
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm;
