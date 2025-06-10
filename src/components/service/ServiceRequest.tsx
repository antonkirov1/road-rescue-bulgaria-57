
import React, { useState, useEffect } from 'react';
import ServiceRequestDialog from './ServiceRequestDialog';
import ServiceRequestForm from './ServiceRequestForm';
import ServiceRequestStatus from './ServiceRequestStatus';
import PriceQuoteDialog from './PriceQuoteDialog';
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';
import { useServiceValidation } from './hooks/useServiceValidation';
import { serviceMessages } from './constants/serviceMessages';
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
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from "@/components/ui/use-toast";

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
  
  // Simplified dialog visibility logic - price quote takes priority
  const showPriceQuoteDialog = React.useMemo(() => {
    // Always show price quote when quote is received - this is the main fix
    return currentRequest?.status === 'quote_received' && !!currentRequest?.currentQuote;
  }, [currentRequest?.status, currentRequest?.currentQuote]);
  
  const showStatusDialog = React.useMemo(() => {
    // Only show status if no price quote to show
    if (showPriceQuoteDialog) return false;
    
    // Show for accepted or in_progress states
    return currentRequest?.status === 'request_accepted' || currentRequest?.status === 'in_progress';
  }, [currentRequest?.status, showPriceQuoteDialog]);
  
  const showFormDialog = React.useMemo(() => {
    // Only show form if no other dialogs and dialog is opened manually
    return open && !currentRequest && !showPriceQuoteDialog && !showStatusDialog;
  }, [open, currentRequest, showPriceQuoteDialog, showStatusDialog]);
  
  // Debug logging
  useEffect(() => {
    console.log('ServiceRequest - Dialog visibility state:', {
      open,
      currentRequest: currentRequest ? {
        id: currentRequest.id,
        status: currentRequest.status,
        hasQuote: !!currentRequest.currentQuote,
        quoteAmount: currentRequest.currentQuote?.amount
      } : null,
      shouldShowPriceQuote,
      showPriceQuoteDialog,
      showStatusDialog,
      showFormDialog
    });
  }, [open, currentRequest, shouldShowPriceQuote, showPriceQuoteDialog, showStatusDialog, showFormDialog]);
  
  // Close dialog when service is completed
  useEffect(() => {
    if (currentRequest?.status === 'completed') {
      console.log('ServiceRequest - Service completed, closing dialog');
      onClose();
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
  
  const handleDialogClose = () => {
    // Prevent closing if price quote is active
    if (showPriceQuoteDialog) {
      console.log('ServiceRequest - Preventing close while price quote is showing');
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
    console.log('ServiceRequest - Accepting quote...');
    await acceptQuote();
  };
  
  const handleDeclineQuote = async () => {
    console.log('ServiceRequest - Declining quote...');
    await declineQuote();
    // The revised quote will automatically show when status becomes 'quote_received' again
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
  
  return (
    <>
      {/* Form Dialog - for new requests */}
      {showFormDialog && (
        <ServiceRequestDialog
          type={type}
          open={showFormDialog}
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

      {/* Status Dialog - for accepted/in-progress requests */}
      {showStatusDialog && (
        <ServiceRequestDialog
          type={type}
          open={showStatusDialog}
          onClose={handleDialogClose}
          showRealTimeUpdate={true}
        >
          <ServiceRequestStatus
            message={message}
            status={getStatusForDisplay()}
            declineReason={getDeclineReason()}
            userLocation={userLocation}
            employeeLocation={currentRequest?.assignedEmployee?.location}
            eta={currentRequest?.status === 'in_progress' ? '05:00' : null}
            employeeName={currentRequest?.assignedEmployee?.name || ''}
            onContactSupport={handleContactSupport}
            onClose={handleDialogClose}
            onReviewPriceQuote={() => {}} // Removed - price quote shows automatically
            hasPriceQuote={!!currentRequest?.currentQuote}
            hasStoredSnapshot={false}
            onShowStoredPriceQuote={() => {}}
          />
        </ServiceRequestDialog>
      )}

      {/* Price Quote Dialog - shows automatically when quote received */}
      {showPriceQuoteDialog && currentRequest?.currentQuote && (
        <PriceQuoteDialog
          open={showPriceQuoteDialog}
          onClose={() => {}} // Prevent manual closing
          serviceType={type}
          priceQuote={currentRequest.currentQuote.amount}
          onAccept={handleAcceptQuote}
          onDecline={handleDeclineQuote}
          onCancelRequest={cancelRequest}
          hasDeclinedOnce={currentRequest.declineCount > 0 || currentRequest.hasReceivedRevision}
          employeeName={currentRequest.currentQuote.employeeName}
          showWaitingForRevision={false}
        />
      )}

      {/* Cancel Confirmation Dialog */}
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
              <AlertDialogCancel onClick={() => setShowCancelConfirmDialog(false)}>{t("no")}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancelRequest} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
