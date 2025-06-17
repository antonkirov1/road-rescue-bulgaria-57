
import { useState, useCallback } from 'react';
import { ServiceRequest, ServiceRequestStatus } from '@/types/newServiceRequest';

interface PersistentRequestState {
  request: ServiceRequest | null;
  step: ServiceRequestStatus | null;
  isMinimized: boolean;
  serviceType: string | null;
}

export const usePersistentRequest = () => {
  const [persistentState, setPersistentState] = useState<PersistentRequestState>({
    request: null,
    step: null,
    isMinimized: false,
    serviceType: null
  });

  const setActiveRequest = useCallback((request: ServiceRequest | null, step: ServiceRequestStatus | null, serviceType?: string) => {
    console.log('Setting active request:', { request, step, serviceType });
    setPersistentState(prev => ({
      ...prev,
      request,
      step,
      serviceType: serviceType || prev.serviceType,
      isMinimized: false
    }));
  }, []);

  const minimizeRequest = useCallback(() => {
    console.log('Minimizing request:', persistentState);
    setPersistentState(prev => ({
      ...prev,
      isMinimized: true
    }));
  }, [persistentState]);

  const restoreRequest = useCallback(() => {
    console.log('Restoring request:', persistentState);
    setPersistentState(prev => ({
      ...prev,
      isMinimized: false
    }));
  }, [persistentState]);

  const clearRequest = useCallback(() => {
    console.log('Clearing request');
    setPersistentState({
      request: null,
      step: null,
      isMinimized: false,
      serviceType: null
    });
  }, []);

  const hasActiveRequest = persistentState.request !== null && persistentState.step !== null;

  return {
    request: persistentState.request,
    step: persistentState.step,
    serviceType: persistentState.serviceType,
    isMinimized: persistentState.isMinimized,
    hasActiveRequest,
    setActiveRequest,
    minimizeRequest,
    restoreRequest,
    clearRequest
  };
};
