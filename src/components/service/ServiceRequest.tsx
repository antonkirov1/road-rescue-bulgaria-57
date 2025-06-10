
import React, { useState, useEffect } from 'react';
import ServiceRequestDialogManager from './ServiceRequestDialogManager';
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';
import { useServiceValidation } from './hooks/useServiceValidation';
import { useServiceRequestDialogs } from './hooks/useServiceRequestDialogs';
import { useServiceRequestActions } from './hooks/useServiceRequestActions';
import { serviceMessages } from './constants/serviceMessages';

interface ServiceRequestProps {
  type: 'flat-tyre' | 'out-of-fuel' | 'other-car-problems' | 'tow-truck' | 'emergency' | 'support' | 'car-battery';
  open: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number };
  shouldShowPriceQuote?: boolean;
}

const ServiceRequest: React.FC<ServiceRequestProps> = ({ 
  type, 
  open, 
  onClose, 
  userLocation, 
  shouldShowPriceQuote = false 
}) => {
  const { validateMessage } = useServiceValidation();
  const { currentRequest } = useServiceRequestManager();
  
  const [message, setMessage] = useState(() => serviceMessages[type] || '');
  
  // Use custom hooks for dialog management and actions
  const dialogs = useServiceRequestDialogs(open, currentRequest);
  const actions = useServiceRequestActions(type, userLocation, onClose);
  
  // Debug logging for all dialog states
  useEffect(() => {
    console.log('ServiceRequest - Complete dialog state:', {
      open,
      currentRequest: currentRequest ? {
        id: currentRequest.id,
        status: currentRequest.status,
        hasQuote: !!currentRequest.currentQuote,
        quoteAmount: currentRequest.currentQuote?.amount,
        employeeName: currentRequest.assignedEmployee?.name
      } : null,
      dialogs: {
        showPriceQuoteDialog: dialogs.showPriceQuoteDialog,
        showStatusDialog: dialogs.showStatusDialog,
        showFormDialog: dialogs.showFormDialog
      },
      dialogKey: dialogs.dialogKey
    });
  }, [open, currentRequest, dialogs]);
  
  // Close dialog when service is completed
  useEffect(() => {
    if (currentRequest?.status === 'completed') {
      console.log('ServiceRequest - Service completed, closing dialog');
      onClose();
    }
  }, [currentRequest?.status, onClose]);
  
  // Validate message before submitting
  const handleValidatedSubmit = () => {
    if (!validateMessage(message, type)) {
      return;
    }
    actions.handleSubmit(message);
  };
  
  return (
    <ServiceRequestDialogManager
      type={type}
      userLocation={userLocation}
      message={message}
      onMessageChange={setMessage}
      currentRequest={currentRequest}
      dialogs={dialogs}
      actions={{
        ...actions,
        handleSubmit: handleValidatedSubmit
      }}
    />
  );
};

export default ServiceRequest;
