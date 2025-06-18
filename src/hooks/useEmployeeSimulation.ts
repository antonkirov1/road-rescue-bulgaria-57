
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
      console.log('🔄 Loading simulated employees from employee_simulation table...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('id, employee_number, full_name, created_at')
        .order('employee_number', { ascending: true });

      if (error) {
        console.error('❌ Error loading simulated employees:', error);
        // Use guaranteed fallback employees if database fails
        const fallbackEmployees = [
          { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
          { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
          { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() },
          { id: 4, employee_number: 4, full_name: 'Sarah Wilson', created_at: new Date().toISOString() },
          { id: 5, employee_number: 5, full_name: 'Michael Brown', created_at: new Date().toISOString() }
        ];
        console.log('✅ Using fallback employees due to database error:', fallbackEmployees.length);
        setEmployees(fallbackEmployees);
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No employees found in database, using fallback employees');
        // Provide guaranteed fallback employees
        const fallbackEmployees = [
          { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
          { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
          { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() },
          { id: 4, employee_number: 4, full_name: 'Sarah Wilson', created_at: new Date().toISOString() },
          { id: 5, employee_number: 5, full_name: 'Michael Brown', created_at: new Date().toISOString() }
        ];
        setEmployees(fallbackEmployees);
      } else {
        console.log('✅ Successfully loaded simulated employees from database:', data.length, data);
        setEmployees(data);
      }
    } catch (error) {
      console.error('❌ Catch error in loadEmployees:', error);
      // Ultimate fallback employees - always guaranteed to work
      const fallbackEmployees = [
        { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
        { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
        { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() },
        { id: 4, employee_number: 4, full_name: 'Sarah Wilson', created_at: new Date().toISOString() },
        { id: 5, employee_number: 5, full_name: 'Michael Brown', created_at: new Date().toISOString() }
      ];
      console.log('✅ Using ultimate fallback employees:', fallbackEmployees.length);
      setEmployees(fallbackEmployees);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const getRandomEmployee = useMemo(() => (excludedNames: string[] = []): EmployeeSimulation | null => {
    console.log('🎯 getRandomEmployee called with employees:', employees.length, 'excluded:', excludedNames);
    
    // Always ensure we have employees available
    const availableEmployees = employees.length > 0 ? employees : [
      { id: 1, employee_number: 1, full_name: 'John Smith', created_at: new Date().toISOString() },
      { id: 2, employee_number: 2, full_name: 'Maria Garcia', created_at: new Date().toISOString() },
      { id: 3, employee_number: 3, full_name: 'Alex Johnson', created_at: new Date().toISOString() }
    ];
    
    const filteredEmployees = availableEmployees.filter(emp => 
      !excludedNames.includes(emp.full_name)
    );
    
    console.log('🔍 Available simulated employees after filtering:', filteredEmployees.length);
    console.log('👥 Available employees list:', filteredEmployees.map(emp => emp.full_name));
    
    if (filteredEmployees.length === 0) {
      console.log('⚠️ No available employees after filtering, returning first employee');
      return availableEmployees[0];
    }
    
    const selectedEmployee = filteredEmployees[Math.floor(Math.random() * filteredEmployees.length)];
    console.log('✅ Selected simulated employee:', selectedEmployee.full_name, 'ID:', selectedEmployee.id);
    
    return selectedEmployee;
  }, [employees]);

  return {
    employees,
    isLoading,
    getRandomEmployee,
    loadEmployees
  };
};
