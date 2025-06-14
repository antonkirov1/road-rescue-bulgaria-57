
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealLifeEmployee {
  id: string;
  username: string;
  email: string;
  real_name?: string;
  employee_role?: string;
  status?: string;
  is_available?: boolean;
}

export const useRealLifeEmployeeManagement = () => {
  const [employees, setEmployees] = useState<RealLifeEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useMemo(() => async () => {
    try {
      console.log('Loading real-life employees from employee_accounts table...');
      const { data, error } = await supabase
        .from('employee_accounts')
        .select('id, username, email, real_name, employee_role, status, is_available')
        .eq('status', 'active')
        .eq('is_available', true)
        .order('username', { ascending: true });

      if (error) {
        console.error('Error loading real-life employees:', error);
        return;
      }

      console.log('Loaded real-life employees:', data?.length || 0, data);
      setEmployees(data || []);
    } catch (error) {
      console.error('Error in loadEmployees:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const getRandomEmployee = useMemo(() => (excludedIds: string[] = []): RealLifeEmployee | null => {
    const availableEmployees = employees.filter(emp => 
      !excludedIds.includes(emp.id)
    );
    
    console.log('Available real-life employees after filtering:', availableEmployees.length, 'Excluded:', excludedIds);
    console.log('Available employees:', availableEmployees.map(emp => emp.real_name || emp.username));
    
    if (availableEmployees.length === 0) {
      console.log('No available real-life employees found');
      return null;
    }
    
    const selectedEmployee = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
    console.log('Selected real-life employee:', selectedEmployee.real_name || selectedEmployee.username, 'ID:', selectedEmployee.id);
    
    return selectedEmployee;
  }, [employees]);

  return {
    employees,
    isLoading,
    getRandomEmployee,
    loadEmployees
  };
};
