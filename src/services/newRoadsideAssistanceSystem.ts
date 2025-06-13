
import { toast } from '@/components/ui/use-toast';
import { NewSupabaseService } from './newSupabaseService';

const supabaseService = new NewSupabaseService();

export class NewRoadsideAssistanceSystem {
  
  static async requestRoadsideAssistance(
    userId: string,
    serviceType: string,
    location: { lat: number; lng: number },
    description?: string
  ) {
    try {
      // Check if user already has an active request
      const existingRequest = await supabaseService.getUserActiveRequest(userId);
      
      if (existingRequest) {
        toast({
          title: "Active Request Found",
          description: "You already have an active roadside assistance request.",
          variant: "destructive"
        });
        return { success: false, error: "User already has an active request" };
      }

      // Generate initial price quote
      const priceQuote = await supabaseService.generatePriceQuote(serviceType);

      // Create new service request
      const serviceRequest = await supabaseService.createServiceRequest({
        userId,
        type: serviceType,
        description,
        status: 'pending',
        priceQuote,
        userLocation: location
      });

      // Find available employees
      const availableEmployees = await supabaseService.getAvailableSimulatedEmployees();
      const blacklistedEmployees = await supabaseService.getBlacklistedEmployees(userId, serviceRequest.id);
      
      const eligibleEmployees = availableEmployees.filter(emp => 
        !blacklistedEmployees.includes(emp.name)
      );

      if (eligibleEmployees.length === 0) {
        // Reset blacklist and try again
        await supabaseService.resetBlacklist(userId, serviceRequest.id);
        
        toast({
          title: "No Available Employees",
          description: "All employees are currently busy. Please try again later.",
          variant: "destructive"
        });
        return { success: false, error: "No available employees" };
      }

      // Randomly select an employee
      const selectedEmployee = eligibleEmployees[Math.floor(Math.random() * eligibleEmployees.length)];
      
      // Assign employee to request
      await supabaseService.assignEmployeeToRequest(serviceRequest.id, selectedEmployee.id);
      
      // Update employee availability
      await supabaseService.updateEmployeeAvailability(selectedEmployee.id, false);

      toast({
        title: "Request Submitted",
        description: `Your roadside assistance request has been assigned to ${selectedEmployee.name}.`,
      });

      return { 
        success: true, 
        requestId: serviceRequest.id,
        employeeName: selectedEmployee.name,
        priceQuote 
      };

    } catch (error) {
      console.error('Error requesting roadside assistance:', error);
      toast({
        title: "Request Failed",
        description: "Failed to submit your roadside assistance request. Please try again.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  }

  static async acceptQuote(userId: string, requestId: string) {
    try {
      const isValidPrice = await supabaseService.validatePrice('roadside_assistance', 0); // Default validation
      
      if (!isValidPrice) {
        toast({
          title: "Invalid Price",
          description: "The price quote is invalid. Please request a new quote.",
          variant: "destructive"
        });
        return { success: false, error: "Invalid price" };
      }

      await supabaseService.updateServiceRequest(requestId, {
        status: 'accepted'
      });

      toast({
        title: "Quote Accepted",
        description: "You have accepted the price quote. The technician will arrive shortly.",
      });

      return { success: true };

    } catch (error) {
      console.error('Error accepting quote:', error);
      return { success: false, error: error.message };
    }
  }

  static async declineQuote(userId: string, requestId: string) {
    try {
      const isValidPrice = await supabaseService.validatePrice('roadside_assistance', 0); // Default validation
      
      if (!isValidPrice) {
        toast({
          title: "Invalid Price",
          description: "The price quote is invalid. Please request a new quote.",
          variant: "destructive"
        });
        return { success: false, error: "Invalid price" };
      }

      // Get current request
      const request = await supabaseService.getUserActiveRequest(userId);
      if (!request) {
        return { success: false, error: "No active request found" };
      }

      // Increment decline count
      const newDeclineCount = (request.declineCount || 0) + 1;
      
      if (newDeclineCount >= 3) {
        // Cancel request after 3 declines
        await supabaseService.updateServiceRequest(requestId, {
          status: 'cancelled',
          declineCount: newDeclineCount
        });

        toast({
          title: "Request Cancelled",
          description: "Your request has been cancelled after 3 declines.",
          variant: "destructive"
        });

        return { success: true, cancelled: true };
      }

      // Find new employee
      const availableEmployees = await supabaseService.getAvailableSimulatedEmployees();
      const blacklistedEmployees = await supabaseService.getBlacklistedEmployees(userId, requestId);
      
      // Add current employee to blacklist
      if (request.assignedEmployeeId) {
        const employees = await supabaseService.getAvailableEmployees();
        const currentEmployee = employees.find(emp => emp.id === request.assignedEmployeeId);
        if (currentEmployee) {
          await supabaseService.blacklistEmployee(userId, currentEmployee.name, requestId);
        }
      }

      const eligibleEmployees = availableEmployees.filter(emp => 
        !blacklistedEmployees.includes(emp.name) && emp.id !== request.assignedEmployeeId
      );

      if (eligibleEmployees.length === 0) {
        // Reset blacklist if no employees available
        await supabaseService.resetBlacklist(userId, requestId);
        
        toast({
          title: "No Available Employees",
          description: "All employees are currently busy. Your request remains active.",
        });
        return { success: false, error: "No available employees" };
      }

      // Generate new price quote
      const newPriceQuote = await supabaseService.generatePriceQuote(request.type);
      
      // Select new employee
      const newEmployee = eligibleEmployees[Math.floor(Math.random() * eligibleEmployees.length)];
      
      // Update request with new employee and price
      await supabaseService.updateServiceRequest(requestId, {
        assignedEmployeeId: newEmployee.id,
        revisedPriceQuote: newPriceQuote,
        declineCount: newDeclineCount,
        status: 'pending'
      });

      toast({
        title: "New Quote Generated",
        description: `A new technician has been assigned with a revised quote.`,
      });

      return { 
        success: true, 
        newEmployeeName: newEmployee.name, 
        newPriceQuote 
      };

    } catch (error) {
      console.error('Error declining quote:', error);
      return { success: false, error: error.message };
    }
  }

  static async cancelRequest(userId: string, requestId: string) {
    try {
      await supabaseService.updateServiceRequest(requestId, {
        status: 'cancelled'
      });

      // Free up the assigned employee
      const request = await supabaseService.getUserActiveRequest(userId);
      if (request && request.assignedEmployeeId) {
        await supabaseService.updateEmployeeAvailability(request.assignedEmployeeId, true);
      }

      // Clean up blacklist
      await supabaseService.resetBlacklist(userId, requestId);

      toast({
        title: "Request Cancelled",
        description: "Your roadside assistance request has been cancelled.",
      });

      return { success: true };

    } catch (error) {
      console.error('Error cancelling request:', error);
      return { success: false, error: error.message };
    }
  }

  static async completeRequest(userId: string, requestId: string) {
    try {
      const request = await supabaseService.getUserActiveRequest(userId);
      if (!request) {
        return { success: false, error: "No active request found" };
      }

      // Add to history
      await supabaseService.addToHistory({
        user_id: userId,
        username: userId, // This should be actual username
        service_type: request.type,
        status: 'completed',
        employee_name: request.assignedEmployeeId, // This should be actual employee name
        price_paid: request.revisedPriceQuote || request.priceQuote,
        service_fee: 5,
        total_price: (request.revisedPriceQuote || request.priceQuote || 0) + 5,
        request_date: request.createdAt,
        completion_date: new Date().toISOString(),
        latitude: request.userLocation?.lat,
        longitude: request.userLocation?.lng
      });

      // Update request status
      await supabaseService.updateServiceRequest(requestId, {
        status: 'completed'
      });

      // Free up employee
      if (request.assignedEmployeeId) {
        await supabaseService.updateEmployeeAvailability(request.assignedEmployeeId, true);
      }

      // Clean up blacklist
      await supabaseService.resetBlacklist(userId, requestId);

      toast({
        title: "Service Completed",
        description: "Your roadside assistance service has been completed successfully.",
      });

      return { success: true };

    } catch (error) {
      console.error('Error completing request:', error);
      return { success: false, error: error.message };
    }
  }

  static async getUserActiveRequest(userId: string) {
    try {
      const request = await supabaseService.getUserActiveRequest(userId);
      return { success: true, request };
    } catch (error) {
      console.error('Error getting user active request:', error);
      return { success: false, error: error.message };
    }
  }
}
