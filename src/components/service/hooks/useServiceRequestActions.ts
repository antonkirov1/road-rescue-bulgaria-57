
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
    console.log('useServiceRequestActions - handleDialogClose called', {
      currentRequestStatus: currentRequest?.status,
      hasQuote: !!currentRequest?.currentQuote
    });
    
    // Only block closing if there's an active price quote that user must respond to
    if (currentRequest?.status === 'quote_received' && currentRequest?.currentQuote) {
      console.log('useServiceRequestActions - BLOCKING close while price quote is active');
      toast({
        title: "Response Required",
        description: "Please accept or decline the price quote before closing.",
        variant: "destructive"
      });
      return;
    }
    
    // If there's an ongoing request (but no active quote), show cancel confirmation
    if (currentRequest && 
        currentRequest.status !== 'completed' && 
        currentRequest.status !== 'cancelled') {
      console.log('useServiceRequestActions - Showing cancel confirmation');
      setShowCancelConfirmDialog(true);
    } else {
      console.log('useServiceRequestActions - Closing normally');
      onClose();
    }
  };
  
  const confirmCancelRequest = async () => {
    console.log('useServiceRequestActions - Confirming cancel request');
    try {
      await cancelRequest();
      setShowCancelConfirmDialog(false);
      onClose();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAcceptQuote = async () => {
    console.log('useServiceRequestActions - Accepting quote...');
    try {
      await acceptQuote();
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
    console.log('useServiceRequestActions - Declining quote...');
    try {
      await declineQuote();
    } catch (error) {
      console.error('Error declining quote:', error);
      toast({
        title: "Error",
        description: "Failed to decline quote. Please try again.",
        variant: "destructive"
      });
    }
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
