
import { useState } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { EmployeeResponse } from '@/services/newEmployeeIntegration';

export const usePersistentServiceRequest = () => {
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);
  const [assignedEmployee, setAssignedEmployee] = useState<EmployeeResponse | null>(null);
  const [blacklistedEmployees, setBlacklistedEmployees] = useState<string[]>([]);
  const [employeeDeclineCount, setEmployeeDeclineCount] = useState<number>(0);
  const [hasReceivedRevision, setHasReceivedRevision] = useState<boolean>(false);

  const resetState = () => {
    setCurrentScreen(null);
    setCurrentRequest(null);
    setAssignedEmployee(null);
    setBlacklistedEmployees([]);
    setEmployeeDeclineCount(0);
    setHasReceivedRevision(false);
  };

  const resetEmployeeTracking = () => {
    setEmployeeDeclineCount(0);
    setHasReceivedRevision(false);
  };

  return {
    // State
    currentScreen,
    currentRequest,
    assignedEmployee,
    blacklistedEmployees,
    employeeDeclineCount,
    hasReceivedRevision,
    // Setters
    setCurrentScreen,
    setCurrentRequest,
    setAssignedEmployee,
    setBlacklistedEmployees,
    setEmployeeDeclineCount,
    setHasReceivedRevision,
    // Actions
    resetState,
    resetEmployeeTracking
  };
};
