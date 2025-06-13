
import { ServiceRequest, User, Employee, UIEvent } from '@/types/newServiceRequest';
import { NewSupabaseService } from './newSupabaseService';
import { toast } from '@/components/ui/use-toast';

export class RoadsideAssistanceSystem {
  private activeRequests: Map<string, ServiceRequest> = new Map();
  private userSessions: Map<string, NodeJS.Timeout> = new Map();
  private supabaseService: NewSupabaseService;
  private uiEventListeners: Map<UIEvent, Array<(data?: any) => void>> = new Map();
  private isSimulation: boolean = true; // Toggle for simulation mode

  constructor() {
    this.supabaseService = new NewSupabaseService();
  }

  // Event System
  on(event: UIEvent, callback: (data?: any) => void) {
    if (!this.uiEventListeners.has(event)) {
      this.uiEventListeners.set(event, []);
    }
    this.uiEventListeners.get(event)!.push(callback);
  }

  off(event: UIEvent, callback: (data?: any) => void) {
    const listeners = this.uiEventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private triggerUI(event: UIEvent, data?: any) {
    console.log(`RoadsideAssistanceSystem: Triggering UI event ${event}`, data);
    const listeners = this.uiEventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  // User Actions
  async sendRequest(userId: string, serviceType: ServiceRequest['type'], description: string, userLocation: { lat: number; lng: number }): Promise<string> {
    try {
      // Check for existing active request
      const existingRequest = await this.supabaseService.getUserActiveRequest(userId);
      if (existingRequest) {
        throw new Error('User already has an active request');
      }

      const request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        type: serviceType,
        status: 'pending',
        declineCount: 0,
        description,
        userLocation
      };

      const requestId = await this.supabaseService.createServiceRequest(request);
      
      const fullRequest: ServiceRequest = {
        ...request,
        id: requestId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.activeRequests.set(requestId, fullRequest);
      this.triggerUI('show_searching_technician', fullRequest);

      if (this.isSimulation) {
        await this.assignSimulatedEmployee(requestId);
      } else {
        this.addToEmployeeDashboard(fullRequest);
      }

      return requestId;
    } catch (error) {
      console.error('Error sending request:', error);
      throw error;
    }
  }

  async acceptQuote(requestId: string): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      await this.supabaseService.updateServiceRequest(requestId, { status: 'accepted' });
      request.status = 'accepted';
      
      this.triggerUI('show_request_started', request);

      if (this.isSimulation) {
        await this.simulateEmployeeMovement(request);
      } else {
        this.notifyEmployee(request.assignedEmployeeId!, 'user_accepted_quote');
        this.triggerUI('show_employee_en_route', request);
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
      throw error;
    }
  }

  async declineQuote(requestId: string): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request) return;

      request.declineCount++;
      await this.supabaseService.updateServiceRequest(requestId, { 
        declineCount: request.declineCount 
      });

      if (request.declineCount === 1 && !request.revisedPriceQuote) {
        // First decline - request revision
        await this.requestPriceRevision(requestId);
      } else {
        // Second decline or already revised - blacklist and find new employee
        await this.blacklistEmployeeAndFindNew(requestId);
      }
    } catch (error) {
      console.error('Error declining quote:', error);
      throw error;
    }
  }

  async cancelRequest(requestId: string): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request) return;

      await this.supabaseService.updateServiceRequest(requestId, { status: 'cancelled' });
      await this.supabaseService.resetBlacklist(requestId);
      
      this.activeRequests.delete(requestId);
      
      toast({
        title: "Request Cancelled",
        description: "Your service request has been cancelled."
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      throw error;
    }
  }

  // Employee Actions
  async sendPriceQuote(employeeId: string, requestId: string, price: number): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request) return;

      const isValid = await this.supabaseService.validatePrice(request.type, price);
      if (!isValid) {
        throw new Error('Invalid price for service type');
      }

      await this.supabaseService.updateServiceRequest(requestId, {
        priceQuote: price,
        status: 'quote_sent',
        assignedEmployeeId: employeeId
      });

      request.priceQuote = price;
      request.status = 'quote_sent';
      request.assignedEmployeeId = employeeId;

      this.triggerUI('show_price_quote_received', request);
    } catch (error) {
      console.error('Error sending price quote:', error);
      throw error;
    }
  }

  async editPriceQuote(employeeId: string, requestId: string, newPrice: number, explanation: string): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request || !request.priceQuote) return;

      const isValid = await this.supabaseService.validatePrice(request.type, newPrice);
      if (!isValid || 
          newPrice >= request.priceQuote ||
          explanation.length < 15 || 
          explanation.length > 50) {
        throw new Error('Invalid price edit parameters');
      }

      await this.supabaseService.updateServiceRequest(requestId, {
        revisedPriceQuote: newPrice,
        status: 'quote_revised'
      });

      request.revisedPriceQuote = newPrice;
      request.status = 'quote_revised';

      this.triggerUI('show_price_edit_notification', { request, explanation });
    } catch (error) {
      console.error('Error editing price quote:', error);
      throw error;
    }
  }

  // Simulation Logic
  private async assignSimulatedEmployee(requestId: string): Promise<void> {
    try {
      const employees = await this.supabaseService.getAvailableSimulatedEmployees();
      const blacklisted = await this.supabaseService.getBlacklistedEmployees(requestId);
      
      const availableEmployees = employees.filter(emp => 
        !blacklisted.includes(emp.id)
      );

      if (availableEmployees.length === 0) {
        this.triggerUI('show_no_technicians_available');
        await this.supabaseService.updateServiceRequest(requestId, { status: 'cancelled' });
        return;
      }

      const randomEmployee = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
      const request = this.activeRequests.get(requestId);
      if (!request) return;

      await this.supabaseService.updateServiceRequest(requestId, {
        assignedEmployeeId: randomEmployee.id
      });

      request.assignedEmployeeId = randomEmployee.id;
      this.triggerUI('show_request_accepted', request);

      // Generate quote after 2-5 seconds
      setTimeout(async () => {
        try {
          const price = await this.supabaseService.generatePriceQuote(request.type);
          await this.sendPriceQuote(randomEmployee.id, requestId, price);
        } catch (error) {
          console.error('Error generating simulated quote:', error);
        }
      }, 2000 + Math.random() * 3000);

    } catch (error) {
      console.error('Error assigning simulated employee:', error);
      this.triggerUI('show_no_technicians_available');
    }
  }

  private async simulateEmployeeMovement(request: ServiceRequest): Promise<void> {
    this.triggerUI('show_live_tracking', request);

    // Simulate service in progress
    setTimeout(async () => {
      try {
        await this.supabaseService.updateServiceRequest(request.id, { status: 'in_progress' });
        request.status = 'in_progress';
        
        // Complete service after another delay
        setTimeout(async () => {
          await this.completeRequest(request.id);
        }, 15000); // 15 seconds for service completion
      } catch (error) {
        console.error('Error updating service progress:', error);
      }
    }, 5000); // 5 seconds travel time
  }

  private async requestPriceRevision(requestId: string): Promise<void> {
    const request = this.activeRequests.get(requestId);
    if (!request || !request.assignedEmployeeId) return;

    if (this.isSimulation) {
      // Simulate revised quote generation
      setTimeout(async () => {
        try {
          const originalPrice = request.priceQuote || 50;
          const revisedPrice = Math.max(
            originalPrice * 0.7, // 30% discount minimum
            originalPrice - 20 // Or 20 BGN discount minimum
          );
          
          await this.editPriceQuote(
            request.assignedEmployeeId!,
            requestId,
            Math.round(revisedPrice),
            'Revised price due to customer feedback'
          );
        } catch (error) {
          console.error('Error generating revised quote:', error);
        }
      }, 3000);
    } else {
      this.notifyEmployee(request.assignedEmployeeId, 'quote_declined_revision_requested');
    }
  }

  private async blacklistEmployeeAndFindNew(requestId: string): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request || !request.assignedEmployeeId) return;

      // Blacklist current employee
      await this.supabaseService.blacklistEmployee(
        requestId,
        request.assignedEmployeeId,
        request.userId
      );

      // Reset request state
      await this.supabaseService.updateServiceRequest(requestId, {
        assignedEmployeeId: null,
        priceQuote: null,
        revisedPriceQuote: null,
        status: 'pending'
      });

      request.assignedEmployeeId = undefined;
      request.priceQuote = undefined;
      request.revisedPriceQuote = undefined;
      request.status = 'pending';

      this.triggerUI('show_searching_technician', request);

      // Find new employee
      if (this.isSimulation) {
        setTimeout(() => {
          this.assignSimulatedEmployee(requestId);
        }, 2000);
      }
    } catch (error) {
      console.error('Error blacklisting employee:', error);
    }
  }

  private async completeRequest(requestId: string): Promise<void> {
    try {
      const request = this.activeRequests.get(requestId);
      if (!request) return;

      await this.supabaseService.updateServiceRequest(requestId, { status: 'completed' });
      await this.supabaseService.addToHistory(request);
      await this.supabaseService.resetBlacklist(requestId);

      request.status = 'completed';
      this.triggerUI('show_service_completed', request);

      // Clean up after showing completion
      setTimeout(() => {
        this.activeRequests.delete(requestId);
      }, 5000);

      toast({
        title: "Service Completed",
        description: `Your ${request.type} service has been completed successfully.`
      });
    } catch (error) {
      console.error('Error completing request:', error);
    }
  }

  // Utility Methods
  private addToEmployeeDashboard(request: ServiceRequest): void {
    // This would notify real employees in production
    console.log('Adding request to employee dashboard:', request);
  }

  private notifyEmployee(employeeId: string, notification: string): void {
    // This would send real notifications in production
    console.log(`Notifying employee ${employeeId}: ${notification}`);
  }

  // Ban System
  handleUserLogout(userId: string): void {
    this.supabaseService.getUserActiveRequest(userId).then(request => {
      if (request) {
        const timer = setTimeout(() => {
          this.banUser(userId);
          this.cancelRequest(request.id);
        }, 5 * 60 * 1000); // 5 minutes
        
        this.userSessions.set(userId, timer);
      }
    });
  }

  handleUserLogin(userId: string): void {
    const timer = this.userSessions.get(userId);
    if (timer) {
      clearTimeout(timer);
      this.userSessions.delete(userId);
    }
  }

  private async banUser(userId: string): Promise<void> {
    try {
      // This would need to be implemented with actual user management
      console.log(`Banning user ${userId} for abandoning service request`);
    } catch (error) {
      console.error('Error banning user:', error);
    }
  }

  // Public getters
  getActiveRequest(requestId: string): ServiceRequest | undefined {
    return this.activeRequests.get(requestId);
  }

  setSimulationMode(enabled: boolean): void {
    this.isSimulation = enabled;
  }

  isSimulationMode(): boolean {
    return this.isSimulation;
  }
}

// Singleton instance
export const roadsideAssistanceSystem = new RoadsideAssistanceSystem();
