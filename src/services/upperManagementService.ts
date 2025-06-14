
import { supabase } from '@/integrations/supabase/client';

export type UpperManagementRole = 'supervisor' | 'manager' | 'district manager' | 'owner' | 'co-owner' | 'partner';

export interface UpperManagementAccount {
  id: string;
  employee_id: string;
  management_role: UpperManagementRole;
  created_at: string;
  updated_at: string;
}

export class UpperManagementService {
  static async createOrUpdateUpperManagement(
    employeeId: string, 
    managementRole: UpperManagementRole
  ): Promise<UpperManagementAccount> {
    // First check if the employee already exists in upper management
    const { data: existing } = await supabase
      .from('upper_management_accounts')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('upper_management_accounts')
        .update({ management_role: managementRole })
        .eq('employee_id', employeeId)
        .select()
        .single();

      if (error) {
        console.error('Error updating upper management account:', error);
        throw error;
      }

      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('upper_management_accounts')
        .insert({
          employee_id: employeeId,
          management_role: managementRole
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating upper management account:', error);
        throw error;
      }

      return data;
    }
  }

  static async removeFromUpperManagement(employeeId: string): Promise<void> {
    const { error } = await supabase
      .from('upper_management_accounts')
      .delete()
      .eq('employee_id', employeeId);

    if (error) {
      console.error('Error removing from upper management:', error);
      throw error;
    }
  }

  static async getAllUpperManagement(): Promise<UpperManagementAccount[]> {
    const { data, error } = await supabase
      .from('upper_management_accounts')
      .select(`
        *,
        employee_accounts!inner (
          username,
          email,
          real_name,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching upper management accounts:', error);
      throw error;
    }

    return data || [];
  }

  static async getUpperManagementByRole(role: UpperManagementRole): Promise<UpperManagementAccount[]> {
    const { data, error } = await supabase
      .from('upper_management_accounts')
      .select(`
        *,
        employee_accounts!inner (
          username,
          email,
          real_name,
          status
        )
      `)
      .eq('management_role', role)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching upper management by role:', error);
      throw error;
    }

    return data || [];
  }

  static async isUpperManagement(employeeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('upper_management_accounts')
      .select('id')
      .eq('employee_id', employeeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking upper management status:', error);
      throw error;
    }

    return !!data;
  }
}
