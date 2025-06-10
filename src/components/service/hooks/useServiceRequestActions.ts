
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';
import { ServiceType } from '@/components/service/types/serviceRequestState';

export const useServiceRequestActions = (
  type: ServiceType,
  userLocation: { lat: number; lng: number },
  onClose: () => void
) => {
  const { currentRequest, createRequest, acceptQuote, declineQuote, cancelRequest } = useServiceRequestManager();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  
  const handleSubmit = async (message: string) => {
    if (currentRequest) {
      toast({
        title: "Request in Progress",
        description: "Please wait for your current request to be completed before making a new one.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createRequest(type, userLocation, message);
      
      toast({
        title: "Request Sent",
        description: "Your request has been sent to our team."
      });
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDialogClose = () => {
    // Never allow closing if price quote is active - this is critical
    if (currentRequest?.status === 'quote_received' && currentRequest?.currentQuote) {
      console.log('useServiceRequestActions - BLOCKING close while price quote is showing');
      return;
    }
    
    if (currentRequest && currentRequest.status !== 'completed' && currentRequest.status !== 'cancelled') {
      setShowCancelConfirmDialog(true);
    } else {
      onClose();
    }
  };
  
  const confirmCancelRequest = async () => {
    await cancelRequest();
    setShowCancelConfirmDialog(false);
    onClose();
  };
  
  const handleAcceptQuote = async () => {
    console.log('useServiceRequestActions - Accepting quote...');
    await acceptQuote();
  };
  
  const handleDeclineQuote = async () => {
    console.log('useServiceRequestActions - Declining quote...');
    await declineQuote();
  };
  
  const handleContactSupport = () => {
    toast({
      title: "Contacting Support",
      description: "Our support team will contact you shortly."
    });
  };
  
  return {
    isSubmitting,
    showCancelConfirmDialog,
    setShowCancelConfirmDialog,
    handleSubmit,
    handleDialogClose,
    confirmCancelRequest,
    handleAcceptQuote,
    handleDeclineQuote,
    handleContactSupport
  };
};
