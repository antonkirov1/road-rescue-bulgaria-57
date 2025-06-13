
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SimulatedEmployee {
  id: number;
  employee_number: number;
  full_name: string;
  created_at: string;
}

const SimulationManagement: React.FC = () => {
  const [simulatedEmployees, setSimulatedEmployees] = useState<SimulatedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadSimulatedEmployees();
  }, []);

  const loadSimulatedEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('*')
        .order('employee_number', { ascending: true });

      if (error) throw error;
      setSimulatedEmployees(data || []);
    } catch (error) {
      console.error('Error loading simulated employees:', error);
      toast({
        title: "Error",
        description: "Failed to load simulated employees.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSimulatedEmployee = async () => {
    if (!newEmployeeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the simulated employee.",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreating(true);
      const nextNumber = Math.max(...simulatedEmployees.map(e => e.employee_number), 0) + 1;
      
      const { error } = await supabase
        .from('employee_simulation')
        .insert({
          employee_number: nextNumber,
          full_name: newEmployeeName.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Simulated employee created successfully."
      });

      setNewEmployeeName('');
      loadSimulatedEmployees();
    } catch (error) {
      console.error('Error creating simulated employee:', error);
      toast({
        title: "Error",
        description: "Failed to create simulated employee.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const deleteSimulatedEmployee = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employee_simulation')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Simulated employee deleted successfully."
      });

      loadSimulatedEmployees();
    } catch (error) {
      console.error('Error deleting simulated employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete simulated employee.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading simulated employees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Simulation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="newEmployeeName">New Simulated Employee</Label>
                <Input
                  id="newEmployeeName"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="Enter employee name"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={createSimulatedEmployee} disabled={creating}>
                  <Plus className="h-4 w-4 mr-2" />
                  {creating ? 'Creating...' : 'Add'}
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              {simulatedEmployees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No simulated employees found
                </div>
              ) : (
                <div className="divide-y">
                  {simulatedEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">{employee.full_name}</div>
                        <div className="text-sm text-gray-500">
                          Employee #{employee.employee_number}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSimulatedEmployee(employee.id, employee.full_name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationManagement;
