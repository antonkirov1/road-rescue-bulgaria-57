
import { useState, useCallback } from 'react';
import { useEmployeeSimulation } from '@/hooks/useEmployeeSimulation';

export type SimulatedRequestStep = 
  | 'searching'
  | 'no_technician'
  | 'quote_received'
  | 'revised_quote'
  | 'live_tracking'
  | 'completed'
  | 'cancelled'
  | 'rate_employee';

export interface SimulatedServiceRequest {
  id: string;
  type: string;
  status: string;
  assignedEmployeeName?: string;
  priceQuote?: number;
  revisedPriceQuote?: number;
  declineCount: number;
  hasReceivedRevision: boolean;
  employeeRating?: number;
}

export const useSimulatedServiceRequest = () => {
  const [step, setStep] = useState<SimulatedRequestStep | null>(null);
  const [request, setRequest] = useState<SimulatedServiceRequest | null>(null);
  const { getRandomEmployee } = useEmployeeSimulation();

  const createRequest = useCallback(async (
    type: string,
    description: string,
    userId: string,
    isRealLife: boolean = false
  ) => {
    if (isRealLife) return; // Don't handle real-life requests

    console.log('Creating simulated service request:', { type, description, userId });
    
    const newRequest: SimulatedServiceRequest = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'searching',
      declineCount: 0,
      hasReceivedRevision: false
    };

    setRequest(newRequest);
    setStep('searching');

    // Simulate finding a technician after 2-4 seconds
    setTimeout(() => {
      const employee = getRandomEmployee([]);
      if (employee) {
        const updatedRequest = {
          ...newRequest,
          assignedEmployeeName: employee.full_name,
          priceQuote: Math.floor(Math.random() * 100) + 50,
          status: 'quote_received'
        };
        setRequest(updatedRequest);
        setStep('quote_received');
        console.log('Simulated employee assigned:', employee.full_name);
      } else {
        setStep('no_technician');
      }
    }, 2000 + Math.random() * 2000);
  }, [getRandomEmployee]);

  const acceptQuote = useCallback(() => {
    if (!request) return;
    
    console.log('Accepting quote for simulated request');
    const updatedRequest = { ...request, status: 'accepted' };
    setRequest(updatedRequest);
    setStep('live_tracking');

    // Simulate service completion after 3 seconds
    setTimeout(() => {
      setStep('completed');
    }, 3000);
  }, [request]);

  const acceptRevisedQuote = useCallback(() => {
    if (!request) return;
    
    console.log('Accepting revised quote for simulated request');
    const updatedRequest = { ...request, status: 'accepted' };
    setRequest(updatedRequest);
    setStep('live_tracking');

    // Simulate service completion after 3 seconds
    setTimeout(() => {
      setStep('completed');
    }, 3000);
  }, [request]);

  const declineQuote = useCallback(() => {
    if (!request) return;

    console.log('Declining quote for simulated request');
    const newDeclineCount = request.declineCount + 1;
    
    if (newDeclineCount >= 2) {
      // After 2 declines, show final decline or no technician
      setStep('no_technician');
      return;
    }

    // Find new employee and offer revised quote
    const excludedEmployees = request.assignedEmployeeName ? [request.assignedEmployeeName] : [];
    const newEmployee = getRandomEmployee(excludedEmployees);
    
    if (newEmployee) {
      const updatedRequest = {
        ...request,
        assignedEmployeeName: newEmployee.full_name,
        revisedPriceQuote: Math.floor(Math.random() * 80) + 40,
        declineCount: newDeclineCount,
        hasReceivedRevision: true,
        status: 'revised_quote'
      };
      setRequest(updatedRequest);
      setStep('revised_quote');
    } else {
      setStep('no_technician');
    }
  }, [request, getRandomEmployee]);

  const finalDeclineQuote = useCallback((isRealLife: boolean = false) => {
    if (isRealLife) return; // Don't handle real-life requests
    
    console.log('Final decline for simulated request');
    setStep('no_technician');
  }, []);

  const cancelRequest = useCallback(() => {
    console.log('Cancelling simulated request');
    if (request) {
      setRequest({ ...request, status: 'cancelled' });
    }
    setStep('cancelled');
  }, [request]);

  const completeRequest = useCallback(() => {
    console.log('Completing simulated request');
    if (request) {
      setRequest({ ...request, status: 'completed' });
    }
    setStep('rate_employee');
  }, [request]);

  const rateEmployee = useCallback((rating: number) => {
    console.log('Rating employee for simulated request:', rating);
    if (request) {
      setRequest({ ...request, employeeRating: rating, status: 'rated' });
    }
    // Close after rating
    closeAll();
  }, [request]);

  const handleNoTechnicianOk = useCallback(() => {
    console.log('No technician available for simulated request');
    closeAll();
  }, []);

  const closeAll = useCallback(() => {
    console.log('Closing simulated request system');
    setStep(null);
    setRequest(null);
  }, []);

  return {
    step,
    request,
    createRequest,
    acceptQuote,
    acceptRevisedQuote,
    declineQuote,
    finalDeclineQuote,
    cancelRequest,
    closeAll,
    handleNoTechnicianOk,
    completeRequest,
    rateEmployee,
  };
};
