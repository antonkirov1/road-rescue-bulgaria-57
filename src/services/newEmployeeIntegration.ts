
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeResponse {
  id: string;
  name: string;
  isSimulated: boolean;
  location: { lat: number; lng: number };
  isAvailable: boolean;
}

export interface ServiceQuote {
  amount: number;
  employeeName: string;
  isRevised?: boolean;
}

class NewEmployeeIntegrationService {
  private static instance: NewEmployeeIntegrationService;
  private simulatedEmployees: EmployeeResponse[] = [];
  private realEmployees: EmployeeResponse[] = [];

  private constructor() {
    this.loadSimulatedEmployees();
    this.loadRealEmployees();
  }

  static getInstance(): NewEmployeeIntegrationService {
    if (!NewEmployeeIntegrationService.instance) {
      NewEmployeeIntegrationService.instance = new NewEmployeeIntegrationService();
    }
    return NewEmployeeIntegrationService.instance;
  }

  private async loadSimulatedEmployees(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('id, employee_number, full_name')
        .order('employee_number', { ascending: true });

      if (error) {
        console.error('Error loading simulated employees:', error);
        return;
      }

      this.simulatedEmployees = data.map((emp) => ({
        id: `sim_emp_${emp.id}`,
        name: emp.full_name,
        isSimulated: true,
        location: {
          lat: 42.6977 + (Math.random() - 0.5) * 0.1,
          lng: 23.3219 + (Math.random() - 0.5) * 0.1
        },
        isAvailable: Math.random() > 0.3 // 70% availability
      }));
    } catch (error) {
      console.error('Error in loadSimulatedEmployees:', error);
    }
  }

  private async loadRealEmployees(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('employee_accounts')
        .select('id, username, real_name, status, is_available, location')
        .eq('status', 'active');

      if (error) {
        console.error('Error loading real employees:', error);
        return;
      }

      this.realEmployees = data.map((emp) => {
        let lat = 42.6977 + (Math.random() - 0.5) * 0.1;
        let lng = 23.3219 + (Math.random() - 0.5) * 0.1;

        // Handle location if it exists and has the right structure
        if (emp.location && typeof emp.location === 'object') {
          const location = emp.location as any;
          if (location.x !== undefined && location.y !== undefined) {
            lat = location.x;
            lng = location.y;
          }
        }

        return {
          id: `real_emp_${emp.id}`,
          name: emp.real_name || emp.username,
          isSimulated: false,
          location: { lat, lng },
          isAvailable: emp.is_available ?? (Math.random() > 0.4) // 60% availability for real employees
        };
      });
    } catch (error) {
      console.error('Error in loadRealEmployees:', error);
    }
  }

  async findAvailableEmployee(request: ServiceRequest, blacklistedEmployees: string[] = []): Promise<EmployeeResponse | null> {
    // Reload employees to ensure we have fresh data
    await this.loadSimulatedEmployees();
    await this.loadRealEmployees();

    // First try to find a real employee
    const availableRealEmployees = this.realEmployees.filter(emp => 
      emp.isAvailable && !blacklistedEmployees.includes(emp.name)
    );

    if (availableRealEmployees.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableRealEmployees.length);
      return availableRealEmployees[randomIndex];
    }

    // Fallback to simulated employees
    const availableSimulatedEmployees = this.simulatedEmployees.filter(emp => 
      emp.isAvailable && !blacklistedEmployees.includes(emp.name)
    );

    if (availableSimulatedEmployees.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSimulatedEmployees.length);
      return availableSimulatedEmployees[randomIndex];
    }

    return null;
  }

  generateQuote(serviceType: ServiceRequest['type'], isRevised: boolean = false): ServiceQuote {
    const basePrices = {
      'Flat Tyre': { min: 25, max: 45 },
      'Out of Fuel': { min: 20, max: 35 },
      'Car Battery': { min: 30, max: 55 },
      'Other Car Problems': { min: 40, max: 80 },
      'Tow Truck': { min: 60, max: 120 }
    };

    const priceRange = basePrices[serviceType] || { min: 40, max: 60 };
    let amount = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;

    if (isRevised) {
      // Reduce price by 15-25% for revision
      const reductionPercent = 0.15 + Math.random() * 0.10; // 15-25%
      const reduction = Math.floor(amount * reductionPercent);
      amount = Math.max(priceRange.min, amount - reduction);
      console.log(`Revised quote: Original ${amount + reduction} BGN, Reduced by ${reduction} BGN (${Math.round(reductionPercent * 100)}%), New: ${amount} BGN`);
    }

    return {
      amount,
      employeeName: 'System Generated',
      isRevised
    };
  }

  async notifyEmployeeOfRequest(employee: EmployeeResponse, request: ServiceRequest): Promise<boolean> {
    if (employee.isSimulated) {
      // For simulated employees, always accept
      console.log(`Simulated employee ${employee.name} received request ${request.id}`);
      return true;
    } else {
      // For real employees, this would integrate with their notification system
      console.log(`Real employee ${employee.name} notified of request ${request.id}`);
      // This would be replaced with actual notification logic
      return true;
    }
  }

  async employeeAcceptedRequest(employeeId: string, requestId: string): Promise<boolean> {
    console.log(`Employee ${employeeId} accepted request ${requestId}`);
    return true;
  }

  async employeeDeclinedRequest(employeeId: string, requestId: string, reason?: string): Promise<boolean> {
    console.log(`Employee ${employeeId} declined request ${requestId}. Reason: ${reason || 'Not specified'}`);
    return true;
  }

  // Method for real employees to register/update their status
  async registerRealEmployee(employee: Omit<EmployeeResponse, 'isSimulated'>): Promise<void> {
    const existingIndex = this.realEmployees.findIndex(emp => emp.id === employee.id);
    const realEmployee = { ...employee, isSimulated: false };
    
    if (existingIndex >= 0) {
      this.realEmployees[existingIndex] = realEmployee;
    } else {
      this.realEmployees.push(realEmployee);
    }
  }

  async updateEmployeeAvailability(employeeId: string, isAvailable: boolean): Promise<void> {
    // Update real employee
    const realEmployeeIndex = this.realEmployees.findIndex(emp => emp.id === employeeId);
    if (realEmployeeIndex >= 0) {
      this.realEmployees[realEmployeeIndex].isAvailable = isAvailable;
      return;
    }

    // Update simulated employee
    const simulatedEmployeeIndex = this.simulatedEmployees.findIndex(emp => emp.id === employeeId);
    if (simulatedEmployeeIndex >= 0) {
      this.simulatedEmployees[simulatedEmployeeIndex].isAvailable = isAvailable;
    }
  }

  getCurrentEmployees(): { real: EmployeeResponse[], simulated: EmployeeResponse[] } {
    return {
      real: this.realEmployees,
      simulated: this.simulatedEmployees
    };
  }
}

export const employeeIntegrationService = NewEmployeeIntegrationService.getInstance();
