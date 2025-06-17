import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest, ServiceRequestStatus } from '@/types/newServiceRequest';

export const useServiceRequestFlow = () => {
  const [step, setStep] = useState<ServiceRequestStatus | null>(null);
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  const createRequest = useCallback(async (
    type: string,
    message: string,
    userId: string,
    isRealLife: boolean = false
  ) => {
    console.log('Creating request with isRealLife:', isRealLife);
    
    const newRequest: ServiceRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      userId,
      status: 'searching',
      createdAt: new Date().toISOString(),
      priceQuote: null,
      assignedEmployeeName: '',
      isRealLife
    };

    setRequest(newRequest);
    setStep('searching');

    if (isRealLife) {
      // Real-life flow - use actual database queries
      setTimeout(async () => {
        try {
          const { data: employees } = await supabase
            .from('employee_accounts')
            .select('id, real_name, username')
            .eq('status', 'active')
            .eq('is_available', true);

          if (!employees || employees.length === 0) {
            setStep('no_technician');
            return;
          }

          const selectedEmployee = employees[Math.floor(Math.random() * employees.length)];
          const priceQuote = Math.floor(Math.random() * 100) + 50;

          setRequest(prev => prev ? {
            ...prev,
            assignedEmployeeName: selectedEmployee.real_name || selectedEmployee.username,
            priceQuote,
            status: 'quote_received'
          } : null);
          setStep('quote_received');
        } catch (error) {
          console.error('Error in real-life employee search:', error);
          setStep('no_technician');
        }
      }, 2000);
    } else {
      // Simulation flow - use predictable simulation logic
      console.log('Starting simulation flow');
      setTimeout(async () => {
        try {
          // Try to get simulated employees first
          const { data: simulatedEmployees } = await supabase
            .from('employee_simulation')
            .select('id, full_name, employee_number')
            .order('employee_number', { ascending: true });

          console.log('Simulated employees fetched:', simulatedEmployees);

          let selectedEmployee;
          if (simulatedEmployees && simulatedEmployees.length > 0) {
            selectedEmployee = simulatedEmployees[Math.floor(Math.random() * simulatedEmployees.length)];
            console.log('Selected simulated employee:', selectedEmployee);
          } else {
            // Fallback to a default simulated technician
            console.log('No simulated employees found, using fallback');
            selectedEmployee = {
              id: 'sim_default',
              full_name: 'Simulation Technician',
              employee_number: 1
            };
          }

          // Generate a price quote for simulation
          const basePrice = type === 'Flat Tyre' ? 80 : 
                           type === 'Car Battery' ? 120 :
                           type === 'Out of Fuel' ? 60 :
                           type === 'Tow Truck' ? 150 : 100;
          
          const priceQuote = basePrice + Math.floor(Math.random() * 50);

          console.log('Setting simulation request with employee:', selectedEmployee.full_name);
          
          setRequest(prev => prev ? {
            ...prev,
            assignedEmployeeName: selectedEmployee.full_name,
            priceQuote,
            status: 'quote_received'
          } : null);
          setStep('quote_received');
        } catch (error) {
          console.error('Error in simulation employee search:', error);
          // Even if database fails, provide a fallback for simulation
          const fallbackEmployee = 'Simulation Technician';
          const fallbackPrice = 100;
          
          console.log('Using fallback simulation data');
          setRequest(prev => prev ? {
            ...prev,
            assignedEmployeeName: fallbackEmployee,
            priceQuote: fallbackPrice,
            status: 'quote_received'
          } : null);
          setStep('quote_received');
        }
      }, 1500); // Shorter timeout for simulation
    }
  }, []);

  const acceptQuote = useCallback(() => {
    setStep('live_tracking');
    setRequest(prev => prev ? { ...prev, status: 'accepted' } : null);
    
    // Simulate service completion
    setTimeout(() => {
      setStep('completed');
      setRequest(prev => prev ? { ...prev, status: 'completed' } : null);
    }, 3000);
  }, []);

  const acceptRevisedQuote = useCallback(() => {
    setStep('live_tracking');
    setRequest(prev => prev ? { ...prev, status: 'accepted' } : null);
    
    // Simulate service completion
    setTimeout(() => {
      setStep('completed');
      setRequest(prev => prev ? { ...prev, status: 'completed' } : null);
    }, 3000);
  }, []);

  const declineQuote = useCallback(() => {
    // Simulate finding another technician with revised price
    setStep('searching');
    
    setTimeout(() => {
      const revisedPrice = request?.priceQuote ? request.priceQuote - 20 : 80;
      setRequest(prev => prev ? {
        ...prev,
        priceQuote: revisedPrice,
        status: 'revised_quote'
      } : null);
      setStep('revised_quote');
    }, 2000);
  }, [request]);

  const finalDeclineQuote = useCallback((isRealLife: boolean) => {
    if (isRealLife) {
      setStep('no_technician');
    } else {
      // In simulation, just cancel the request
      setStep('cancelled');
      setRequest(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
  }, []);

  const cancelRequest = useCallback(() => {
    setStep('cancelled');
    setRequest(prev => prev ? { ...prev, status: 'cancelled' } : null);
  }, []);

  const closeAll = useCallback(() => {
    setStep(null);
    setRequest(null);
  }, []);

  const handleNoTechnicianOk = useCallback(() => {
    setStep(null);
    setRequest(null);
  }, []);

  const completeRequest = useCallback(() => {
    setStep('rate_employee');
  }, []);

  const rateEmployee = useCallback((rating: number) => {
    console.log('Employee rated:', rating);
    closeAll();
  }, [closeAll]);

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
