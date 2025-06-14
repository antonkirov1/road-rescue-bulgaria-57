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

const getDisplayName = (serviceType: ServiceType): ServiceRequest['type'] => {
  const mapping: Record<ServiceType, ServiceRequest['type']> = {
    'flat-tyre': 'Flat Tyre',
    'out-of-fuel': 'Out of Fuel',
    'car-battery': 'Car Battery',
    'other-car-problems': 'Other Car Problems',
    'tow-truck': 'Tow Truck',
    'emergency': 'Other Car Problems', // Map to closest equivalent
    'support': 'Other Car Problems' // Map to closest equivalent
  };
  return mapping[serviceType] || 'Other Car Problems';
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
  const { currentRequest, createRequest, acceptQuote, declineQuote, cancelRequest } = useServiceRequestManagerRealLife();

  useEffect(() => {
    if (open && !currentRequest) {
      handleCreateRequest();
    }
  }, [open, currentRequest, type]);

  const handleCreateRequest = useCallback(async () => {
    try {
      setCurrentScreen('show_creating_request');
      const serviceTypeEnum = getServiceTypeEnum(type);
      await createRequest(serviceTypeEnum, userLocation, `Service request for ${type}`);
    } catch (error) {
      console.error('Error creating request:', error);
      onClose();
    }
  }, [type, userLocation, createRequest, onClose]);

  useEffect(() => {
    if (!open) {
      setCurrentScreen(null);
      return;
    }

    if (!currentRequest) {
      if (!currentScreen) {
        setCurrentScreen('show_creating_request');
      }
      return;
    }

    switch (currentRequest.status) {
      case 'pending':
      case 'request_created':
        setCurrentScreen('show_searching_technician');
        break;
      // 'no_employees_available' is a simulation state, and there's no equivalent in the real backend state.
      // The service manager should handle this case, likely by canceling the request.
      case 'quote_received':
        if (currentRequest.hasReceivedRevision) {
          setCurrentScreen('show_revised_price_quote');
        } else {
          setCurrentScreen('show_price_quote_received');
        }
        break;
      case 'request_accepted':
      case 'quote_accepted':
      case 'employee_assigned':
      case 'accepted':
        setCurrentScreen('show_request_accepted');
        break;
      case 'in_progress':
        setCurrentScreen('show_live_tracking');
        break;
      case 'completed':
        setCurrentScreen('show_service_completed');
        break;
      case 'cancelled':
      case 'quote_declined':
      case 'declined':
        onClose();
        break;
      default:
        setCurrentScreen(null);
        break;
    }
  }, [currentRequest, open, onClose, currentScreen]);

  const handleAcceptQuote = useCallback(async () => {
    try {
      await acceptQuote();
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  }, [acceptQuote]);

  const handleDeclineQuote = useCallback(async () => {
    try {
      await declineQuote();
    } catch (error) {
      console.error('Error declining quote:', error);
    }
  }, [declineQuote]);

  const handleCancelRequest = useCallback(async () => {
    try {
      await cancelRequest();
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  }, [cancelRequest]);

  const handleClose = useCallback(() => {
    if (currentRequest && !['completed', 'cancelled', 'quote_declined'].includes(currentRequest.status)) {
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
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize
  };
};
