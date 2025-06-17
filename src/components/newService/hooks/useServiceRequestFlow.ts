
import { useState, useCallback } from 'react';
import { ServiceRequest, ServiceRequestStatus } from '@/types/newServiceRequest';
import { useEmployeeSimulation } from '@/hooks/useEmployeeSimulation';

export const useServiceRequestFlow = () => {
  const [step, setStep] = useState<ServiceRequestStatus | null>(null);
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const { getRandomEmployee, employees, isLoading } = useEmployeeSimulation();

  const createRequest = useCallback((
    type: ServiceRequest['type'], 
    description: string, 
    userId: string,
    isRealLife: boolean = false
  ) => {
    console.log('Creating request with type:', type, 'isRealLife:', isRealLife);
    console.log('Available employees:', employees.length, 'Loading:', isLoading);
    
    const newRequest: ServiceRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'searching',
      userLocation: { lat: 42.6977, lng: 23.3219 }, // Sofia coordinates
      userId,
      description,
      declineCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setRequest(newRequest);
    setStep('searching');

    // Wait for employees to load if they haven't loaded yet
    const findTechnician = () => {
      console.log('Finding technician - employees loaded:', employees.length > 0);
      
      if (isRealLife) {
        // In real life mode, simulate finding a technician after 2-4 seconds
        const searchTime = 2000 + Math.random() * 2000;
        setTimeout(() => {
          const updatedRequest = {
            ...newRequest,
            status: 'quote_received' as ServiceRequestStatus,
            assignedEmployeeName: `Technician ${Math.floor(Math.random() * 100) + 1}`,
            priceQuote: Math.floor(Math.random() * 50) + 80, // Random price between 80-130
            technicianEta: Math.floor(Math.random() * 20) + 10, // 10-30 minutes
            updatedAt: new Date()
          };
          console.log('Real life mode - found technician:', updatedRequest.assignedEmployeeName);
          setRequest(updatedRequest);
          setStep('quote_received');
        }, searchTime);
      } else {
        // In simulation mode, use database employees
        if (employees.length === 0) {
          console.log('No employees available, retrying in 500ms');
          setTimeout(findTechnician, 500);
          return;
        }

        const employee = getRandomEmployee();
        console.log('Selected employee from database:', employee);

        if (employee) {
          const searchTime = 1500 + Math.random() * 1000; // 1.5-2.5 seconds
          setTimeout(() => {
            const updatedRequest = {
              ...newRequest,
              status: 'quote_received' as ServiceRequestStatus,
              assignedEmployeeName: employee.full_name,
              priceQuote: Math.floor(Math.random() * 50) + 80,
              technicianEta: Math.floor(Math.random() * 20) + 10,
              updatedAt: new Date()
            };
            console.log('Simulation mode - found technician:', updatedRequest.assignedEmployeeName);
            setRequest(updatedRequest);
            setStep('quote_received');
          }, searchTime);
        } else {
          console.log('No employee found, falling back to generic technician');
          const searchTime = 2000 + Math.random() * 2000;
          setTimeout(() => {
            const updatedRequest = {
              ...newRequest,
              status: 'quote_received' as ServiceRequestStatus,
              assignedEmployeeName: `Technician ${Math.floor(Math.random() * 100) + 1}`,
              priceQuote: Math.floor(Math.random() * 50) + 80,
              technicianEta: Math.floor(Math.random() * 20) + 10,
              updatedAt: new Date()
            };
            console.log('Fallback - found technician:', updatedRequest.assignedEmployeeName);
            setRequest(updatedRequest);
            setStep('quote_received');
          }, searchTime);
        }
      }
    };

    // Start the technician finding process
    findTechnician();
  }, [getRandomEmployee, employees, isLoading]);

  const acceptQuote = useCallback(() => {
    if (!request) return;
    
    console.log('Accepting quote for request:', request.id);
    const updatedRequest = {
      ...request,
      status: 'live_tracking' as ServiceRequestStatus,
      updatedAt: new Date()
    };
    setRequest(updatedRequest);
    setStep('live_tracking');
  }, [request]);

  const acceptRevisedQuote = useCallback(() => {
    if (!request) return;
    
    console.log('Accepting revised quote for request:', request.id);
    const updatedRequest = {
      ...request,
      status: 'live_tracking' as ServiceRequestStatus,
      updatedAt: new Date()
    };
    setRequest(updatedRequest);
    setStep('live_tracking');
  }, [request]);

  const declineQuote = useCallback(() => {
    if (!request) return;
    
    console.log('Declining quote for request:', request.id);
    const newDeclineCount = request.declineCount + 1;
    
    if (newDeclineCount >= 2) {
      // After 2 declines, show revised quote
      const updatedRequest = {
        ...request,
        status: 'revised_quote' as ServiceRequestStatus,
        declineCount: newDeclineCount,
        revisedPriceQuote: Math.floor(request.priceQuote! * 0.85), // 15% discount
        previousEmployeeName: request.assignedEmployeeName,
        assignedEmployeeName: `Technician ${Math.floor(Math.random() * 100) + 1}`,
        updatedAt: new Date()
      };
      setRequest(updatedRequest);
      setStep('revised_quote');
    } else {
      // Search for new technician
      const updatedRequest = {
        ...request,
        status: 'searching' as ServiceRequestStatus,
        declineCount: newDeclineCount,
        previousEmployeeName: request.assignedEmployeeName,
        assignedEmployeeName: undefined,
        priceQuote: undefined,
        updatedAt: new Date()
      };
      setRequest(updatedRequest);
      setStep('searching');

      // Find new technician
      setTimeout(() => {
        const employee = getRandomEmployee([request.assignedEmployeeName || '']);
        const newQuoteRequest = {
          ...updatedRequest,
          status: 'quote_received' as ServiceRequestStatus,
          assignedEmployeeName: employee ? employee.full_name : `Technician ${Math.floor(Math.random() * 100) + 1}`,
          priceQuote: Math.floor(Math.random() * 50) + 80,
          updatedAt: new Date()
        };
        console.log('Found new technician after decline:', newQuoteRequest.assignedEmployeeName);
        setRequest(newQuoteRequest);
        setStep('quote_received');
      }, 3000);
    }
  }, [request, getRandomEmployee]);

  const finalDeclineQuote = useCallback((isRealLife: boolean = false) => {
    if (!request) return;
    
    console.log('Final decline for request:', request.id);
    
    if (isRealLife) {
      // In real life mode, show no technician available
      setStep('no_technician');
    } else {
      // In simulation, cancel the request
      const updatedRequest = {
        ...request,
        status: 'cancelled' as ServiceRequestStatus,
        updatedAt: new Date()
      };
      setRequest(updatedRequest);
      setStep('cancelled');
    }
  }, [request]);

  const cancelRequest = useCallback(() => {
    if (!request) return;
    
    console.log('Cancelling request:', request.id);
    const updatedRequest = {
      ...request,
      status: 'cancelled' as ServiceRequestStatus,
      updatedAt: new Date()
    };
    setRequest(updatedRequest);
    setStep('cancelled');
  }, [request]);

  const closeAll = useCallback(() => {
    console.log('Closing all dialogs');
    setRequest(null);
    setStep(null);
  }, []);

  const handleNoTechnicianOk = useCallback(() => {
    console.log('No technician OK clicked');
    setStep('cancelled');
  }, []);

  const completeRequest = useCallback(() => {
    if (!request) return;
    
    console.log('Completing request:', request.id);
    const updatedRequest = {
      ...request,
      status: 'completed' as ServiceRequestStatus,
      updatedAt: new Date()
    };
    setRequest(updatedRequest);
    setStep('rate_employee');
  }, [request]);

  const rateEmployee = useCallback((rating: number) => {
    if (!request) return;
    
    console.log('Rating employee with:', rating);
    const updatedRequest = {
      ...request,
      status: 'completed' as ServiceRequestStatus,
      rating,
      updatedAt: new Date()
    };
    setRequest(updatedRequest);
    // Close after rating
    setTimeout(() => {
      closeAll();
    }, 1000);
  }, [request, closeAll]);

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
