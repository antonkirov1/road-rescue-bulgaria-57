
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';
import { useRealLifeEmployeeManagement } from '@/hooks/useRealLifeEmployeeManagement';
import { useQuoteHandling } from '@/hooks/useQuoteHandling';
import { createServiceRequest, handleAcceptQuote, handleCancelRequest } from '@/services/serviceRequestActions';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';

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
  const [shouldPreserveState, setShouldPreserveState] = useState(false);
  
  // Use persistent state instead of local state
  const {
    currentScreen,
    currentRequest,
    assignedEmployee,
    blacklistedEmployees,
    employeeDeclineCount,
    hasReceivedRevision,
    setCurrentScreen,
    setCurrentRequest,
    setAssignedEmployee,
    setBlacklistedEmployees,
    setEmployeeDeclineCount,
    setHasReceivedRevision,
    resetState,
    resetEmployeeTracking
  } = persistentState;

  // Use real-life employee management instead of simulation
  const { getRandomEmployee } = useRealLifeEmployeeManagement();

  const { generateQuote, handleDeclineQuote } = useQuoteHandling({
    setCurrentRequest,
    setCurrentScreen,
    setAssignedEmployee,
    employeeDeclineCount,
    setEmployeeDeclineCount,
    hasReceivedRevision,
    setHasReceivedRevision,
    blacklistCurrentEmployee: (employeeId: string) => {
      setBlacklistedEmployees(prev => [...prev, employeeId]);
    },
    resetEmployeeTracking,
    findEmployee: async () => {} // Will be set below
  });

  const findEmployee = async (request: ServiceRequest) => {
    console.log('Finding real-life employee for request:', request.id);
    
    try {
      // Get available employee using real employee accounts
      const employee = getRandomEmployee(blacklistedEmployees);
      
      if (!employee) {
        console.log('No available real-life employees found');
        setCurrentScreen('show_no_technicians_available');
        return;
      }
      
      console.log('Found real-life employee:', employee.real_name || employee.username);
      
      const employeeResponse = {
        id: employee.id,
        name: employee.real_name || employee.username,
        location: {
          lat: userLocation.lat + (Math.random() - 0.5) * 0.01,
          lng: userLocation.lng + (Math.random() - 0.5) * 0.01
        },
        specialties: [request.type], // request.type is already a ServiceType
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        vehicleInfo: {
          type: 'Service Van',
          licensePlate: `SV${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        },
        isAvailable: true
      };
      
      setAssignedEmployee(employeeResponse);
      
      // Generate quote and show it
      setTimeout(() => {
        generateQuote(request, employeeResponse);
      }, 1000 + Math.random() * 2000);
      
    } catch (error) {
      console.error('Error finding real-life employee:', error);
      setCurrentScreen('show_no_technicians_available');
    }
  };

  // Initialize when dialog opens and there's no current request
  useEffect(() => {
    if (open && !currentRequest && !shouldPreserveState) {
      console.log('Initializing new real-life service request for:', type);
      handleSubmitRequest();
    } else if (open && shouldPreserveState) {
      console.log('Restoring minimized real-life service request');
      setShouldPreserveState(false);
    }
  }, [open, type]);

  // Only reset state when dialog is actually closed (not minimized)
  useEffect(() => {
    if (!open && !shouldPreserveState) {
      console.log('Real-life dialog closed - resetting state');
      resetState();
    }
  }, [open, shouldPreserveState]);

  const handleSubmitRequest = async () => {
    try {
      console.log('Starting real-life service request for:', type);
      
      const newRequest = createServiceRequest(type, userLocation, userId);
      setCurrentRequest(newRequest);
      setCurrentScreen('show_searching_technician');
      
      // Find available real-life employee
      setTimeout(async () => {
        await findEmployee(newRequest);
      }, 2000 + Math.random() * 2000);
      
    } catch (error) {
      console.error('Error creating real-life service request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive"
      });
      onClose();
    }
  };

  const handleAcceptQuoteWrapper = async () => {
    if (!currentRequest || !assignedEmployee) return;
    await handleAcceptQuote(currentRequest, assignedEmployee, setCurrentRequest, setCurrentScreen);
  };

  const handleDeclineQuoteWrapper = async () => {
    if (!currentRequest || !assignedEmployee) return;
    await handleDeclineQuote(currentRequest, assignedEmployee);
  };

  const handleCancelRequestWrapper = async () => {
    if (!currentRequest) return;
    await handleCancelRequest(currentRequest, assignedEmployee, resetState, onClose);
  };

  const handleClose = () => {
    console.log('Closing real-life service request completely');
    setShouldPreserveState(false);
    resetState();
    onClose();
  };

  const handleMinimizeWrapper = () => {
    console.log('Minimizing real-life service request - preserving state');
    setShouldPreserveState(true);
    onMinimize();
  };

  // Initialize when dialog opens and there's no current request
  useEffect(() => {
    if (open && !currentRequest && !shouldPreserveState) {
      console.log('Initializing new real-life service request for:', type);
      handleSubmitRequest();
    } else if (open && shouldPreserveState) {
      console.log('Restoring minimized real-life service request');
      setShouldPreserveState(false);
    }
  }, [open, type]);

  // Only reset state when dialog is actually closed (not minimized)
  useEffect(() => {
    if (!open && !shouldPreserveState) {
      console.log('Real-life dialog closed - resetting state');
      resetState();
    }
  }, [open, shouldPreserveState]);

  return {
    currentScreen,
    currentRequest,
    assignedEmployee,
    handleAcceptQuote: handleAcceptQuoteWrapper,
    handleDeclineQuote: handleDeclineQuoteWrapper,
    handleCancelRequest: handleCancelRequestWrapper,
    handleClose,
    handleMinimize: handleMinimizeWrapper
  };
};
