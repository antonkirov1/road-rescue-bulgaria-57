
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeAccount {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  employee_role?: 'technician' | 'support' | 'admin' | 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner';
  status?: 'active' | 'inactive' | 'suspended';
  real_name?: string;
  created_at: string;
  is_available?: boolean;
  is_simulated?: boolean;
}

export class EmployeeAccountService {
  static async getAllEmployees(): Promise<EmployeeAccount[]> {
    const { data, error } = await supabase
      .from('employee_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    // Cast the data to ensure proper typing
    return (data || []).map(employee => ({
      ...employee,
      employee_role: employee.employee_role as 'technician' | 'support' | 'admin' | 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner',
      status: employee.status as 'active' | 'inactive' | 'suspended'
    }));
  }

  static async createEmployeeAccount(employeeData: {
    username: string;
    email: string;
    phone_number?: string;
    employee_role?: 'technician' | 'support' | 'admin' | 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner';
    real_name?: string;
    is_available?: boolean;
    is_simulated?: boolean;
  }): Promise<EmployeeAccount> {
    const { data, error } = await supabase
      .from('employee_accounts')
      .insert({
        ...employeeData,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating employee:', error);
      throw error;
    }

    // Cast the data to ensure proper typing
    return {
      ...data,
      employee_role: data.employee_role as 'technician' | 'support' | 'admin' | 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner',
      status: data.status as 'active' | 'inactive' | 'suspended'
    };
  }

  static async updateEmployee(id: string, updates: Partial<EmployeeAccount>): Promise<EmployeeAccount> {
    const { data, error } = await supabase
      .from('employee_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      throw error;
    }

    // Cast the data to ensure proper typing
    return {
      ...data,
      employee_role: data.employee_role as 'technician' | 'support' | 'admin' | 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner',
      status: data.status as 'active' | 'inactive' | 'suspended'
    };
  }

  static async updateEmployeeStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    const { error } = await supabase
      .from('employee_accounts')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating employee status:', error);
      throw error;
    }
  }

  static async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('employee_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  static async getAvailableEmployees(): Promise<EmployeeAccount[]> {
    const { data, error } = await supabase
      .from('employee_accounts')
      .select('*')
      .eq('status', 'active')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available employees:', error);
      throw error;
    }

    // Cast the data to ensure proper typing
    return (data || []).map(employee => ({
      ...employee,
      employee_role: employee.employee_role as 'technician' | 'support' | 'admin' | 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner',
      status: employee.status as 'active' | 'inactive' | 'suspended'
    }));
  }
}
