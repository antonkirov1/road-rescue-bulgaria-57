
import { useState, useEffect, useCallback } from 'react';
import { ServiceRequestManager, ServiceRequestState } from '@/services/serviceRequest/serviceRequestManager';
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { useRealLifeEmployeeManagement } from '@/hooks/useRealLifeEmployeeManagement';

export const useServiceRequestManagerRealLife = () => {
  const [currentRequest, setCurrentRequest] = useState<ServiceRequestState | null>(null);
  const { loadEmployees, getRandomEmployee } = useRealLifeEmployeeManagement();
  
  useEffect(() => {
    const manager = ServiceRequestManager.getInstance();
    
    // Initialize manager with real-life employee management functions
    manager.initialize({ loadEmployees, getRandomEmployee });
    
    // Subscribe to state changes
    const unsubscribe = manager.subscribe((request) => {
      setCurrentRequest(request);
    });
    
    // Get initial state
    setCurrentRequest(manager.getCurrentRequest());
    
    return unsubscribe;
  }, [loadEmployees, getRandomEmployee]);
  
  const createRequest = useCallback(async (
    type: ServiceType,
    userLocation: { lat: number; lng: number },
    message: string
  ): Promise<string> => {
    const manager = ServiceRequestManager.getInstance();
    return manager.createRequest(type, userLocation, message);
  }, []);
  
  const acceptQuote = useCallback(async (): Promise<void> => {
    const manager = ServiceRequestManager.getInstance();
    return manager.acceptQuote();
  }, []);
  
  const declineQuote = useCallback(async (): Promise<void> => {
    const manager = ServiceRequestManager.getInstance();
    return manager.declineQuote();
  }, []);
  
  const cancelRequest = useCallback(async (): Promise<void> => {
    const manager = ServiceRequestManager.getInstance();
    return manager.cancelRequest();
  }, []);
  
  return {
    currentRequest,
    createRequest,
    acceptQuote,
    declineQuote,
    cancelRequest
  };
};
