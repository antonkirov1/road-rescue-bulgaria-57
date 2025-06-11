
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
}

const ServiceRequest: React.FC<ServiceRequestProps> = ({ 
  type, 
  open, 
  onClose, 
  userLocation
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  const { validateMessage } = useServiceValidation();
  const { currentRequest, createRequest, acceptQuote, declineQuote, cancelRequest } = useServiceRequestManager();
  
  const [message, setMessage] = useState(() => serviceMessages[type] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  
  console.log('ServiceRequest - Render:', {
    open,
    type,
    currentRequest: currentRequest ? {
      id: currentRequest.id,
      status: currentRequest.status,
      hasQuote: !!currentRequest.currentQuote,
      quoteAmount: currentRequest.currentQuote?.amount,
      employeeName: currentRequest.assignedEmployee?.name
    } : null
  });

  // Auto-close when service is completed or cancelled
  useEffect(() => {
    if (currentRequest?.status === 'completed' || currentRequest?.status === 'cancelled') {
      console.log('ServiceRequest - Service completed/cancelled, auto-closing');
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentRequest?.status, onClose]);

  // Determine which dialog to show based on current state
  const getActiveDialog = () => {
    if (!open) return null;
    
    // No current request = show form dialog
    if (!currentRequest) {
      return 'form';
    }

    // Quote received = show price quote dialog (HIGHEST PRIORITY)
    if (currentRequest.status === 'quote_received' && currentRequest.currentQuote) {
      console.log('ServiceRequest - Should show price quote dialog');
      return 'price-quote';
    }

    // Show waiting/status dialog for other states
    if (['request_accepted', 'quote_declined', 'quote_accepted', 'in_progress', 'completed'].includes(currentRequest.status)) {
      return 'status';
    }

    return null;
  };

  const activeDialog = getActiveDialog();
  
  console.log('ServiceRequest - Active dialog determination:', {
    activeDialog,
    status: currentRequest?.status,
    hasQuote: !!currentRequest?.currentQuote,
    open
  });

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
      console.log('ServiceRequest - Creating new request:', { type, userLocation, message });
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
    console.log('ServiceRequest - Dialog close requested, activeDialog:', activeDialog);
    
    // For price quote dialog - user must respond, can't close
    if (activeDialog === 'price-quote') {
      console.log('ServiceRequest - BLOCKING close - must respond to price quote');
      toast({
        title: "Response Required",
        description: "Please accept or decline the price quote before closing.",
        variant: "destructive"
      });
      return;
    }
    
    // For ongoing requests, show cancel confirmation
    if (currentRequest && 
        !['completed', 'cancelled'].includes(currentRequest.status)) {
      console.log('ServiceRequest - Showing cancel confirmation');
      setShowCancelConfirmDialog(true);
      return;
    }
    
    // Normal close for form dialog or completed requests
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
      case 'quote_received':
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

  // Don't render anything if dialog is not open
  if (!open) {
    return null;
  }
  
  return (
    <>
      {/* FORM DIALOG - New requests only */}
      {activeDialog === 'form' && (
        <ServiceRequestDialog
          type={type}
          open={true}
          onClose={handleDialogClose}
          showRealTimeUpdate={false}
        >
          <ServiceRequestForm
            type={type}
            message={message}
            onMessageChange={setMessage}
            userLocation={userLocation}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={handleDialogClose}
          />
        </ServiceRequestDialog>
      )}

      {/* STATUS DIALOG - Request processing, accepted, in progress */}
      {activeDialog === 'status' && currentRequest && (
        <ServiceRequestDialog
          type={type}
          open={true}
          onClose={handleDialogClose}
          showRealTimeUpdate={currentRequest.status === 'request_accepted' && !currentRequest.assignedEmployee}
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
            onClose={handleDialogClose}
            onReviewPriceQuote={() => {}} // Not used anymore
            hasPriceQuote={false} // Price quote is handled separately
            hasStoredSnapshot={false}
            onShowStoredPriceQuote={() => {}}
          />
        </ServiceRequestDialog>
      )}

      {/* PRICE QUOTE DIALOG - Quote received state */}
      {activeDialog === 'price-quote' && currentRequest?.currentQuote && (
        <PriceQuoteDialog
          open={true}
          onClose={() => {
            // Price quote dialog cannot be closed - user must respond
            console.log('PriceQuoteDialog close blocked - user must respond');
          }}
          serviceType={type}
          priceQuote={currentRequest.currentQuote.amount}
          onAccept={handleAcceptQuote}
          onDecline={handleDeclineQuote}
          onCancelRequest={confirmCancelRequest}
          hasDeclinedOnce={currentRequest.declineCount > 0 || currentRequest.hasReceivedRevision}
          employeeName={currentRequest.currentQuote.employeeName}
          showWaitingForRevision={currentRequest.status === 'quote_declined'}
        />
      )}

      {/* CANCEL CONFIRMATION DIALOG */}
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
    </>
  );
};

export default ServiceRequest;
