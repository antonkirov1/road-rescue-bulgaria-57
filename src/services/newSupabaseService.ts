
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
      userLocation: data.user_location ? {
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
      userLocation: item.user_location ? {
        lat: parseFloat(item.user_location.split(',')[0].replace('(', '')),
        lng: parseFloat(item.user_location.split(',')[1].replace(')', ''))
      } : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      declineCount: item.decline_count || 0,
    }));
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
      location: user.location ? {
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
      location: data.location ? {
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
      userLocation: data.user_location ? {
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
}

export const newSupabaseService = new NewSupabaseService();
