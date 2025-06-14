
import { useState, useEffect, useCallback } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { useServiceRequestManagerRealLife } from '@/hooks/useServiceRequestManagerRealLife';

interface RealLifeEmployee {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  specialties: ServiceType[];
  rating: number;
  vehicleInfo: string;
  isAvailable: boolean;
}

interface UseServiceRequestLogicRealLifeProps {
  type: ServiceRequest['type'];
  open: boolean;
  userLocation: { lat: number; lng: number };
  userId: string;
  onClose: () => void;
  onMinimize: () => void;
  persistentState: any;
}

const getServiceTypeEnum = (displayName: string): ServiceType => {
  const mapping: Record<string, ServiceType> = {
    'Flat Tyre': 'flat-tyre',
    'Out of Fuel': 'out-of-fuel',
    'Car Battery': 'car-battery',
    'Other Car Problems': 'other-car-problems',
    'Tow Truck': 'tow-truck'
  };
  return mapping[displayName] || 'other-car-problems';
};

export const useServiceRequestLogicRealLife = ({
  type,
  open,
  userLocation,
  userId,
  onClose,
  onMinimize,
  persistentState
}: UseServiceRequestLogicRealLifeProps) => {
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [assignedEmployee, setAssignedEmployee] = useState<RealLifeEmployee | null>(null);
  const [showPriceQuote, setShowPriceQuote] = useState(false);
  const [priceQuote, setPriceQuote] = useState<number | null>(null);
  const [hasDeclinedOnce, setHasDeclinedOnce] = useState(false);
  const [isWaitingForRevision, setIsWaitingForRevision] = useState(false);

  const { currentRequest, createRequest, acceptQuote, declineQuote, cancelRequest } = useServiceRequestManagerRealLife();

  useEffect(() => {
    if (open && !currentRequest) {
      handleCreateRequest();
    }
  }, [open, type]);

  const handleCreateRequest = useCallback(async () => {
    try {
      setCurrentScreen('show_creating_request');
      
      const requestId = await createRequest(type, userLocation, `Service request for ${type}`);
      
      // Simulate finding an employee
      setTimeout(() => {
        setCurrentScreen('show_searching_technician');
        findEmployee();
      }, 1500);
      
    } catch (error) {
      console.error('Error creating request:', error);
    }
  }, [type, userLocation, createRequest]);

  const findEmployee = useCallback(() => {
    // Simulate finding a real employee
    setTimeout(() => {
      const mockEmployee: RealLifeEmployee = {
        id: 'real-emp-' + Math.random().toString(36).substr(2, 9),
        name: `Real Employee ${Math.floor(Math.random() * 100)}`,
        location: {
          lat: userLocation.lat + (Math.random() - 0.5) * 0.01,
          lng: userLocation.lng + (Math.random() - 0.5) * 0.01
        },
        specialties: [getServiceTypeEnum(type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))],
        rating: 4.5 + Math.random() * 0.5,
        vehicleInfo: `Van ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        isAvailable: true
      };

      setAssignedEmployee(mockEmployee);
      setCurrentScreen('show_employee_found');
      
      // Generate quote after employee is found
      setTimeout(() => {
        generateQuote(mockEmployee);
      }, 2000);
      
    }, 3000);
  }, [userLocation, type]);

  const generateQuote = useCallback((employee: RealLifeEmployee) => {
    const basePrice = Math.floor(Math.random() * 50) + 50; // 50-100 BGN
    setPriceQuote(basePrice);
    setShowPriceQuote(true);
    setCurrentScreen('show_price_quote_received');
  }, []);

  const handleAcceptQuote = useCallback(async () => {
    try {
      await acceptQuote();
      setCurrentScreen('show_service_in_progress');
      
      // Simulate service completion
      setTimeout(() => {
        setCurrentScreen('show_service_completed');
      }, 10000);
      
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  }, [acceptQuote]);

  const handleDeclineQuote = useCallback(async () => {
    try {
      if (!hasDeclinedOnce) {
        // First decline - offer revision
        setHasDeclinedOnce(true);
        setIsWaitingForRevision(true);
        setCurrentScreen('show_waiting_for_revision');
        
        // Simulate revised quote
        setTimeout(() => {
          const revisedPrice = priceQuote ? Math.floor(priceQuote * 0.8) : 40;
          setPriceQuote(revisedPrice);
          setIsWaitingForRevision(false);
          setCurrentScreen('show_revised_price_quote');
        }, 3000);
        
      } else {
        // Second decline - find new employee
        await declineQuote();
        setAssignedEmployee(null);
        setShowPriceQuote(false);
        setPriceQuote(null);
        setHasDeclinedOnce(false);
        setCurrentScreen('show_searching_technician');
        findEmployee();
      }
    } catch (error) {
      console.error('Error declining quote:', error);
    }
  }, [hasDeclinedOnce, priceQuote, declineQuote, findEmployee]);

  const handleCancelRequest = useCallback(async () => {
    try {
      await cancelRequest();
      setCurrentScreen(null);
      onClose();
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  }, [cancelRequest, onClose]);

  const handleClose = useCallback(() => {
    if (currentRequest && !['completed', 'cancelled'].includes(currentRequest.status)) {
      handleCancelRequest();
    } else {
      onClose();
    }
  }, [currentRequest, handleCancelRequest, onClose]);

  const handleMinimize = useCallback(() => {
    onMinimize();
  }, [onMinimize]);

  return {
    currentScreen,
    currentRequest,
    assignedEmployee,
    showPriceQuote,
    priceQuote,
    hasDeclinedOnce,
    isWaitingForRevision,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize
  };
};
