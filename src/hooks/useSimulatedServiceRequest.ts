
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
  const { getRandomEmployee, employees, isLoading } = useEmployeeSimulation();

  const createRequest = useCallback(async (
    type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
    description: string,
    userId: string
  ) => {
    console.log('🚀 createRequest called:', { type, description, userId });
    console.log('👥 Employee simulation state:', { 
      employeeCount: employees.length, 
      isLoading,
      employees: employees.map(e => ({ id: e.id, name: e.full_name }))
    });
    
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

    console.log('🔍 Setting initial state - step: searching, request created');
    setRequest(newRequest);
    setStep('searching');

    // Simulate technician search process with a maximum timeout
    const searchTimeout = setTimeout(() => {
      console.log('⏰ Search timeout reached, forcing progression');
      handleEmployeeAssignment(newRequest, type);
    }, 5000); // Maximum 5 seconds

    // Try to assign employee after a short delay
    setTimeout(() => {
      console.log('🎯 Starting employee assignment process...');
      clearTimeout(searchTimeout);
      handleEmployeeAssignment(newRequest, type);
    }, 2000); // Normal 2 second delay
    
  }, [getRandomEmployee, employees, isLoading]);

  const handleEmployeeAssignment = (newRequest: SimulatedServiceRequest, type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck") => {
    // Try to get a random employee
    const selectedEmployee = getRandomEmployee([]);
    console.log('🎯 Employee assignment result:', selectedEmployee);
    
    let employeeName = '';
    if (selectedEmployee && selectedEmployee.full_name) {
      employeeName = selectedEmployee.full_name;
      console.log('✅ Successfully assigned employee:', employeeName);
    } else {
      // Always provide a fallback employee
      const fallbackEmployees = ['John Smith', 'Maria Garcia', 'Alex Johnson', 'Sarah Wilson', 'Michael Brown'];
      employeeName = fallbackEmployees[Math.floor(Math.random() * fallbackEmployees.length)];
      console.log('✅ Using fallback employee:', employeeName);
    }
    
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
      assignedEmployeeName: employeeName,
      priceQuote: priceQuote,
      status: 'quote_received' as const
    };
    
    console.log('✅ Moving to quote_received with:', {
      employee: employeeName,
      quote: priceQuote,
      requestId: completedRequest.id
    });
    
    setRequest(completedRequest);
    setStep('quote_received');
  };

  const acceptQuote = useCallback(() => {
    if (!request) {
      console.log('❌ No request to accept quote for');
      return;
    }
    
    console.log('✅ Quote accepted for request:', request.id);
    
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
    if (!request) {
      console.log('❌ No request to decline quote for');
      return;
    }
    
    console.log('❌ Quote declined, searching for new technician');
    
    setStep('searching');
    
    // Simulate finding another technician
    setTimeout(() => {
      const alternativeEmployees = ['Alternative Technician', 'Backup Service', 'Secondary Tech', 'Emergency Response', 'Quick Fix Team'];
      const randomEmployee = alternativeEmployees[Math.floor(Math.random() * alternativeEmployees.length)];
      
      // Generate new price quote
      const priceRanges = {
        'Flat Tyre': { min: 40, max: 80 },
        'Out of Fuel': { min: 30, max: 60 },
        'Car Battery': { min: 60, max: 120 },
        'Other Car Problems': { min: 50, max: 150 },
        'Tow Truck': { min: 80, max: 200 }
      };
      
      const range = priceRanges[request.type];
      const newPriceQuote = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      
      const updatedRequest = {
        ...request,
        assignedEmployeeName: randomEmployee,
        priceQuote: newPriceQuote,
        status: 'quote_received' as const
      };
      
      console.log('✅ New technician assigned:', randomEmployee, 'with quote:', newPriceQuote);
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
    if (!request) {
      console.log('❌ No request to complete');
      return;
    }
    
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

  console.log('useSimulatedServiceRequest state:', {
    step,
    requestId: request?.id,
    requestType: request?.type,
    assignedEmployee: request?.assignedEmployeeName,
    priceQuote: request?.priceQuote
  });

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
