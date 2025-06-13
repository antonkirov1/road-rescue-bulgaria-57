
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';
import { useServiceRequestState } from '@/hooks/useServiceRequestState';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';
import { useQuoteHandling } from '@/hooks/useQuoteHandling';
import { createServiceRequest, handleAcceptQuote, handleCancelRequest } from '@/services/serviceRequestActions';

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
  const {
    currentScreen,
    currentRequest,
    assignedEmployee,
    blacklistedEmployees,
    employeeDeclineCount,
    hasReceivedRevision,
    setCurrentScreen,
    setCurrentRequest,
    setAssignedEmployee,
    setBlacklistedEmployees,
    setEmployeeDeclineCount,
    setHasReceivedRevision,
    resetState,
    resetEmployeeTracking
  } = useServiceRequestState();

  const { generateQuote, handleDeclineQuote } = useQuoteHandling({
    setCurrentRequest,
    setCurrentScreen,
    setAssignedEmployee,
    employeeDeclineCount,
    setEmployeeDeclineCount,
    hasReceivedRevision,
    setHasReceivedRevision,
    blacklistCurrentEmployee: (employeeName: string) => {
      setBlacklistedEmployees(prev => [...prev, employeeName]);
    },
    resetEmployeeTracking,
    findEmployee: async () => {} // Will be set below
  });

  const { findEmployee, blacklistCurrentEmployee } = useEmployeeManagement({
    setCurrentScreen,
    setAssignedEmployee,
    resetEmployeeTracking,
    blacklistedEmployees,
    setBlacklistedEmployees,
    onClose,
    generateQuote
  });

  // Update the generateQuote dependency
  const quoteHandling = useQuoteHandling({
    setCurrentRequest,
    setCurrentScreen,
    setAssignedEmployee,
    employeeDeclineCount,
    setEmployeeDeclineCount,
    hasReceivedRevision,
    setHasReceivedRevision,
    blacklistCurrentEmployee,
    resetEmployeeTracking,
    findEmployee
  });

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
      resetState();
    }
  }, [open]);

  const handleSubmitRequest = async () => {
    try {
      console.log('Starting service request for:', type);
      
      const newRequest = createServiceRequest(type, userLocation, userId);
      setCurrentRequest(newRequest);
      setCurrentScreen('show_searching_technician');
      
      // Find available employee
      setTimeout(async () => {
        await findEmployee(newRequest);
      }, 2000 + Math.random() * 2000);
      
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

  const handleAcceptQuoteWrapper = async () => {
    if (!currentRequest || !assignedEmployee) return;
    await handleAcceptQuote(currentRequest, assignedEmployee, setCurrentRequest, setCurrentScreen);
  };

  const handleDeclineQuoteWrapper = async () => {
    if (!currentRequest || !assignedEmployee) return;
    await quoteHandling.handleDeclineQuote(currentRequest, assignedEmployee);
  };

  const handleCancelRequestWrapper = async () => {
    if (!currentRequest) return;
    await handleCancelRequest(currentRequest, assignedEmployee, resetState, onClose);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return {
    currentScreen,
    currentRequest,
    assignedEmployee,
    handleAcceptQuote: handleAcceptQuoteWrapper,
    handleDeclineQuote: handleDeclineQuoteWrapper,
    handleCancelRequest: handleCancelRequestWrapper,
    handleClose
  };
};
