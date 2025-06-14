
import { toast } from "@/components/ui/use-toast";
import { UserHistoryService } from '@/services/userHistoryService';
import { SimulatedEmployeeBlacklistService } from '@/services/simulatedEmployeeBlacklistService';
import { ServiceRequestState, ServiceRequestListener, Employee, Quote, EmployeeSimulationFunctions } from './types';
import { ServiceType } from '@/components/service/types/serviceRequestState';

export class ServiceRequestManager {
  private static instance: ServiceRequestManager;
  private currentRequest: ServiceRequestState | null = null;
  private listeners: ServiceRequestListener[] = [];
  private employeeSimulation: EmployeeSimulationFunctions | null = null;

  private constructor() {}

  static getInstance(): ServiceRequestManager {
    if (!ServiceRequestManager.instance) {
      ServiceRequestManager.instance = new ServiceRequestManager();
    }
    return ServiceRequestManager.instance;
  }

  initialize(employeeSimulation: EmployeeSimulationFunctions) {
    this.employeeSimulation = employeeSimulation;
  }

  subscribe(listener: ServiceRequestListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.currentRequest));
  }

  getCurrentRequest(): ServiceRequestState | null {
    return this.currentRequest;
  }

  async createRequest(
    type: ServiceType,
    userLocation: { lat: number; lng: number },
    message: string
  ): Promise<string> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentRequest = {
      id: requestId,
      type,
      status: 'request_created',
      userLocation,
      blacklistedEmployees: [],
      timestamp: new Date().toISOString(),
      assignedEmployee: null,
      currentQuote: null,
      declineCount: 0,
      hasReceivedRevision: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedEmployeeName: '',
      priceQuote: null,
      etaSeconds: 0,
      message,
      isSubmitting: false,
      showRealTimeUpdate: false,
      showPriceQuote: false,
      declineReason: '',
      serviceFee: 5,
      hasDeclinedOnce: false,
      isWaitingForRevision: false,
      currentEmployeeName: '',
      declinedEmployees: [],
      employeeLocation: undefined
    };

    this.notify();
    
    // Start employee assignment process
    setTimeout(() => this.findAndAssignEmployee(), 1000);
    
    return requestId;
  }

  private async findAndAssignEmployee(): Promise<void> {
    if (!this.currentRequest || !this.employeeSimulation) return;

    try {
      const employee = await this.employeeSimulation.getRandomEmployee(
        this.currentRequest.blacklistedEmployees
      );

      if (employee) {
        const assignedEmployee: Employee = {
          name: employee.name,
          id: employee.id,
          location: employee.location,
          specialties: [this.currentRequest.type],
          rating: 4.5,
          vehicleInfo: 'Service Vehicle',
          isAvailable: true
        };

        this.currentRequest.assignedEmployee = assignedEmployee;
        this.currentRequest.assignedEmployeeName = employee.name;
        this.currentRequest.status = 'employee_assigned';
        this.currentRequest.updatedAt = new Date().toISOString();
        
        this.notify();
        
        // Generate quote
        setTimeout(() => this.generateQuote(), 2000);
      } else {
        // No available employees
        this.currentRequest.status = 'cancelled';
        this.currentRequest.updatedAt = new Date().toISOString();
        this.notify();
      }
    } catch (error) {
      console.error('Error finding employee:', error);
      this.currentRequest.status = 'cancelled';
      this.currentRequest.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  private generateQuote(): void {
    if (!this.currentRequest) return;

    const basePrice = this.getBasePriceForService(this.currentRequest.type);
    const variation = Math.floor(Math.random() * 20) - 10;
    const finalPrice = Math.max(20, basePrice + variation);

    const quote: Quote = {
      amount: finalPrice,
      employeeName: this.currentRequest.assignedEmployeeName,
      timestamp: new Date().toISOString(),
      isRevised: false
    };

    this.currentRequest.currentQuote = quote;
    this.currentRequest.priceQuote = finalPrice;
    this.currentRequest.status = 'quote_received';
    this.currentRequest.updatedAt = new Date().toISOString();
    
    this.notify();
  }

  private getBasePriceForService(serviceType: ServiceType): number {
    const basePrices = {
      'flat-tyre': 40,
      'out-of-fuel': 30,
      'car-battery': 60,
      'other-car-problems': 50,
      'tow-truck': 100,
      'emergency': 80,
      'support': 35
    };
    return basePrices[serviceType] || 50;
  }

  async acceptQuote(): Promise<void> {
    if (!this.currentRequest) return;

    this.currentRequest.status = 'quote_accepted';
    this.currentRequest.updatedAt = new Date().toISOString();
    this.notify();

    // Simulate service progression
    setTimeout(() => {
      if (this.currentRequest) {
        this.currentRequest.status = 'in_progress';
        this.currentRequest.updatedAt = new Date().toISOString();
        this.notify();
      }
    }, 2000);

    setTimeout(() => {
      if (this.currentRequest) {
        this.currentRequest.status = 'completed';
        this.currentRequest.updatedAt = new Date().toISOString();
        this.notify();
        this.recordCompletion();
      }
    }, 10000);
  }

  async declineQuote(): Promise<void> {
    if (!this.currentRequest) return;

    this.currentRequest.status = 'quote_declined';
    this.currentRequest.declineCount++;
    this.currentRequest.hasDeclinedOnce = true;
    this.currentRequest.updatedAt = new Date().toISOString();
    
    // Add current employee to blacklist
    if (this.currentRequest.assignedEmployeeName) {
      this.currentRequest.blacklistedEmployees.push(this.currentRequest.assignedEmployeeName);
    }

    this.notify();

    // Generate revised quote or find new employee
    if (this.currentRequest.declineCount < 3) {
      setTimeout(() => this.generateRevisedQuote(), 2000);
    } else {
      this.currentRequest.status = 'cancelled';
      this.currentRequest.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  private generateRevisedQuote(): void {
    if (!this.currentRequest) return;

    const currentPrice = this.currentRequest.priceQuote || 50;
    const reducedPrice = Math.max(20, currentPrice - 10);

    const quote: Quote = {
      amount: reducedPrice,
      employeeName: this.currentRequest.assignedEmployeeName,
      timestamp: new Date().toISOString(),
      isRevised: true
    };

    this.currentRequest.currentQuote = quote;
    this.currentRequest.priceQuote = reducedPrice;
    this.currentRequest.status = 'quote_received';
    this.currentRequest.hasReceivedRevision = true;
    this.currentRequest.updatedAt = new Date().toISOString();
    
    this.notify();
  }

  async cancelRequest(): Promise<void> {
    if (!this.currentRequest) return;

    this.currentRequest.status = 'cancelled';
    this.currentRequest.updatedAt = new Date().toISOString();
    this.notify();

    // Cleanup
    try {
      await SimulatedEmployeeBlacklistService.clearBlacklistForRequest(this.currentRequest.id);
    } catch (error) {
      console.error('Error cleaning up cancelled request:', error);
    }

    this.currentRequest = null;
    this.notify();
  }

  private async recordCompletion(): Promise<void> {
    if (!this.currentRequest?.assignedEmployee || !this.currentRequest?.currentQuote) return;
    
    try {
      await UserHistoryService.addHistoryEntry({
        user_id: 'current_user',
        username: 'current_user',
        service_type: this.currentRequest.type,
        status: 'completed',
        employee_name: this.currentRequest.assignedEmployee.name,
        price_paid: this.currentRequest.currentQuote.amount,
        service_fee: this.currentRequest.serviceFee || 5,
        total_price: this.currentRequest.currentQuote.amount + (this.currentRequest.serviceFee || 5),
        request_date: this.currentRequest.createdAt,
        completion_date: new Date().toISOString(),
        address_street: 'Sofia Center, Bulgaria',
        latitude: this.currentRequest.userLocation.lat,
        longitude: this.currentRequest.userLocation.lng
      });
    } catch (error) {
      console.error('Error recording completion:', error);
    }
  }
}

export type { ServiceRequestState, ServiceRequestListener } from './types';
