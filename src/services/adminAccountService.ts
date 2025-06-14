
import { supabase } from '@/integrations/supabase/client';

export interface AdminAccount {
  id: string;
  username: string;
  password_hash?: string;
  email?: string;
  real_name?: string;
  status?: 'active' | 'inactive' | 'suspended';
  is_builtin?: boolean;
  created_at: string;
}

export class AdminAccountService {
  static async getAllAdmins(): Promise<AdminAccount[]> {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }

    return data || [];
  }

  static async createAdminAccount(adminData: {
    username: string;
    password_hash: string;
    email?: string;
    real_name?: string;
  }): Promise<AdminAccount> {
    const { data, error } = await supabase
      .from('admin_accounts')
      .insert({
        ...adminData,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin:', error);
      throw error;
    }

    return data;
  }

  static async updateAdmin(id: string, updates: Partial<AdminAccount>): Promise<AdminAccount> {
    const { data, error } = await supabase
      .from('admin_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating admin:', error);
      throw error;
    }

    return data;
  }

  static async deleteAdmin(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  static async authenticateAdmin(username: string, password: string): Promise<AdminAccount | null> {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error authenticating admin:', error);
      return null;
    }

    return data;
  }
}
