
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  name: string;
  isAvailable: boolean;
  isSimulated: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  username: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ServiceRequest {
  id: string;
  type: string;
  description?: string;
  userId: string;
  status: string;
  assignedEmployeeId?: string;
  priceQuote?: number;
  revisedPriceQuote?: number;
  userLocation?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt?: string;
  declineCount: number;
}

class NewSupabaseService {
  // Service Request Methods
  async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'createdAt' | 'declineCount'>): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        type: request.type,
        description: request.description,
        user_id: request.userId,
        status: request.status,
        assigned_employee_id: request.assignedEmployeeId,
        price_quote: request.priceQuote,
        revised_price_quote: request.revisedPriceQuote,
        user_location: request.userLocation ? `(${request.userLocation.lat},${request.userLocation.lng})` : null,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.type,
      description: data.description,
      userId: data.user_id,
      status: data.status,
      assignedEmployeeId: data.assigned_employee_id,
      priceQuote: data.price_quote,
      revisedPriceQuote: data.revised_price_quote,
      userLocation: data.user_location && typeof data.user_location === 'string' ? {
        lat: parseFloat(data.user_location.split(',')[0].replace('(', '')),
        lng: parseFloat(data.user_location.split(',')[1].replace(')', ''))
      } : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      declineCount: data.decline_count || 0,
    };
  }

  async getServiceRequests(): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      type: item.type,
      description: item.description,
      userId: item.user_id,
      status: item.status,
      assignedEmployeeId: item.assigned_employee_id,
      priceQuote: item.price_quote,
      revisedPriceQuote: item.revised_price_quote,
      userLocation: item.user_location && typeof item.user_location === 'string' ? {
        lat: parseFloat(item.user_location.split(',')[0].replace('(', '')),
        lng: parseFloat(item.user_location.split(',')[1].replace(')', ''))
      } : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      declineCount: item.decline_count || 0,
    }));
  }

  async getUserActiveRequest(userId: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'assigned', 'in_progress'])
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      id: data.id,
      type: data.type,
      description: data.description,
      userId: data.user_id,
      status: data.status,
      assignedEmployeeId: data.assigned_employee_id,
      priceQuote: data.price_quote,
      revisedPriceQuote: data.revised_price_quote,
      userLocation: data.user_location && typeof data.user_location === 'string' ? {
        lat: parseFloat(data.user_location.split(',')[0].replace('(', '')),
        lng: parseFloat(data.user_location.split(',')[1].replace(')', ''))
      } : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      declineCount: data.decline_count || 0,
    };
  }

  // Employee Methods
  async getAvailableEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employee_accounts')
      .select('*')
      .eq('is_available', true)
      .eq('status', 'active');

    if (error) throw error;

    return data.map(employee => ({
      id: employee.id,
      name: employee.real_name || employee.username,
      isAvailable: employee.is_available || false,
      isSimulated: employee.is_simulated || false,
      location: employee.location ? {
        lat: (employee.location as any).x || 0,
        lng: (employee.location as any).y || 0,
      } : { lat: 0, lng: 0 },
    }));
  }

  async getAvailableSimulatedEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employee_accounts')
      .select('*')
      .eq('is_available', true)
      .eq('is_simulated', true)
      .eq('status', 'active');

    if (error) throw error;

    return data.map(employee => ({
      id: employee.id,
      name: employee.real_name || employee.username,
      isAvailable: employee.is_available || false,
      isSimulated: employee.is_simulated || false,
      location: employee.location ? {
        lat: (employee.location as any).x || 0,
        lng: (employee.location as any).y || 0,
      } : { lat: 0, lng: 0 },
    }));
  }

  async updateEmployeeAvailability(employeeId: string, isAvailable: boolean): Promise<void> {
    const { error } = await supabase
      .from('employee_accounts')
      .update({ is_available: isAvailable })
      .eq('id', employeeId);

    if (error) throw error;
  }

  // User Methods
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      username: user.username,
      location: user.location && typeof user.location === 'string' ? {
        lat: parseFloat(user.location.split(',')[0].replace('(', '')),
        lng: parseFloat(user.location.split(',')[1].replace(')', ''))
      } : { lat: 0, lng: 0 },
    }));
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: user.username,
        location: `(${user.location.lat},${user.location.lng})`,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.username,
      location: data.location && typeof data.location === 'string' ? {
        lat: parseFloat(data.location.split(',')[0].replace('(', '')),
        lng: parseFloat(data.location.split(',')[1].replace(')', ''))
      } : { lat: 0, lng: 0 },
    };
  }

  // Service Request Update Methods
  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const updateData: any = {};
    
    if (updates.status) updateData.status = updates.status;
    if (updates.assignedEmployeeId) updateData.assigned_employee_id = updates.assignedEmployeeId;
    if (updates.priceQuote !== undefined) updateData.price_quote = updates.priceQuote;
    if (updates.revisedPriceQuote !== undefined) updateData.revised_price_quote = updates.revisedPriceQuote;
    if (updates.declineCount !== undefined) updateData.decline_count = updates.declineCount;

    const { data, error } = await supabase
      .from('service_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.type,
      description: data.description,
      userId: data.user_id,
      status: data.status,
      assignedEmployeeId: data.assigned_employee_id,
      priceQuote: data.price_quote,
      revisedPriceQuote: data.revised_price_quote,
      userLocation: data.user_location && typeof data.user_location === 'string' ? {
        lat: parseFloat(data.user_location.split(',')[0].replace('(', '')),
        lng: parseFloat(data.user_location.split(',')[1].replace(')', ''))
      } : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      declineCount: data.decline_count || 0,
    };
  }

  async assignEmployeeToRequest(requestId: string, employeeId: string): Promise<void> {
    const { error } = await supabase
      .from('service_requests')
      .update({
        assigned_employee_id: employeeId,
        status: 'assigned'
      })
      .eq('id', requestId);

    if (error) throw error;
  }

  // Price validation and generation methods
  async validatePrice(serviceType: string, price: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('price_ranges')
      .select('*')
      .eq('service_type', serviceType)
      .single();

    if (error || !data) return false;

    return price >= data.min_price && price <= data.max_price;
  }

  async generatePriceQuote(serviceType: string): Promise<number> {
    const { data, error } = await supabase
      .from('price_ranges')
      .select('*')
      .eq('service_type', serviceType)
      .single();

    if (error || !data) return 50; // Default price

    const randomPrice = data.min_price + (Math.random() * (data.max_price - data.min_price));
    return Math.round(randomPrice);
  }

  // Blacklist methods
  async getBlacklistedEmployees(userId: string, requestId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('simulated_employees_blacklist')
      .select('employee_name')
      .eq('user_id', userId)
      .eq('request_id', requestId);

    if (error) throw error;

    return data.map(item => item.employee_name);
  }

  async blacklistEmployee(userId: string, employeeName: string, requestId: string): Promise<void> {
    const { error } = await supabase
      .from('simulated_employees_blacklist')
      .insert({
        user_id: userId,
        employee_name: employeeName,
        request_id: requestId
      });

    if (error) throw error;
  }

  async resetBlacklist(userId: string, requestId: string): Promise<void> {
    const { error } = await supabase
      .from('simulated_employees_blacklist')
      .delete()
      .eq('user_id', userId)
      .eq('request_id', requestId);

    if (error) throw error;
  }

  // History method
  async addToHistory(historyData: any): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert(historyData);

    if (error) throw error;
  }
}

export { NewSupabaseService };
export const newSupabaseService = new NewSupabaseService();
