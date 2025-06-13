
import { ServiceRequest } from '@/types/newServiceRequest';
import { employeeIntegrationService, EmployeeResponse } from '@/services/newEmployeeIntegration';
import { toast } from '@/components/ui/use-toast';

export const createServiceRequest = (
  type: ServiceRequest['type'],
  userLocation: { lat: number; lng: number },
  userId: string
): ServiceRequest => {
  return {
    id: `req_${Date.now()}`,
    type: type,
    status: 'pending',
    userLocation: userLocation,
    userId: userId,
    description: `I need ${type} assistance`,
    declineCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const handleAcceptQuote = async (
  currentRequest: ServiceRequest,
  assignedEmployee: EmployeeResponse | null,
  setCurrentRequest: (request: ServiceRequest) => void,
  setCurrentScreen: (screen: string | null) => void
) => {
  if (!currentRequest || !assignedEmployee) return;
  
  try {
    const updatedRequest = {
      ...currentRequest,
      status: 'accepted' as const
    };
    setCurrentRequest(updatedRequest);
    setCurrentScreen('show_request_accepted');
    
    // Notify employee of acceptance
    if (assignedEmployee) {
      await employeeIntegrationService.employeeAcceptedRequest(assignedEmployee.id, currentRequest.id);
    }
    
    toast({
      title: "Quote Accepted",
      description: `${assignedEmployee.name} is on the way to your location.`
    });
    
    // Simulate service progression
    setTimeout(() => {
      setCurrentScreen('show_live_tracking');
    }, 2000);
    
    setTimeout(() => {
      const completedRequest = {
        ...updatedRequest,
        status: 'completed' as const
      };
      setCurrentRequest(completedRequest);
      setCurrentScreen('show_service_completed');
    }, 8000);
    
  } catch (error) {
    console.error('Error accepting quote:', error);
    toast({
      title: "Error",
      description: "Failed to accept quote. Please try again.",
      variant: "destructive"
    });
  }
};

export const handleCancelRequest = async (
  currentRequest: ServiceRequest | null,
  assignedEmployee: EmployeeResponse | null,
  resetState: () => void,
  onClose: () => void
) => {
  if (!currentRequest) return;
  
  try {
    // Notify assigned employee if any
    if (assignedEmployee) {
      await employeeIntegrationService.employeeDeclinedRequest(
        assignedEmployee.id,
        currentRequest.id,
        'Customer cancelled request'
      );
    }
    
    resetState();
    onClose();
    
    toast({
      title: "Request Cancelled",
      description: "Your service request has been cancelled."
    });
  } catch (error) {
    console.error('Error cancelling request:', error);
    toast({
      title: "Error",
      description: "Failed to cancel request. Please try again.",
      variant: "destructive"
    });
  }
};
