import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';
import { EmployeeResponse } from '@/components/service/types/serviceRequestState';
import { useQuoteHandling } from '@/hooks/useQuoteHandling';
import { createServiceRequest, handleAcceptQuote, handleCancelRequest } from '@/services/serviceRequestActions';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { ServiceType } from '@/components/service/types/serviceRequestState';

interface UseServiceRequestLogicRealLifeProps {
  type: ServiceRequest['type'];
  open: boolean;
  userLocation: { lat: number; lng: number };
  userId: string;
  onClose: () => void;
  onMinimize: () => void;
  persistentState: ReturnType<typeof usePersistentServiceRequest>;
}

export const useServiceRequestLogicRealLife = ({
  type,
  open,
  userLocation,
  userId,
  onClose,
  onMinimize,
  persistentState
}: UseServiceRequestLogicRealLifeProps) => {
  const [currentScreen, setCurrentScreen] = useState<'initial' | 'finding-employee' | 'price-quote' | 'waiting-revision' | 'employee-on-way' | 'employee-arrived' | 'service-in-progress' | 'completed'>('initial');
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    showPriceQuote,
    priceQuote,
    employeeName,
    hasDeclinedOnce,
    showWaitingForRevision,
    handleAcceptQuoteAction,
    handleDeclineQuoteAction,
    resetQuoteState
  } = useQuoteHandling({
    onAcceptQuote: () => {
      console.log('Quote accepted in real-life mode');
      setCurrentScreen('employee-on-way');
    },
    onDeclineQuote: () => {
      console.log('Quote declined in real-life mode - finding new employee');
      setCurrentScreen('finding-employee');
    },
    onCancelRequest: () => {
      console.log('Request cancelled in real-life mode');
      handleClose();
    }
  });

  const [employeeManager] = useState({
    loadEmployees: async () => {},
    findEmployee: async () => {}
  });

  const getServiceTypeEnum = (serviceType: string): ServiceType => {
    const serviceTypeMap: Record<string, ServiceType> = {
      'Flat Tyre': 'flat-tyre',
      'Out of Fuel': 'out-of-fuel',
      'Car Battery': 'car-battery',
      'Other Car Problems': 'other-car-problems',
      'Tow Truck': 'tow-truck'
    };
    
    if (Object.values(serviceTypeMap).includes(serviceType as ServiceType)) {
      return serviceType as ServiceType;
    }
    
    return serviceTypeMap[serviceType] || 'other-car-problems';
  };

  const findEmployee = async (request: ServiceRequest) => {
    console.log('Finding real-life employee for request:', request.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const employeeResponse: EmployeeResponse = {
        id: `emp-${Date.now()}`,
        name: `Real Employee ${Math.floor(Math.random() * 100)}`,
        location: {
          lat: userLocation.lat + (Math.random() - 0.5) * 0.01,
          lng: userLocation.lng + (Math.random() - 0.5) * 0.01
        },
        specialties: [getServiceTypeEnum(request.type)],
        rating: 4.5 + Math.random() * 0.5,
        vehicleInfo: `Service Van - License: ABC${Math.floor(Math.random() * 1000)}`,
        isAvailable: true
      };
      
      console.log('Real-life employee found:', employeeResponse);
      setCurrentEmployee(employeeResponse);
      
      const quote = 50 + Math.random() * 100;
      handleAcceptQuoteAction(employeeResponse, quote);
      setCurrentScreen('price-quote');
      
    } catch (error) {
      console.error('Error finding real-life employee:', error);
      toast({
        title: "Error",
        description: "Failed to find an available employee. Please try again.",
        variant: "destructive"
      });
      setCurrentScreen('initial');
    }
  };

  useEffect(() => {
    if (open && !currentRequest) {
      console.log('Real-life service request opened:', type);
      handleCreateRequest();
    }
  }, [open, type]);

  const handleCreateRequest = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setCurrentScreen('finding-employee');
    
    try {
      const requestId = await createServiceRequest(type, userLocation, userId, 'Finding real employee...');
      
      const newRequest: ServiceRequest = {
        id: requestId,
        type,
        userId,
        userLocation,
        status: 'finding-employee',
        description: 'Finding real employee...',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentRequest(newRequest);
      persistentState.setCurrentRequest(newRequest);
      
      await findEmployee(newRequest);
      
    } catch (error) {
      console.error('Error creating real-life service request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive"
      });
      setCurrentScreen('initial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptQuote = async () => {
    if (!currentRequest || !currentEmployee) return;
    
    try {
      await handleAcceptQuote(currentRequest.id, priceQuote);
      setCurrentScreen('employee-on-way');
      
      toast({
        title: "Quote Accepted",
        description: `${employeeName} is on the way to your location.`,
      });
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast({
        title: "Error",
        description: "Failed to accept quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineQuote = async () => {
    if (!currentRequest) return;
    
    try {
      setCurrentScreen('finding-employee');
      await findEmployee(currentRequest);
    } catch (error) {
      console.error('Error declining quote:', error);
      toast({
        title: "Error",
        description: "Failed to find alternative employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelRequest = async () => {
    if (!currentRequest) return;
    
    try {
      await handleCancelRequest(currentRequest.id);
      handleClose();
      
      toast({
        title: "Request Cancelled",
        description: "Your service request has been cancelled.",
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

  const handleClose = () => {
    setCurrentRequest(null);
    setCurrentEmployee(null);
    setCurrentScreen('initial');
    resetQuoteState();
    persistentState.resetState();
    onClose();
  };

  const handleMinimize = () => {
    onMinimize();
  };

  return {
    currentScreen,
    currentRequest,
    currentEmployee,
    isLoading,
    showPriceQuote,
    priceQuote,
    employeeName,
    hasDeclinedOnce,
    showWaitingForRevision,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize
  };
};
