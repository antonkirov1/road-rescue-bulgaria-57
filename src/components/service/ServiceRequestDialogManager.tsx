
import React from 'react';
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
import { ServiceRequestState } from '@/services/serviceRequestManager';
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { useTranslation } from '@/utils/translations';
import { useApp } from '@/contexts/AppContext';
import { serviceMessages } from './constants/serviceMessages';

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
      {dialogs.showFormDialog && (
        <ServiceRequestDialog
          type={type}
          open={dialogs.showFormDialog}
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

      {/* Status Dialog - for accepted/in-progress requests */}
      {dialogs.showStatusDialog && (
        <ServiceRequestDialog
          type={type}
          open={dialogs.showStatusDialog}
          onClose={actions.handleDialogClose}
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
            onContactSupport={actions.handleContactSupport}
            onClose={actions.handleDialogClose}
            onReviewPriceQuote={() => {}}
            hasPriceQuote={!!currentRequest?.currentQuote}
            hasStoredSnapshot={false}
            onShowStoredPriceQuote={() => {}}
          />
        </ServiceRequestDialog>
      )}

      {/* Price Quote Dialog - AUTOMATIC OPENING */}
      {dialogs.showPriceQuoteDialog && currentRequest?.currentQuote && (
        <PriceQuoteDialog
          key={`price-quote-${dialogs.dialogKey}`}
          open={dialogs.showPriceQuoteDialog}
          onClose={() => {
            console.log('PriceQuoteDialog - Manual close blocked');
          }}
          serviceType={type}
          priceQuote={currentRequest.currentQuote.amount}
          onAccept={actions.handleAcceptQuote}
          onDecline={actions.handleDeclineQuote}
          onCancelRequest={actions.confirmCancelRequest}
          hasDeclinedOnce={currentRequest.declineCount > 0 || currentRequest.hasReceivedRevision}
          employeeName={currentRequest.currentQuote.employeeName}
          showWaitingForRevision={false}
        />
      )}

      {/* Cancel Confirmation Dialog */}
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
              <AlertDialogCancel onClick={() => actions.setShowCancelConfirmDialog(false)}>{t("no")}</AlertDialogCancel>
              <AlertDialogAction onClick={actions.confirmCancelRequest} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
