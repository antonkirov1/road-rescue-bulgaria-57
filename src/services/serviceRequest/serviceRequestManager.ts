
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
  
  // Initialize with employee simulation functions
  initialize(employeeSimulation: EmployeeSimulationFunctions): void {
    this.employeeAssignment.initialize(employeeSimulation);
  }
  
  // Subscribe to state changes
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
    
    // Use setTimeout to ensure UI updates happen after state is fully set
    setTimeout(() => {
      this.listeners.forEach(listener => listener(this.currentRequest));
    }, 0);
  }
  
  // Create new service request
  async createRequest(
    type: ServiceType,
    userLocation: { lat: number; lng: number },
    message: string
  ): Promise<string> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentRequest = RequestLifecycleManager.createRequest(requestId, type, userLocation);
    
    console.log('ServiceRequestManager: Created new request:', this.currentRequest);
    this.notifyListeners();
    
    // Start finding employee
    await this.findAvailableEmployee();
    
    return requestId;
  }
  
  // Find available employee (not blacklisted)
  private async findAvailableEmployee(): Promise<void> {
    if (!this.currentRequest) return;
    
    try {
      const employee = await this.employeeAssignment.findAvailableEmployee(this.currentRequest);
      
      if (!employee) {
        this.updateRequestStatus('cancelled');
        return;
      }
      
      // Assign employee
      this.currentRequest.assignedEmployee = employee;
      RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
      this.notifyListeners();
      
      console.log('Employee assigned:', employee.name);
      
      // Simulate employee response time (2-5 seconds)
      setTimeout(() => {
        this.generateQuote();
      }, 2000 + Math.random() * 3000);
      
    } catch (error) {
      console.error('Error finding employee:', error);
      this.updateRequestStatus('cancelled');
    }
  }
  
  // Generate price quote from assigned employee
  private generateQuote(): void {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee) return;
    
    const finalPrice = QuoteGenerator.generateQuote(this.currentRequest.type);
    
    this.currentRequest.currentQuote = QuoteGenerator.createQuoteObject(
      finalPrice,
      this.currentRequest.assignedEmployee.name
    );
    
    this.currentRequest.status = 'quote_received';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('QUOTE GENERATED - triggering UI update:', {
      status: this.currentRequest.status,
      quote: finalPrice,
      employee: this.currentRequest.assignedEmployee.name
    });
    
    // Force UI update for quote received - ensure immediate visibility
    this.notifyListeners();
  }
  
  // Accept quote
  async acceptQuote(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.currentQuote || !this.currentRequest.assignedEmployee) return;
    
    this.currentRequest.status = 'quote_accepted';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('ServiceRequestManager - Quote accepted, updating to quote_accepted status');
    this.notifyListeners();
    
    toast({
      title: "Quote Accepted",
      description: `${this.currentRequest.assignedEmployee.name} is on the way to your location.`
    });
    
    // Start service simulation immediately
    setTimeout(() => {
      this.simulateServiceProgress();
    }, 1000);
  }
  
  // Decline quote
  async declineQuote(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee) return;
    
    this.currentRequest.declineCount++;
    
    if (this.currentRequest.declineCount === 1 && !this.currentRequest.hasReceivedRevision) {
      // First decline - same employee sends revision
      this.currentRequest.hasReceivedRevision = true;
      this.currentRequest.status = 'quote_declined';
      RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
      this.notifyListeners();
      
      toast({
        title: "Quote Declined",
        description: `${this.currentRequest.assignedEmployee.name} will send you a revised quote.`
      });
      
      // Generate revised quote after 2 seconds
      setTimeout(() => {
        this.generateRevisedQuote();
      }, 2000);
      
    } else {
      // Second decline - blacklist employee and find new one
      await this.blacklistCurrentEmployeeAndFindNew();
    }
  }
  
  // Generate revised quote from same employee
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
    
    console.log('REVISED QUOTE GENERATED - triggering UI update:', {
      status: this.currentRequest.status,
      revisedQuote: revisedAmount,
      employee: this.currentRequest.assignedEmployee.name
    });
    
    // Force UI update for revised quote - ensure immediate visibility
    this.notifyListeners();
    
    toast({
      title: "Revised Quote Received",
      description: `${this.currentRequest.assignedEmployee.name} sent a revised quote of ${revisedAmount} BGN.`
    });
  }
  
  // Blacklist current employee and find new one
  private async blacklistCurrentEmployeeAndFindNew(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee) return;
    
    const employeeToBlacklist = this.currentRequest.assignedEmployee.name;
    
    try {
      // Add to database blacklist
      await this.employeeAssignment.blacklistEmployee(this.currentRequest.id, employeeToBlacklist);
      
      // Add to local blacklist
      this.currentRequest.blacklistedEmployees.push(employeeToBlacklist);
      
      // Reset employee assignment
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
      await this.findAvailableEmployee();
      
    } catch (error) {
      console.error('Error blacklisting employee:', error);
    }
  }
  
  // Simulate service progress
  private simulateServiceProgress(): void {
    if (!this.currentRequest) return;
    
    this.currentRequest.status = 'in_progress';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('ServiceRequestManager - Service in progress, updating status');
    this.notifyListeners();
    
    // Complete service after 15 seconds
    setTimeout(() => {
      this.completeService();
    }, 15000);
  }
  
  // Complete service
  private async completeService(): Promise<void> {
    if (!this.currentRequest || !this.currentRequest.assignedEmployee || !this.currentRequest.currentQuote) return;
    
    this.currentRequest.status = 'completed';
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    
    console.log('ServiceRequestManager - Service completed, updating status');
    this.notifyListeners();
    
    await RequestLifecycleManager.recordCompletion(this.currentRequest);
    
    toast({
      title: "Service Completed",
      description: `Your ${this.currentRequest.type} service has been completed successfully.`
    });
    
    // Clear request after a delay to allow UI to show completion
    setTimeout(() => {
      this.clearRequest();
    }, 3000);
  }
  
  // Cancel request
  async cancelRequest(): Promise<void> {
    if (!this.currentRequest) return;
    
    // Clear blacklist for this request
    await RequestLifecycleManager.cleanupCancelledRequest(this.currentRequest.id);
    
    this.updateRequestStatus('cancelled');
    
    toast({
      title: "Request Cancelled",
      description: "Your service request has been cancelled."
    });
    
    this.clearRequest();
  }
  
  // Update request status
  private updateRequestStatus(status: ServiceRequestState['status']): void {
    if (!this.currentRequest) return;
    
    this.currentRequest.status = status;
    RequestLifecycleManager.updateRequestTimestamp(this.currentRequest);
    this.notifyListeners();
  }
  
  // Clear current request
  private clearRequest(): void {
    console.log('ServiceRequestManager - Clearing current request');
    this.currentRequest = null;
    this.notifyListeners();
  }
  
  // Get current request
  getCurrentRequest(): ServiceRequestState | null {
    return this.currentRequest;
  }
}

// Re-export types for backward compatibility
export type { ServiceRequestState } from './types';
