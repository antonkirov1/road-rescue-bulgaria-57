
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeSimulation {
  id: number;
  employee_number: number;
  full_name: string;
  created_at: string;
}

export const useEmployeeSimulation = () => {
  const [employees, setEmployees] = useState<EmployeeSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useMemo(() => async () => {
    try {
      console.log('Loading simulated employees from employee_simulation table...');
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('id, employee_number, full_name, created_at')
        .order('employee_number', { ascending: true });

      if (error) {
        console.error('Error loading simulated employees:', error);
        // Set fallback employees if database fails
        console.log('Setting fallback employees due to database error');
        setEmployees([
          { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
          { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
          { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() },
          { id: 4, employee_number: 4, full_name: 'Sarah Wilson', created_at: new Date().toISOString() },
          { id: 5, employee_number: 5, full_name: 'Michael Brown', created_at: new Date().toISOString() }
        ]);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No employees found in database, using fallback employees');
        setEmployees([
          { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
          { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
          { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() },
          { id: 4, employee_number: 4, full_name: 'Sarah Wilson', created_at: new Date().toISOString() },
          { id: 5, employee_number: 5, full_name: 'Michael Brown', created_at: new Date().toISOString() }
        ]);
      } else {
        console.log('Loaded simulated employees:', data?.length || 0, data);
        setEmployees(data || []);
      }
    } catch (error) {
      console.error('Error in loadEmployees:', error);
      // Set fallback employees on any error
      console.log('Setting fallback employees due to catch error');
      setEmployees([
        { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
        { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
        { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() },
        { id: 4, employee_number: 4, full_name: 'Sarah Wilson', created_at: new Date().toISOString() },
        { id: 5, employee_number: 5, full_name: 'Michael Brown', created_at: new Date().toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const getRandomEmployee = useMemo(() => (excludedNames: string[] = []): EmployeeSimulation | null => {
    const availableEmployees = employees.filter(emp => 
      !excludedNames.includes(emp.full_name)
    );
    
    console.log('Available simulated employees after filtering:', availableEmployees.length, 'Excluded:', excludedNames);
    console.log('Available employees:', availableEmployees.map(emp => emp.full_name));
    
    if (availableEmployees.length === 0) {
      console.log('No available simulated employees found');
      return null;
    }
    
    const selectedEmployee = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
    console.log('Selected simulated employee:', selectedEmployee.full_name, 'ID:', selectedEmployee.id);
    
    return selectedEmployee;
  }, [employees]);

  return {
    employees,
    isLoading,
    getRandomEmployee,
    loadEmployees
  };
};
