
import { ServiceRequest } from '@/types/newServiceRequest';
import { EmployeeResponse } from './newEmployeeIntegration';
import { toast } from '@/components/ui/use-toast';

export const createServiceRequest = (
  type: ServiceRequest['type'],
  userLocation: { lat: number; lng: number },
  userId: string
): ServiceRequest => {
  return {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    status: 'pending',
    userLocation,
    userId,
    declineCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const handleAcceptQuote = async (
  request: ServiceRequest,
  employee: EmployeeResponse,
  setCurrentRequest: (request: ServiceRequest) => void,
  setCurrentScreen: (screen: string) => void
): Promise<void> => {
  try {
    const updatedRequest = {
      ...request,
      status: 'accepted' as const,
      updatedAt: new Date()
    };
    
    setCurrentRequest(updatedRequest);
    setCurrentScreen('show_request_accepted');
    
    toast({
      title: "Quote Accepted",
      description: `${employee.name} will be with you shortly.`
    });

    // Simulate service progression
    setTimeout(() => {
      setCurrentScreen('show_employee_en_route');
    }, 2000);

    setTimeout(() => {
      setCurrentScreen('show_service_completed');
    }, 10000);
    
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
  request: ServiceRequest,
  employee: EmployeeResponse | null,
  resetState: () => void,
  onClose: () => void
): Promise<void> => {
  try {
    if (employee) {
      console.log(`Canceling request ${request.id} with employee ${employee.name}`);
    }
    
    toast({
      title: "Request Cancelled",
      description: "Your service request has been cancelled."
    });
    
    resetState();
    onClose();
    
  } catch (error) {
    console.error('Error canceling request:', error);
    toast({
      title: "Error",
      description: "Failed to cancel request. Please try again.",
      variant: "destructive"
    });
  }
};
