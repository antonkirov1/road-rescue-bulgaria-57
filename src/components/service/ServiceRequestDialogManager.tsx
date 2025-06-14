
import React, { useState } from 'react';
import ServiceRequestDialog from './ServiceRequestDialog';
import ServiceRequestForm from './ServiceRequestForm';
import ServiceRequestStatus from './ServiceRequestStatus';
import PriceQuoteDialog from './PriceQuoteDialog';
import CancelRequestWarningDialog from './CancelRequestWarningDialog';
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
import { ServiceRequestState } from '@/services/serviceRequest/types';
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { useTranslation } from '@/utils/translations';
import { useApp } from '@/contexts/AppContext';

interface ServiceRequestDialogManagerProps {
  type: ServiceType;
  userLocation: { lat: number; lng: number };
  message: string;
  onMessageChange: (message: string) => void;
  currentRequest: ServiceRequestState | null;
  dialogs: {
    showPriceQuoteDialog: boolean;
    showStatusDialog: boolean;
    showFormDialog: boolean;
    dialogKey: number;
  };
  actions: {
    isSubmitting: boolean;
    showCancelConfirmDialog: boolean;
    setShowCancelConfirmDialog: (show: boolean) => void;
    handleSubmit: (message: string) => void;
    handleDialogClose: () => void;
    confirmCancelRequest: () => void;
    handleAcceptQuote: () => void;
    handleDeclineQuote: () => void;
    handleContactSupport: () => void;
  };
}

const ServiceRequestDialogManager: React.FC<ServiceRequestDialogManagerProps> = ({
  type,
  userLocation,
  message,
  onMessageChange,
  currentRequest,
  dialogs,
  actions
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  
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

  const handleCancelRequest = () => {
    setShowCancelWarning(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelWarning(false);
    actions.confirmCancelRequest();
  };

  const handleCancelWarningClose = () => {
    setShowCancelWarning(false);
  };
  
  // Determine which dialog should be active (only one at a time)
  const activeDialog = dialogs.showPriceQuoteDialog ? 'price' :
                     dialogs.showStatusDialog ? 'status' :
                     dialogs.showFormDialog ? 'form' : null;
  
  console.log('ServiceRequestDialogManager - Active dialog:', activeDialog, {
    showPriceQuoteDialog: dialogs.showPriceQuoteDialog,
    showStatusDialog: dialogs.showStatusDialog,
    showFormDialog: dialogs.showFormDialog,
    currentRequest: currentRequest ? {
      id: currentRequest.id,
      status: currentRequest.status,
      hasQuote: !!currentRequest.currentQuote
    } : null
  });
  
  return (
    <>
      {/* FORM DIALOG - New requests only */}
      {activeDialog === 'form' && (
        <ServiceRequestDialog
          type={type}
          open={true}
          onClose={actions.handleDialogClose}
          showRealTimeUpdate={false}
        >
          <ServiceRequestForm
            type={type}
            message={message}
            onMessageChange={onMessageChange}
            userLocation={userLocation}
            isSubmitting={actions.isSubmitting}
            onSubmit={() => actions.handleSubmit(message)}
            onCancel={actions.handleDialogClose}
          />
        </ServiceRequestDialog>
      )}

      {/* STATUS DIALOG - Ongoing requests (accepted/in-progress) */}
      {activeDialog === 'status' && currentRequest && (
        <ServiceRequestDialog
          type={type}
          open={true}
          onClose={actions.handleDialogClose}
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
            onContactSupport={actions.handleContactSupport}
            onClose={actions.handleDialogClose}
            onReviewPriceQuote={() => {}}
            hasPriceQuote={!!currentRequest.currentQuote}
            hasStoredSnapshot={false}
            onShowStoredPriceQuote={() => {}}
          />
        </ServiceRequestDialog>
      )}

      {/* PRICE QUOTE DIALOG - HIGHEST PRIORITY - Blocks all other dialogs */}
      {activeDialog === 'price' && currentRequest?.currentQuote && (
        <PriceQuoteDialog
          key={`price-quote-${dialogs.dialogKey}`}
          open={true}
          onClose={() => {
            console.log('PriceQuoteDialog - Close blocked - must respond to quote');
            // Don't actually close - user must respond
          }}
          serviceType={type}
          priceQuote={currentRequest.currentQuote.amount}
          onAccept={actions.handleAcceptQuote}
          onDecline={actions.handleDeclineQuote}
          onCancelRequest={handleCancelRequest}
          hasDeclinedOnce={currentRequest.declineCount > 0 || currentRequest.hasReceivedRevision}
          employeeName={currentRequest.currentQuote.employeeName}
          showWaitingForRevision={false}
        />
      )}

      {/* CANCEL REQUEST WARNING DIALOG */}
      <CancelRequestWarningDialog
        open={showCancelWarning}
        onClose={handleCancelWarningClose}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* CANCEL CONFIRMATION DIALOG */}
      {actions.showCancelConfirmDialog && (
        <AlertDialog open={actions.showCancelConfirmDialog} onOpenChange={actions.setShowCancelConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirm-cancellation-title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirm-cancellation-desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => actions.setShowCancelConfirmDialog(false)}>
                {t("no")}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={actions.confirmCancelRequest} 
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

export default ServiceRequestDialogManager;
