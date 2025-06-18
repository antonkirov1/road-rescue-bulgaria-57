
import { useState, useCallback } from 'react';
import { useEmployeeSimulation } from '@/hooks/useEmployeeSimulation';

export type SimulatedRequestStep = 
  | 'searching' 
  | 'quote_received' 
  | 'revised_quote'
  | 'live_tracking' 
  | 'completed' 
  | 'cancelled'
  | 'no_technician'
  | 'rate_employee';

export interface SimulatedServiceRequest {
  id: string;
  type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck";
  description: string;
  userId: string;
  timestamp: string;
  assignedEmployeeName: string;
  priceQuote: number | null;
  status: 'pending' | 'quote_received' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  userLocation: { lat: number; lng: number };
  employeeLocation?: { lat: number; lng: number };
  etaSeconds?: number;
}

export const useSimulatedServiceRequest = () => {
  const [step, setStep] = useState<SimulatedRequestStep | null>(null);
  const [request, setRequest] = useState<SimulatedServiceRequest | null>(null);
  const { getRandomEmployee, loadEmployees, employees } = useEmployeeSimulation();

  const createRequest = useCallback(async (
    type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
    description: string,
    userId: string
  ) => {
    console.log('🚀 createRequest called:', { type, description, userId });
    
    const newRequest: SimulatedServiceRequest = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      userId,
      timestamp: new Date().toISOString(),
      assignedEmployeeName: '',
      priceQuote: null,
      status: 'pending',
      userLocation: { lat: 42.6977, lng: 23.3219 } // Sofia coordinates
    };

    console.log('🔍 Setting step to searching...');
    setRequest(newRequest);
    setStep('searching');

    // Always use a timeout to simulate the search process
    setTimeout(async () => {
      try {
        console.log('⏰ Search timeout triggered, starting employee search...');
        
        // Try to load employees if they haven't been loaded
        if (employees.length === 0) {
          console.log('📋 No employees loaded, attempting to load...');
          await loadEmployees();
        }
        
        console.log('👥 Available employees:', employees.length);
        
        // Get a random employee
        const employee = getRandomEmployee([]);
        console.log('🎯 Selected employee:', employee);
        
        if (employee && employee.full_name) {
          console.log('✅ Assigning employee:', employee.full_name);
          const updatedRequest = {
            ...newRequest,
            assignedEmployeeName: employee.full_name,
            priceQuote: Math.floor(Math.random() * 100) + 50,
            status: 'quote_received' as const
          };
          setRequest(updatedRequest);
          setStep('quote_received');
          console.log('🎉 Successfully moved to quote_received step');
        } else {
          console.log('⚠️ No suitable employee found, using fallback');
          // Use fallback employee names
          const fallbackEmployees = ['John Smith', 'Maria Garcia', 'Alex Johnson', 'Sarah Wilson', 'Michael Brown'];
          const randomEmployee = fallbackEmployees[Math.floor(Math.random() * fallbackEmployees.length)];
          
          const updatedRequest = {
            ...newRequest,
            assignedEmployeeName: randomEmployee,
            priceQuote: Math.floor(Math.random() * 100) + 50,
            status: 'quote_received' as const
          };
          setRequest(updatedRequest);
          setStep('quote_received');
          console.log('🎉 Successfully moved to quote_received step with fallback employee:', randomEmployee);
        }
      } catch (error) {
        console.error('❌ Error during employee assignment:', error);
        // Ultimate fallback
        const updatedRequest = {
          ...newRequest,
          assignedEmployeeName: 'John Smith',
          priceQuote: 75,
          status: 'quote_received' as const
        };
        setRequest(updatedRequest);
        setStep('quote_received');
        console.log('🎉 Successfully moved to quote_received step with ultimate fallback');
      }
    }, 3000); // Fixed 3 second delay for testing
  }, [getRandomEmployee, loadEmployees, employees]);

  const acceptQuote = useCallback(() => {
    if (!request) return;
    console.log('✅ Quote accepted');
    
    const updatedRequest = {
      ...request,
      status: 'accepted' as const,
      employeeLocation: { lat: 42.6977 + (Math.random() - 0.5) * 0.01, lng: 23.3219 + (Math.random() - 0.5) * 0.01 },
      etaSeconds: 300 + Math.floor(Math.random() * 600) // 5-15 minutes
    };
    setRequest(updatedRequest);
    setStep('live_tracking');
  }, [request]);

  const declineQuote = useCallback(() => {
    if (!request) return;
    console.log('❌ Quote declined, searching for new technician');
    
    setStep('searching');
    
    // Simulate finding another technician
    setTimeout(() => {
      const updatedRequest = {
        ...request,
        assignedEmployeeName: 'Alternative Technician',
        priceQuote: Math.floor(Math.random() * 80) + 60,
        status: 'quote_received' as const
      };
      setRequest(updatedRequest);
      setStep('revised_quote');
    }, 2000);
  }, [request]);

  const cancelRequest = useCallback(() => {
    console.log('🚫 Request cancelled');
    setStep('cancelled');
  }, []);

  const closeAll = useCallback(() => {
    console.log('🔄 Closing all, resetting state');
    setStep(null);
    setRequest(null);
  }, []);

  const handleNoTechnicianOk = useCallback(() => {
    console.log('👍 No technician OK handled');
    closeAll();
  }, [closeAll]);

  const completeRequest = useCallback(() => {
    if (!request) return;
    console.log('🏁 Request completed');
    
    const updatedRequest = {
      ...request,
      status: 'completed' as const
    };
    setRequest(updatedRequest);
    setStep('rate_employee');
  }, [request]);

  const rateEmployee = useCallback((rating: number) => {
    console.log('⭐ Employee rated:', rating);
    setStep('completed');
  }, []);

  return {
    step,
    request,
    createRequest,
    acceptQuote,
    declineQuote,
    cancelRequest,
    closeAll,
    handleNoTechnicianOk,
    completeRequest,
    rateEmployee
  };
};
