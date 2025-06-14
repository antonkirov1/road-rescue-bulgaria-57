
import { supabase } from '@/integrations/supabase/client';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  gender?: string;
  full_name?: string;
  password_hash?: string;
  auth_user_id?: string;
  created_at: string;
  created_by_admin?: boolean;
  status?: 'active' | 'banned';
  secret_question_1?: string;
  secret_answer_1?: string;
  secret_question_2?: string;
  secret_answer_2?: string;
  migrated_from_new_accounts?: string;
  is_builtin?: boolean;
}

export class UserAccountService {
  static async getAllUsers(): Promise<UserAccount[]> {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data || [];
  }

  static async createUserAccount(userData: {
    username: string;
    email: string;
    password_hash: string;
    phone_number?: string;
    gender?: string;
    full_name?: string;
  }): Promise<UserAccount> {
    const { data, error } = await supabase
      .from('user_accounts')
      .insert({
        ...userData,
        status: 'active',
        created_by_admin: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  }

  static async updateExistingUser(id: string, updates: Partial<UserAccount>): Promise<UserAccount> {
    const { data, error } = await supabase
      .from('user_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  }

  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async banUser(id: string, banDuration: number = 30): Promise<void> {
    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + banDuration);

    const { error } = await supabase
      .from('user_accounts')
      .update({ 
        status: 'banned'
      })
      .eq('id', id);

    if (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  }

  static async unbanUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_accounts')
      .update({ 
        status: 'active'
      })
      .eq('id', id);

    if (error) {
      console.error('Error unbanning user:', error);
      throw error;
    }
  }

  static async authenticateUser(username: string, password: string): Promise<UserAccount | null> {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error authenticating user:', error);
      return null;
    }

    return data;
  }

  // Remove methods related to new_user_accounts as that table no longer exists
  static async getPendingNewUsers(): Promise<never[]> {
    // This method is no longer needed since new_user_accounts table is removed
    return [];
  }

  static async migrateNewUser(userId: string): Promise<boolean> {
    // This method is no longer needed since new_user_accounts table is removed
    return false;
  }

  static async rejectNewUser(userId: string): Promise<boolean> {
    // This method is no longer needed since new_user_accounts table is removed
    return false;
  }
}
