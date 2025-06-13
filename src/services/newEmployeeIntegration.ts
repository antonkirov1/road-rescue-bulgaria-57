
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';

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
  }

  static getInstance(): NewEmployeeIntegrationService {
    if (!NewEmployeeIntegrationService.instance) {
      NewEmployeeIntegrationService.instance = new NewEmployeeIntegrationService();
    }
    return NewEmployeeIntegrationService.instance;
  }

  private async loadSimulatedEmployees(): Promise<void> {
    // Load simulated employees with random data
    const simulatedNames = [
      'Ivan Petrov', 'Maria Georgieva', 'Dimitar Stoyanov', 'Elena Nikolova',
      'Petar Dimitrov', 'Ana Kostova', 'Stefan Todorov', 'Vera Angelova'
    ];

    this.simulatedEmployees = simulatedNames.map((name, index) => ({
      id: `sim_emp_${index + 1}`,
      name,
      isSimulated: true,
      location: {
        lat: 42.6977 + (Math.random() - 0.5) * 0.1,
        lng: 23.3219 + (Math.random() - 0.5) * 0.1
      },
      isAvailable: Math.random() > 0.3 // 70% availability
    }));
  }

  async findAvailableEmployee(request: ServiceRequest, blacklistedEmployees: string[] = []): Promise<EmployeeResponse | null> {
    // First try to find a real employee
    const availableRealEmployees = this.realEmployees.filter(emp => 
      emp.isAvailable && !blacklistedEmployees.includes(emp.name)
    );

    if (availableRealEmployees.length > 0) {
      return availableRealEmployees[0];
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

    const priceRange = basePrices[serviceType];
    let amount = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;

    if (isRevised) {
      // Reduce price by 10-25% for revision
      const reduction = Math.floor(amount * (0.1 + Math.random() * 0.15));
      amount = Math.max(priceRange.min, amount - reduction);
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
