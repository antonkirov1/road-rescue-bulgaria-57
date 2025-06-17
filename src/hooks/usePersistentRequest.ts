
import { useState, useCallback } from 'react';
import { ServiceRequest, ServiceRequestStatus } from '@/types/newServiceRequest';

interface PersistentRequestState {
  request: ServiceRequest | null;
  step: ServiceRequestStatus | null;
  isMinimized: boolean;
}

export const usePersistentRequest = () => {
  const [persistentState, setPersistentState] = useState<PersistentRequestState>({
    request: null,
    step: null,
    isMinimized: false
  });

  const setActiveRequest = useCallback((request: ServiceRequest | null, step: ServiceRequestStatus | null) => {
    setPersistentState(prev => ({
      ...prev,
      request,
      step,
      isMinimized: false
    }));
  }, []);

  const minimizeRequest = useCallback(() => {
    setPersistentState(prev => ({
      ...prev,
      isMinimized: true
    }));
  }, []);

  const restoreRequest = useCallback(() => {
    setPersistentState(prev => ({
      ...prev,
      isMinimized: false
    }));
  }, []);

  const clearRequest = useCallback(() => {
    setPersistentState({
      request: null,
      step: null,
      isMinimized: false
    });
  }, []);

  const hasActiveRequest = persistentState.request !== null && persistentState.step !== null;

  return {
    request: persistentState.request,
    step: persistentState.step,
    isMinimized: persistentState.isMinimized,
    hasActiveRequest,
    setActiveRequest,
    minimizeRequest,
    restoreRequest,
    clearRequest
  };
};
