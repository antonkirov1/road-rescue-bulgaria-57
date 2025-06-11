
import { useMemo, useEffect, useState } from 'react';
import { ServiceRequestState } from '@/services/serviceRequest/types';

interface DialogVisibility {
  showPriceQuoteDialog: boolean;
  showStatusDialog: boolean;
  showFormDialog: boolean;
}

export const useServiceRequestDialogs = (
  open: boolean,
  currentRequest: ServiceRequestState | null
): DialogVisibility & { dialogKey: number } => {
  const [dialogKey, setDialogKey] = useState(0);
  
  // Force dialog refresh when quote status changes
  useEffect(() => {
    if (currentRequest?.status === 'quote_received' && currentRequest?.currentQuote) {
      console.log('useServiceRequestDialogs - Quote received, forcing dialog refresh');
      setDialogKey(prev => prev + 1);
    }
  }, [currentRequest?.status, currentRequest?.currentQuote?.amount]);
  
  // Price quote dialog should show automatically when quote is received
  const showPriceQuoteDialog = useMemo(() => {
    const shouldShow = !!(
      open && 
      currentRequest?.status === 'quote_received' && 
      currentRequest?.currentQuote
    );
    console.log('useServiceRequestDialogs - Price quote dialog visibility:', {
      open,
      status: currentRequest?.status,
      hasQuote: !!currentRequest?.currentQuote,
      shouldShow,
      quoteAmount: currentRequest?.currentQuote?.amount
    });
    return shouldShow;
  }, [open, currentRequest?.status, currentRequest?.currentQuote, dialogKey]);
  
  // Status dialog for accepted/in-progress states (but not when price quote is showing)
  const showStatusDialog = useMemo(() => {
    if (!open || showPriceQuoteDialog) return false;
    
    const shouldShow = !!(
      currentRequest && 
      (currentRequest.status === 'request_accepted' || currentRequest.status === 'in_progress')
    );
    console.log('useServiceRequestDialogs - Status dialog visibility:', {
      open,
      status: currentRequest?.status,
      showingPriceQuote: showPriceQuoteDialog,
      shouldShow
    });
    return shouldShow;
  }, [open, currentRequest?.status, showPriceQuoteDialog]);
  
  // Form dialog for new requests (when no current request exists)
  const showFormDialog = useMemo(() => {
    const shouldShow = !!(
      open && 
      !currentRequest && 
      !showPriceQuoteDialog && 
      !showStatusDialog
    );
    console.log('useServiceRequestDialogs - Form dialog visibility:', {
      open,
      hasCurrentRequest: !!currentRequest,
      showingPriceQuote: showPriceQuoteDialog,
      showingStatus: showStatusDialog,
      shouldShow
    });
    return shouldShow;
  }, [open, currentRequest, showPriceQuoteDialog, showStatusDialog]);
  
  return {
    showPriceQuoteDialog,
    showStatusDialog,
    showFormDialog,
    dialogKey
  };
};
