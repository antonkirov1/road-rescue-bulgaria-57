
import { useState, useCallback } from 'react';
import { ServiceRequest, ServiceRequestStatus } from '@/types/newServiceRequest';
import { supabase } from '@/integrations/supabase/client';

export const useServiceRequestFlow = () => {
  const [step, setStep] = useState<ServiceRequestStatus | null>(null);
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  const createRequest = useCallback(async (
    type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
    description: string,
    userId: string,
    isRealLife: boolean = false
  ) => {
    console.log('Creating request with isRealLife:', isRealLife);
    
    const newRequest: ServiceRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'searching',
      userLocation: { lat: 42.6977, lng: 23.3219 }, // Sofia coordinates for simulation
      userId,
      declineCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      description
    };

    setRequest(newRequest);
    setStep('searching');

    // Start the technician search process
    setTimeout(async () => {
      try {
        console.log('Starting technician search for simulation');
        
        // For simulation, always find a technician quickly
        const simulatedEmployees = [
          'Ivan Petrov',
          'Maria Georgieva',
          'Dimitar Vasilev',
          'Elena Stoeva',
          'Georgi Dimitrov'
        ];
        
        const selectedEmployee = simulatedEmployees[Math.floor(Math.random() * simulatedEmployees.length)];
        
        // Generate realistic price quote based on service type
        const basePrices = {
          'Flat Tyre': 80,
          'Car Battery': 120,
          'Out of Fuel': 60,
          'Other Car Problems': 90,
          'Tow Truck': 150
        };
        
        const basePrice = basePrices[type] || 90;
        const priceQuote = basePrice + Math.floor(Math.random() * 40) - 20; // ±20 variation
        
        console.log('Found technician:', selectedEmployee, 'Price quote:', priceQuote);
        
        setRequest(prev => prev ? {
          ...prev,
          assignedEmployeeName: selectedEmployee,
          priceQuote,
          status: 'quote_received'
        } : null);
        setStep('quote_received');
        
      } catch (error) {
        console.error('Error in simulation flow:', error);
        // Fallback to no technician found
        setStep('no_technician');
      }
    }, 2000 + Math.random() * 2000); // 2-4 seconds delay for realism
  }, []);

  const acceptQuote = useCallback(async () => {
    console.log('Accepting quote');
    setRequest(prev => prev ? {
      ...prev,
      status: 'live_tracking'
    } : null);
    setStep('live_tracking');
  }, []);

  const acceptRevisedQuote = useCallback(async () => {
    console.log('Accepting revised quote');
    setRequest(prev => prev ? {
      ...prev,
      status: 'live_tracking'
    } : null);
    setStep('live_tracking');
  }, []);

  const declineQuote = useCallback(async () => {
    console.log('Declining quote');
    if (!request) return;

    const newDeclineCount = (request.declineCount || 0) + 1;
    
    if (newDeclineCount >= 2) {
      // Show revised quote after first decline
      const revisedPrice = Math.max(50, (request.priceQuote || 100) - 20);
      setRequest(prev => prev ? {
        ...prev,
        priceQuote: revisedPrice,
        declineCount: newDeclineCount,
        status: 'revised_quote'
      } : null);
      setStep('revised_quote');
    } else {
      // Search for new technician
      setRequest(prev => prev ? {
        ...prev,
        declineCount: newDeclineCount,
        status: 'searching'
      } : null);
      setStep('searching');
      
      // Simulate finding another technician
      setTimeout(() => {
        const otherEmployees = ['Petko Mladenov', 'Ana Nikolova', 'Stefan Georgiev'];
        const newEmployee = otherEmployees[Math.floor(Math.random() * otherEmployees.length)];
        const newPrice = 80 + Math.floor(Math.random() * 60);
        
        setRequest(prev => prev ? {
          ...prev,
          assignedEmployeeName: newEmployee,
          priceQuote: newPrice,
          status: 'quote_received'
        } : null);
        setStep('quote_received');
      }, 3000);
    }
  }, [request]);

  const finalDeclineQuote = useCallback(async (isRealLife: boolean) => {
    console.log('Final decline - cancelling request');
    setRequest(prev => prev ? {
      ...prev,
      status: 'cancelled'
    } : null);
    setStep('cancelled');
  }, []);

  const cancelRequest = useCallback(async () => {
    console.log('Cancelling request');
    setRequest(prev => prev ? {
      ...prev,
      status: 'cancelled'
    } : null);
    setStep('cancelled');
  }, []);

  const completeRequest = useCallback(async () => {
    console.log('Completing request');
    setRequest(prev => prev ? {
      ...prev,
      status: 'completed'
    } : null);
    setStep('completed');
    
    // Move to rating after a short delay
    setTimeout(() => {
      setStep('rate_employee');
    }, 2000);
  }, []);

  const rateEmployee = useCallback(async (rating: number) => {
    console.log('Rating employee:', rating);
    setRequest(prev => prev ? {
      ...prev,
      rating,
      status: 'completed'
    } : null);
    closeAll();
  }, []);

  const handleNoTechnicianOk = useCallback(async () => {
    console.log('No technician available');
    closeAll();
  }, []);

  const closeAll = useCallback(() => {
    console.log('Closing all - resetting state');
    setRequest(null);
    setStep(null);
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
    rateEmployee
  };
};
