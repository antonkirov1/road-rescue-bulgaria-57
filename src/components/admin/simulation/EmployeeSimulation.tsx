
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SimulatedEmployee {
  id: number;
  employee_number: number;
  full_name: string;
  created_at: string;
}

interface EmployeeSimulationProps {
  onStatsUpdate?: () => void;
}

const EmployeeSimulation: React.FC<EmployeeSimulationProps> = ({ onStatsUpdate }) => {
  const [employees, setEmployees] = useState<SimulatedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    full_name: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('*')
        .order('employee_number', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
      
      if (onStatsUpdate) {
        onStatsUpdate();
      }
    } catch (error) {
      console.error('Error loading simulated employees:', error);
      toast({
        title: "Error",
        description: "Failed to load simulated employees. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.employee_number || !newEmployee.full_name) {
      toast({
        title: "Validation Error",
        description: "Employee number and full name are required.",
        variant: "destructive"
      });
      return;
    }

    const employeeNumber = parseInt(newEmployee.employee_number);
    if (isNaN(employeeNumber) || employeeNumber <= 0) {
      toast({
        title: "Validation Error",
        description: "Employee number must be a positive number.",
        variant: "destructive"
      });
      return;
    }

    // Check if employee number already exists
    const exists = employees.some(emp => emp.employee_number === employeeNumber);
    if (exists) {
      toast({
        title: "Validation Error",
        description: "Employee number already exists.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('employee_simulation')
        .insert([
          {
            employee_number: employeeNumber,
            full_name: newEmployee.full_name.trim()
          }
        ]);

      if (error) throw error;

      toast({
        title: "Employee Added",
        description: `${newEmployee.full_name} has been added to simulation.`
      });
      
      setNewEmployee({ employee_number: '', full_name: '' });
      loadEmployees();
    } catch (error) {
      console.error('Error adding simulated employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveEmployee = async (employee: SimulatedEmployee) => {
    if (!confirm(`Are you sure you want to remove ${employee.full_name} from simulation?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employee_simulation')
        .delete()
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: "Employee Removed",
        description: `${employee.full_name} has been removed from simulation.`
      });
      loadEmployees();
    } catch (error) {
      console.error('Error removing simulated employee:', error);
      toast({
        title: "Error",
        description: "Failed to remove employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-300">Loading simulation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Employee Simulation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage simulated employees for testing purposes
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {employees.length} simulated employees
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Employee Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add New Simulated Employee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_number">Employee Number *</Label>
                    <Input
                      id="employee_number"
                      type="number"
                      value={newEmployee.employee_number}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, employee_number: e.target.value }))}
                      placeholder="Enter employee number"
                      required
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={newEmployee.full_name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isAdding} className="w-full sm:w-auto">
                  {isAdding ? 'Adding...' : 'Add Employee'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Employees List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Simulated Employees ({employees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No simulated employees found. Add some employees to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Number</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            #{employee.employee_number}
                          </TableCell>
                          <TableCell>{employee.full_name}</TableCell>
                          <TableCell>
                            {new Date(employee.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveEmployee(employee)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSimulation;
