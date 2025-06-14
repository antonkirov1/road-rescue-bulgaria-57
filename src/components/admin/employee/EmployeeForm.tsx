
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { EmployeeAccountService, EmployeeAccount } from '@/services/employeeAccountService';
import { usePasswordValidation, useConfirmPasswordValidation } from '@/hooks/useAuthValidation';
import { useTranslation } from '@/utils/translations';
import { useApp } from '@/contexts/AppContext';

interface EmployeeFormProps {
  employee?: EmployeeAccount;
  onSubmit: () => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const { language } = useApp();
  const t = useTranslation(language);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    employee_role: 'technician' as 'technician' | 'support' | 'admin',
    real_name: '',
    is_available: true
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation hooks
  const passwordValidation = usePasswordValidation(t);
  const confirmPasswordValidation = useConfirmPasswordValidation(passwordValidation.value, t);

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username || '',
        email: employee.email || '',
        phone_number: employee.phone_number || '',
        employee_role: employee.employee_role || 'technician',
        real_name: employee.real_name || '',
        is_available: employee.is_available ?? true
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Username and email are required fields.",
        variant: "destructive"
      });
      return;
    }

    // For new employees, validate password
    if (!employee) {
      if (!passwordValidation.isValid || !confirmPasswordValidation.isValid) {
        toast({
          title: "Validation Error",
          description: "Please fix password validation errors before submitting.",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        ...((!employee && passwordValidation.value) && { password: passwordValidation.value })
      };

      if (employee) {
        await EmployeeAccountService.updateEmployee(employee.id, employeeData);
        toast({
          title: "Employee Updated",
          description: `${formData.username} has been updated successfully.`
        });
      } else {
        await EmployeeAccountService.createEmployeeAccount(employeeData);
        toast({
          title: "Employee Created",
          description: `${formData.username} has been created successfully.`
        });
      }
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl md:text-2xl">
                {employee ? 'Edit Employee' : 'Add Employee'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {employee ? 'Update employee information' : 'Create a new employee account'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="real_name">Real Name</Label>
                <Input
                  id="real_name"
                  value={formData.real_name}
                  onChange={(e) => handleChange('real_name', e.target.value)}
                  placeholder="Enter real name"
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="is_available">Availability</Label>
                <Select 
                  value={formData.is_available ? "true" : "false"} 
                  onValueChange={(value) => handleChange('is_available', value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password fields - only show for new employees */}
              {!employee && (
                <>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={passwordValidation.value}
                        onChange={(e) => passwordValidation.setValue(e.target.value)}
                        className={`pr-10 ${passwordValidation.error ? 'border-red-500' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-gray-500" />
                        ) : (
                          <Eye size={18} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {passwordValidation.error && (
                      <p className="text-sm text-red-600 mt-1">{passwordValidation.error}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPasswordValidation.value}
                        onChange={(e) => confirmPasswordValidation.setValue(e.target.value)}
                        className={`pr-10 ${confirmPasswordValidation.error ? 'border-red-500' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-gray-500" />
                        ) : (
                          <Eye size={18} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {confirmPasswordValidation.error && (
                      <p className="text-sm text-red-600 mt-1">{confirmPasswordValidation.error}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : (employee ? 'Update Employee' : 'Create Employee')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
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
