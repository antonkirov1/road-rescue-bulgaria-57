
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest, User, Employee } from '@/types/newServiceRequest';

export class NewSupabaseService {
  async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        user_id: request.userId,
        type: request.type,
        status: request.status,
        assigned_employee_id: request.assignedEmployeeId,
        price_quote: request.priceQuote,
        revised_price_quote: request.revisedPriceQuote,
        decline_count: request.declineCount,
        description: request.description,
        user_location: `POINT(${request.userLocation.lng} ${request.userLocation.lat})`
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<void> {
    const updateData: any = {};
    
    if (updates.status) updateData.status = updates.status;
    if (updates.assignedEmployeeId !== undefined) updateData.assigned_employee_id = updates.assignedEmployeeId;
    if (updates.priceQuote !== undefined) updateData.price_quote = updates.priceQuote;
    if (updates.revisedPriceQuote !== undefined) updateData.revised_price_quote = updates.revisedPriceQuote;
    if (updates.declineCount !== undefined) updateData.decline_count = updates.declineCount;
    if (updates.userLocation) {
      updateData.user_location = `POINT(${updates.userLocation.lng} ${updates.userLocation.lat})`;
    }

    const { error } = await supabase
      .from('service_requests')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapServiceRequestFromDB(data);
  }

  async getUserActiveRequest(userId: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'quote_sent', 'quote_revised', 'accepted', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return this.mapServiceRequestFromDB(data);
  }

  async getAvailableSimulatedEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_simulated', true)
      .eq('is_available', true);

    if (error) throw error;
    return data.map(this.mapEmployeeFromDB);
  }

  async getPriceRanges(): Promise<Record<string, { min: number; max: number }>> {
    const { data, error } = await supabase
      .from('price_ranges')
      .select('*');

    if (error) throw error;
    
    const ranges: Record<string, { min: number; max: number }> = {};
    data.forEach(range => {
      ranges[range.service_type] = {
        min: Number(range.min_price),
        max: Number(range.max_price)
      };
    });
    
    return ranges;
  }

  async generatePriceQuote(serviceType: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('generate_price_quote', { service_type: serviceType });

    if (error) throw error;
    return Number(data);
  }

  async validatePrice(serviceType: string, price: number): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('is_valid_price', { service_type: serviceType, price });

    if (error) throw error;
    return data;
  }

  async addToHistory(request: ServiceRequest): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert({
        user_id: request.userId,
        username: request.userId, // Will need to get actual username
        service_type: request.type,
        status: request.status,
        employee_name: request.assignedEmployeeId,
        price_paid: request.priceQuote || request.revisedPriceQuote,
        request_date: request.createdAt.toISOString(),
        completion_date: new Date().toISOString(),
        latitude: request.userLocation.lat,
        longitude: request.userLocation.lng
      });

    if (error) throw error;
  }

  async blacklistEmployee(requestId: string, employeeId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('simulated_employees_blacklist')
      .insert({
        request_id: requestId,
        employee_name: employeeId,
        user_id: userId
      });

    if (error) throw error;
  }

  async resetBlacklist(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('simulated_employees_blacklist')
      .delete()
      .eq('request_id', requestId);

    if (error) throw error;
  }

  async getBlacklistedEmployees(requestId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('simulated_employees_blacklist')
      .select('employee_name')
      .eq('request_id', requestId);

    if (error) throw error;
    return data.map(item => item.employee_name);
  }

  async createUser(user: Omit<User, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: user.username,
        name: user.name,
        email: user.email,
        location: `POINT(${user.location.lng} ${user.location.lat})`,
        ban_count: user.banCount,
        banned_until: user.bannedUntil?.toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const updateData: any = {};
    
    if (updates.banCount !== undefined) updateData.ban_count = updates.banCount;
    if (updates.bannedUntil !== undefined) updateData.banned_until = updates.bannedUntil?.toISOString();
    if (updates.location) {
      updateData.location = `POINT(${updates.location.lng} ${updates.location.lat})`;
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  private mapServiceRequestFromDB(data: any): ServiceRequest {
    const location = this.parsePoint(data.user_location);
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      status: data.status,
      assignedEmployeeId: data.assigned_employee_id,
      priceQuote: data.price_quote ? Number(data.price_quote) : undefined,
      revisedPriceQuote: data.revised_price_quote ? Number(data.revised_price_quote) : undefined,
      declineCount: data.decline_count || 0,
      description: data.description,
      userLocation: location,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapEmployeeFromDB(data: any): Employee {
    const location = this.parsePoint(data.location);
    return {
      id: data.id,
      name: data.name,
      isSimulated: data.is_simulated,
      location: location,
      isAvailable: data.is_available
    };
  }

  private parsePoint(pointStr: string): { lat: number; lng: number } {
    if (!pointStr) return { lat: 42.6977, lng: 23.3219 }; // Default Sofia location
    
    // Parse POINT(lng lat) format
    const match = pointStr.match(/POINT\(([^)]+)\)/);
    if (match) {
      const coords = match[1].split(' ');
      return {
        lat: parseFloat(coords[1]),
        lng: parseFloat(coords[0])
      };
    }
    
    return { lat: 42.6977, lng: 23.3219 };
  }
}
