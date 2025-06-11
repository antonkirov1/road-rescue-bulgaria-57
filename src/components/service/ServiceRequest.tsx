
import React, { useState, useEffect } from 'react';
import ServiceRequestDialog from './ServiceRequestDialog';
import ServiceRequestForm from './ServiceRequestForm';
import ServiceRequestStatus from './ServiceRequestStatus';
import PriceQuoteDialog from './PriceQuoteDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';
import { useServiceValidation } from './hooks/useServiceValidation';
import { serviceMessages } from './constants/serviceMessages';
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from '@/utils/translations';
import { useApp } from '@/contexts/AppContext';

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
  const { language } = useApp();
  const t = useTranslation(language);
  const { validateMessage } = useServiceValidation();
  const { currentRequest, createRequest, acceptQuote, declineQuote, cancelRequest } = useServiceRequestManager();
  
  const [message, setMessage] = useState(() => serviceMessages[type] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  
  // Determine what should be shown based on current state and props
  const shouldShowForm = open && !currentRequest;
  const shouldShowStatus = open && currentRequest && 
    (currentRequest.status === 'request_accepted' || 
     currentRequest.status === 'in_progress' || 
     currentRequest.status === 'quote_accepted');
  const shouldShowQuoteDialog = (open && currentRequest && 
    currentRequest.status === 'quote_received' && 
    !!currentRequest.currentQuote) || shouldShowPriceQuote;
  
  console.log('ServiceRequest - Current state:', {
    open,
    shouldShowPriceQuote,
    currentRequest: currentRequest ? {
      id: currentRequest.id,
      status: currentRequest.status,
      hasQuote: !!currentRequest.currentQuote
    } : null,
    shouldShowForm,
    shouldShowStatus,
    shouldShowQuoteDialog
  });
  
  // Auto-close when service is completed
  useEffect(() => {
    if (currentRequest?.status === 'completed') {
      console.log('ServiceRequest - Service completed, auto-closing');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [currentRequest?.status, onClose]);
  
  const handleSubmit = async () => {
    if (!validateMessage(message, type)) {
      return;
    }
    
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
  
  // Simple close handler - just closes without complex logic
  const handleSimpleClose = () => {
    console.log('ServiceRequest - Simple close called');
    onClose();
  };
  
  // Complex close handler for buttons (not backdrop clicks)
  const handleComplexClose = () => {
    console.log('ServiceRequest - Complex close called', {
      currentRequestStatus: currentRequest?.status,
      hasQuote: !!currentRequest?.currentQuote,
      shouldShowQuoteDialog
    });
    
    // Block closing ONLY during active price quote
    if (shouldShowQuoteDialog) {
      console.log('ServiceRequest - BLOCKING close - must respond to price quote');
      toast({
        title: "Response Required",
        description: "Please accept or decline the price quote before closing.",
        variant: "destructive"
      });
      return;
    }
    
    // For any other ongoing request, show cancel confirmation
    if (currentRequest && 
        currentRequest.status !== 'completed' && 
        currentRequest.status !== 'cancelled') {
      console.log('ServiceRequest - Showing cancel confirmation');
      setShowCancelConfirmDialog(true);
      return;
    }
    
    // No ongoing request or completed request - close normally
    console.log('ServiceRequest - Closing normally');
    onClose();
  };
  
  const confirmCancelRequest = async () => {
    console.log('ServiceRequest - Confirming cancel request');
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
    console.log('ServiceRequest - Accepting quote...');
    try {
      await acceptQuote();
      toast({
        title: "Quote Accepted",
        description: "The service provider is on their way!"
      });
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
    console.log('ServiceRequest - Declining quote...');
    try {
      await declineQuote();
      toast({
        title: "Quote Declined",
        description: "Looking for alternative options..."
      });
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
  
  const getStatusForDisplay = () => {
    if (!currentRequest) return 'pending';
    
    switch (currentRequest.status) {
      case 'request_accepted':
        return 'pending';
      case 'quote_received':
        return 'pending';
      case 'quote_declined':
        return 'pending';
      case 'quote_accepted':
      case 'in_progress':
        return 'accepted';
      case 'completed':
        return 'accepted';
      case 'cancelled':
        return 'declined';
      default:
        return 'pending';
    }
  };
  
  const getDeclineReason = () => {
    if (currentRequest?.status === 'cancelled') {
      return 'Request was cancelled or no employees available.';
    }
    return '';
  };
  
  // Don't render anything if dialog should not be open
  if (!open) {
    return null;
  }
  
  return (
    <>
      {/* FORM DIALOG - New requests only */}
      {shouldShowForm && (
        <ServiceRequestDialog
          type={type}
          open={true}
          onClose={handleSimpleClose}
          showRealTimeUpdate={false}
        >
          <ServiceRequestForm
            type={type}
            message={message}
            onMessageChange={setMessage}
            userLocation={userLocation}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={handleComplexClose}
          />
        </ServiceRequestDialog>
      )}

      {/* STATUS DIALOG - Ongoing requests (accepted/in-progress) */}
      {shouldShowStatus && currentRequest && (
        <ServiceRequestDialog
          type={type}
          open={true}
          onClose={handleSimpleClose}
          showRealTimeUpdate={true}
        >
          <ServiceRequestStatus
            message={message}
            status={getStatusForDisplay()}
            declineReason={getDeclineReason()}
            userLocation={userLocation}
            employeeLocation={currentRequest.assignedEmployee?.location}
            eta={currentRequest.status === 'in_progress' ? '05:00' : null}
            employeeName={currentRequest.assignedEmployee?.name || ''}
            onContactSupport={handleContactSupport}
            onClose={handleComplexClose}
            onReviewPriceQuote={() => {}}
            hasPriceQuote={!!currentRequest.currentQuote}
            hasStoredSnapshot={false}
            onShowStoredPriceQuote={() => {}}
          />
        </ServiceRequestDialog>
      )}

      {/* PRICE QUOTE DIALOG - HIGHEST PRIORITY - Blocks all other dialogs */}
      {shouldShowQuoteDialog && currentRequest?.currentQuote && (
        <PriceQuoteDialog
          open={true}
          onClose={handleSimpleClose}
          serviceType={type}
          priceQuote={currentRequest.currentQuote.amount}
          onAccept={handleAcceptQuote}
          onDecline={handleDeclineQuote}
          onCancelRequest={confirmCancelRequest}
          hasDeclinedOnce={currentRequest.declineCount > 0 || currentRequest.hasReceivedRevision}
          employeeName={currentRequest.currentQuote.employeeName}
          showWaitingForRevision={false}
        />
      )}

      {/* CANCEL CONFIRMATION DIALOG */}
      {showCancelConfirmDialog && (
        <AlertDialog open={showCancelConfirmDialog} onOpenChange={setShowCancelConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirm-cancellation-title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirm-cancellation-desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowCancelConfirmDialog(false)}>
                {t("no")}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmCancelRequest} 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {t("yes-cancel")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ServiceRequest;
