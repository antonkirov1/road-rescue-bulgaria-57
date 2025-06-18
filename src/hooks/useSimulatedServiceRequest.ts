
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
  const { getRandomEmployee, employees } = useEmployeeSimulation();

  const createRequest = useCallback(async (
    type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
    description: string,
    userId: string
  ) => {
    console.log('🚀 createRequest called:', { type, description, userId });
    console.log('👥 Available employees at request time:', employees.length);
    
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

    // Simulate technician search process
    setTimeout(() => {
      console.log('🎯 Starting employee assignment process...');
      
      // Try to get a random employee
      const selectedEmployee = getRandomEmployee([]);
      console.log('🎯 Selected employee result:', selectedEmployee);
      
      if (selectedEmployee && selectedEmployee.full_name) {
        console.log('✅ Successfully assigned employee:', selectedEmployee.full_name);
        
        // Generate price quote based on service type
        const priceRanges = {
          'Flat Tyre': { min: 40, max: 80 },
          'Out of Fuel': { min: 30, max: 60 },
          'Car Battery': { min: 60, max: 120 },
          'Other Car Problems': { min: 50, max: 150 },
          'Tow Truck': { min: 80, max: 200 }
        };
        
        const range = priceRanges[type];
        const priceQuote = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        
        const completedRequest = {
          ...newRequest,
          assignedEmployeeName: selectedEmployee.full_name,
          priceQuote: priceQuote,
          status: 'quote_received' as const
        };
        
        console.log('✅ Moving to quote_received with:', {
          employee: selectedEmployee.full_name,
          quote: priceQuote
        });
        
        setRequest(completedRequest);
        setStep('quote_received');
      } else {
        console.log('❌ No employee available, but this should not happen after DB migration');
        // Fallback to guaranteed employee name
        const fallbackEmployee = 'Emergency Technician';
        const priceQuote = Math.floor(Math.random() * 100) + 50;
        
        const completedRequest = {
          ...newRequest,
          assignedEmployeeName: fallbackEmployee,
          priceQuote: priceQuote,
          status: 'quote_received' as const
        };
        
        console.log('✅ Using fallback employee:', fallbackEmployee);
        setRequest(completedRequest);
        setStep('quote_received');
      }
    }, 2000); // 2 second simulation delay
    
  }, [getRandomEmployee, employees]);

  const acceptQuote = useCallback(() => {
    if (!request) return;
    console.log('✅ Quote accepted');
    
    const updatedRequest = {
      ...request,
      status: 'accepted' as const,
      employeeLocation: { 
        lat: 42.6977 + (Math.random() - 0.5) * 0.01, 
        lng: 23.3219 + (Math.random() - 0.5) * 0.01 
      },
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
      const alternativeEmployees = ['Alternative Technician', 'Backup Service', 'Secondary Tech'];
      const randomEmployee = alternativeEmployees[Math.floor(Math.random() * alternativeEmployees.length)];
      
      const updatedRequest = {
        ...request,
        assignedEmployeeName: randomEmployee,
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
