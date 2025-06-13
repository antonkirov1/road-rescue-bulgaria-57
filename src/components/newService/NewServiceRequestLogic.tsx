
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';
import { employeeIntegrationService, EmployeeResponse } from '@/services/newEmployeeIntegration';

interface UseServiceRequestLogicProps {
  type: ServiceRequest['type'];
  open: boolean;
  userLocation: { lat: number; lng: number };
  userId: string;
  onClose: () => void;
}

export const useServiceRequestLogic = ({
  type,
  open,
  userLocation,
  userId,
  onClose
}: UseServiceRequestLogicProps) => {
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);
  const [assignedEmployee, setAssignedEmployee] = useState<EmployeeResponse | null>(null);
  const [blacklistedEmployees, setBlacklistedEmployees] = useState<string[]>([]);

  // Initialize when dialog opens
  useEffect(() => {
    if (open && !currentRequest) {
      console.log('Initializing new service request for:', type);
      handleSubmitRequest();
    }
  }, [open, type]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentScreen(null);
      setCurrentRequest(null);
      setAssignedEmployee(null);
      setBlacklistedEmployees([]);
    }
  }, [open]);

  const handleSubmitRequest = async () => {
    try {
      console.log('Starting service request for:', type);
      
      // Create a service request
      const newRequest: ServiceRequest = {
        id: `req_${Date.now()}`,
        type: type,
        status: 'pending',
        userLocation: userLocation,
        userId: userId,
        description: `I need ${type} assistance`,
        declineCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentRequest(newRequest);
      setCurrentScreen('show_searching_technician');
      
      // Find available employee using the new integration service
      setTimeout(async () => {
        await findEmployee(newRequest);
      }, 2000 + Math.random() * 2000); // 2-4 seconds search time
      
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive"
      });
      onClose();
    }
  };

  const findEmployee = async (request: ServiceRequest) => {
    try {
      const employee = await employeeIntegrationService.findAvailableEmployee(request, blacklistedEmployees);
      
      if (!employee) {
        setCurrentScreen('show_no_technicians_available');
        setTimeout(() => {
          onClose();
        }, 3000);
        return;
      }

      setAssignedEmployee(employee);
      console.log('Found employee:', employee.name);
      
      // Notify employee and wait for acceptance
      const notified = await employeeIntegrationService.notifyEmployeeOfRequest(employee, request);
      
      if (notified) {
        // Generate quote
        setTimeout(() => {
          generateQuote(request, employee, false);
        }, 1000 + Math.random() * 2000);
      } else {
        // Employee couldn't be notified, find another
        setBlacklistedEmployees(prev => [...prev, employee.name]);
        setTimeout(() => {
          findEmployee(request);
        }, 1000);
      }
    } catch (error) {
      console.error('Error finding employee:', error);
      setCurrentScreen('show_no_technicians_available');
    }
  };

  const generateQuote = (request: ServiceRequest, employee: EmployeeResponse, isRevised: boolean = false) => {
    const quote = employeeIntegrationService.generateQuote(request.type, isRevised);
    
    const updatedRequest = {
      ...request,
      status: isRevised ? 'quote_revised' as const : 'quote_sent' as const,
      priceQuote: quote.amount,
      assignedEmployeeId: employee.id,
      assignedEmployeeName: employee.name
    };

    if (isRevised) {
      updatedRequest.revisedPriceQuote = quote.amount;
    }
    
    setCurrentRequest(updatedRequest);
    setCurrentScreen(isRevised ? 'show_revised_price_quote' : 'show_price_quote_received');
    
    toast({
      title: isRevised ? "Revised Quote Received" : "Price Quote Received",
      description: `${employee.name} sent you a ${isRevised ? 'revised ' : ''}quote of ${quote.amount} BGN.`
    });
  };

  const handleAcceptQuote = async () => {
    if (!currentRequest || !assignedEmployee) return;
    
    try {
      const updatedRequest = {
        ...currentRequest,
        status: 'accepted' as const
      };
      setCurrentRequest(updatedRequest);
      setCurrentScreen('show_request_accepted');
      
      // Notify employee of acceptance
      if (assignedEmployee) {
        await employeeIntegrationService.employeeAcceptedRequest(assignedEmployee.id, currentRequest.id);
      }
      
      toast({
        title: "Quote Accepted",
        description: `${assignedEmployee.name} is on the way to your location.`
      });
      
      // Simulate service progression
      setTimeout(() => {
        setCurrentScreen('show_live_tracking');
      }, 2000);
      
      setTimeout(() => {
        const completedRequest = {
          ...updatedRequest,
          status: 'completed' as const
        };
        setCurrentRequest(completedRequest);
        setCurrentScreen('show_service_completed');
      }, 8000);
      
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast({
        title: "Error",
        description: "Failed to accept quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineQuote = async () => {
    if (!currentRequest || !assignedEmployee) return;
    
    try {
      const declineCount = currentRequest.declineCount + 1;
      
      if (declineCount === 1) {
        // First decline - show revised quote with lower price
        console.log('First decline - generating revised quote with lower price');
        
        const updatedRequest = {
          ...currentRequest,
          declineCount,
          status: 'quote_declined' as const
        };
        setCurrentRequest(updatedRequest);
        
        toast({
          title: "Quote Declined",
          description: `${assignedEmployee.name} will send you a revised quote with a lower price.`
        });
        
        // Generate revised quote after a short delay
        setTimeout(() => {
          generateQuote(updatedRequest, assignedEmployee, true);
        }, 1500);
        
      } else {
        // Second decline - find new employee
        console.log('Second decline - blacklisting employee and finding new one');
        setBlacklistedEmployees(prev => [...prev, assignedEmployee.name]);
        
        // Notify current employee of decline
        await employeeIntegrationService.employeeDeclinedRequest(
          assignedEmployee.id, 
          currentRequest.id, 
          'Customer declined revised quote'
        );
        
        setAssignedEmployee(null);
        setCurrentScreen('show_searching_technician');
        
        toast({
          title: "Quote Declined", 
          description: "Looking for another available employee..."
        });
        
        setTimeout(() => {
          const updatedRequest = {
            ...currentRequest,
            declineCount: 0,
            revisedPriceQuote: undefined,
            status: 'pending' as const
          };
          setCurrentRequest(updatedRequest);
          findEmployee(updatedRequest);
        }, 2000);
      }
    } catch (error) {
      console.error('Error declining quote:', error);
      toast({
        title: "Error",
        description: "Failed to decline quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelRequest = async () => {
    if (!currentRequest) return;
    
    try {
      // Notify assigned employee if any
      if (assignedEmployee) {
        await employeeIntegrationService.employeeDeclinedRequest(
          assignedEmployee.id,
          currentRequest.id,
          'Customer cancelled request'
        );
      }
      
      setCurrentScreen(null);
      setCurrentRequest(null);
      setAssignedEmployee(null);
      setBlacklistedEmployees([]);
      onClose();
      
      toast({
        title: "Request Cancelled",
        description: "Your service request has been cancelled."
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setCurrentScreen(null);
    setCurrentRequest(null);
    setAssignedEmployee(null);
    setBlacklistedEmployees([]);
    onClose();
  };

  return {
    currentScreen,
    currentRequest,
    assignedEmployee,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose
  };
};
