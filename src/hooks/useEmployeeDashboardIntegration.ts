
import { useState, useEffect } from 'react';
import { employeeIntegrationService, EmployeeResponse } from '@/services/newEmployeeIntegration';
import { ServiceRequest } from '@/types/newServiceRequest';

export const useEmployeeDashboardIntegration = (employeeId: string, employeeName: string) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    // Register as a real employee
    const registerEmployee = async () => {
      await employeeIntegrationService.registerRealEmployee({
        id: employeeId,
        name: employeeName,
        location: { lat: 42.6977, lng: 23.3219 }, // Default Sofia location
        isAvailable: true
      });
    };

    registerEmployee();
  }, [employeeId, employeeName]);

  const updateAvailability = async (available: boolean) => {
    setIsAvailable(available);
    await employeeIntegrationService.updateEmployeeAvailability(employeeId, available);
  };

  const acceptRequest = async (request: ServiceRequest) => {
    setCurrentRequest(request);
    setIncomingRequests(prev => prev.filter(r => r.id !== request.id));
    await employeeIntegrationService.employeeAcceptedRequest(employeeId, request.id);
  };

  const declineRequest = async (request: ServiceRequest, reason?: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== request.id));
    await employeeIntegrationService.employeeDeclinedRequest(employeeId, request.id, reason);
  };

  const completeService = async (requestId: string) => {
    if (currentRequest?.id === requestId) {
      setCurrentRequest(null);
    }
  };

  return {
    isAvailable,
    incomingRequests,
    currentRequest,
    updateAvailability,
    acceptRequest,
    declineRequest,
    completeService
  };
};
