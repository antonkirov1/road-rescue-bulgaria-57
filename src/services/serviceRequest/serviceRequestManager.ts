
import { toast } from "@/components/ui/use-toast";
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { ServiceRequestState, EmployeeSimulationFunctions, ServiceRequestListener } from './types';
import { QuoteGenerator } from './quoteGenerator';
import { EmployeeAssignmentService } from './employeeAssignment';
import { RequestLifecycleManager } from './requestLifecycle';

export class ServiceRequestManager {
  private static instance: ServiceRequestManager;
  private currentRequest: ServiceRequestState | null = null;
  private listeners: Array<ServiceRequestListener> = [];
  private employeeAssignment = new EmployeeAssignmentService();
  
  private constructor() {}
  
  static getInstance(): ServiceRequestManager {
    if (!ServiceRequestManager.instance) {
      ServiceRequestManager.instance = new ServiceRequestManager();
    }
    return ServiceRequestManager.instance;
  }
  
  initialize(employeeSimulation: EmployeeSimulationFunctions): void {
    this.employeeAssignment.initialize(employeeSimulation);
  }
  
  subscribe(listener: ServiceRequestListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners() {
    console.log('ServiceRequestManager: Notifying listeners with state:', {
      id: this.currentRequest?.id,
      status: this.currentRequest?.status,
      hasQuote: !!this.currentRequest?.currentQuote,
      quoteAmount: this.currentRequest?.currentQuote?.amount
    });
    
    // Immediate notification for UI updates
    this.listeners.forEach(listener => listener(this.currentRequest));
  }
  
  async createRequest(
    type: ServiceType,
    userLocation: { lat: number; lng: number },
    message: string
  ): Promise<string> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentRequest = RequestLifecycleManager.createRequest(requestId, type, userLocation);
    
    console.log('ServiceRequestManager: Created new request:', this.currentRequest);
    this.notifyListeners();
    
    // Start finding employee immediately
    setTimeout(() => {
      this.findAvailableEmployee();
    }, 1000);
    
    return requestId;
  }
  
  private async findAvailableEmployee(): Promise<void> {
    if (!this.currentRequest) return;
    
    try {
      const employee = await this.employeeAssignment.findAvailableEmployee(this.currentRequest);
      
      if (!employee) {
        this.updateRequestStatus('cancelled');
        return;
      }
      
      this.currentRequest.assignedEmployee = employee;
      RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
      this.notifyListeners();
      
      console.log('Employee assigned:', employee.name);
      
      // Generate quote after employee assignment
      setTimeout(() => {
        this.generateQuote();
      }, 2000 + Math.random() * 3000);
      
    } catch (error) {
      console.error('Error finding employee:', error);
      this.updateRequestStatus('cancelled');
    }
  }
  
  private generateQuote(): void {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee) return;
    
    const finalPrice = QuoteGenerator.generateQuote(this.currentRequest.type);
    
    this.currentRequest.currentQuote = QuoteGenerator.createQuoteObject(
      finalPrice,
      this.currentRequest.assignedEmployee.name
    );
    
    this.currentRequest.status = 'quote_received';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('QUOTE GENERATED:', {
      status: this.currentRequest.status,
      quote: finalPrice,
      employee: this.currentRequest.assignedEmployee.name
    });
    
    this.notifyListeners();
    
    toast({
      title: "Price Quote Received",
      description: `${this.currentRequest.assignedEmployee.name} sent you a quote of ${finalPrice} BGN.`
    });
  }
  
  async acceptQuote(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.currentQuote || !this.currentRequest.assignedEmployee) return;
    
    this.currentRequest.status = 'quote_accepted';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('ServiceRequestManager - Quote accepted');
    this.notifyListeners();
    
    toast({
      title: "Quote Accepted",
      description: `${this.currentRequest.assignedEmployee.name} is on the way to your location.`
    });
    
    // Start service progress
    setTimeout(() => {
      this.simulateServiceProgress();
    }, 2000);
  }
  
  async declineQuote(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee) return;
    
    this.currentRequest.declineCount++;
    
    if (this.currentRequest.declineCount === 1 && !this.currentRequest.hasReceivedRevision) {
      // First decline - generate revision
      this.currentRequest.hasReceivedRevision = true;
      this.currentRequest.status = 'quote_declined';
      RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
      this.notifyListeners();
      
      toast({
        title: "Quote Declined",
        description: `${this.currentRequest.assignedEmployee.name} will send you a revised quote.`
      });
      
      // Generate revised quote
      setTimeout(() => {
        this.generateRevisedQuote();
      }, 3000);
      
    } else {
      // Second decline - find new employee
      await this.blacklistCurrentEmployeeAndFindNew();
    }
  }
  
  private generateRevisedQuote(): void {
    if (!this.currentRequest || !this.currentRequest.currentQuote || !this.currentRequest.assignedEmployee) return;
    
    const revisedAmount = QuoteGenerator.generateRevisedQuote(this.currentRequest.currentQuote.amount);
    
    this.currentRequest.currentQuote = QuoteGenerator.createQuoteObject(
      revisedAmount,
      this.currentRequest.assignedEmployee.name,
      true
    );
    
    this.currentRequest.status = 'quote_received';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('REVISED QUOTE GENERATED:', {
      status: this.currentRequest.status,
      revisedQuote: revisedAmount,
      employee: this.currentRequest.assignedEmployee.name
    });
    
    this.notifyListeners();
    
    toast({
      title: "Revised Quote Received",
      description: `${this.currentRequest.assignedEmployee.name} sent a revised quote of ${revisedAmount} BGN.`
    });
  }
  
  private async blacklistCurrentEmployeeAndFindNew(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee) return;
    
    const employeeToBlacklist = this.currentRequest.assignedEmployee.name;
    
    try {
      await this.employeeAssignment.blacklistEmployee(this.currentRequest.id, employeeToBlacklist);
      
      this.currentRequest.blacklistedEmployees.push(employeeToBlacklist);
      this.currentRequest.assignedEmployee = null;
      this.currentRequest.currentQuote = null;
      this.currentRequest.declineCount = 0;
      this.currentRequest.hasReceivedRevision = false;
      this.currentRequest.status = 'request_accepted';
      RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
      this.notifyListeners();
      
      toast({
        title: "Quote Declined",
        description: "Looking for another available employee..."
      });
      
      // Find new employee
      setTimeout(() => {
        this.findAvailableEmployee();
      }, 2000);
      
    } catch (error) {
      console.error('Error blacklisting employee:', error);
    }
  }
  
  private simulateServiceProgress(): void {
    if (!this.currentRequest) return;
    
    this.currentRequest.status = 'in_progress';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('ServiceRequestManager - Service in progress');
    this.notifyListeners();
    
    toast({
      title: "Service Started",
      description: "Your service is now in progress."
    });
    
    // Complete service after 15 seconds
    setTimeout(() => {
      this.completeService();
    }, 15000);
  }
  
  private async completeService(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee || !this.currentRequest.currentQuote) return;
    
    this.currentRequest.status = 'completed';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('ServiceRequestManager - Service completed');
    this.notifyListeners();
    
    await RequestLifecycleManager.recordCompletion(this.currentRequest);
    
    toast({
      title: "Service Completed",
      description: `Your ${this.currentRequest.type} service has been completed successfully.`
    });
    
    // Clear request after showing completion
    setTimeout(() => {
      this.clearRequest();
    }, 5000);
  }
  
  async cancelRequest(): Promise<void> {
    if (!this.currentRequest) return;
    
    await RequestLifecycleManager.cleanupCancelledRequest(this.currentRequest.id);
    
    this.updateRequestStatus('cancelled');
    
    toast({
      title: "Request Cancelled",
      description: "Your service request has been cancelled."
    });
    
    setTimeout(() => {
      this.clearRequest();
    }, 2000);
  }
  
  private updateRequestStatus(status: ServiceRequestState['status']): void {
    if (!this.currentRequest) return;
    
    this.currentRequest.status = status;
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    this.notifyListeners();
  }
  
  private clearRequest(): void {
    console.log('ServiceRequestManager - Clearing current request');
    this.currentRequest = null;
    this.notifyListeners();
  }
  
  getCurrentRequest(): ServiceRequestState | null {
    return this.currentRequest;
  }
}

export type { ServiceRequestState } from './types';
