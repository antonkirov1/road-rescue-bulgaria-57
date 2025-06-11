
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

  // Auto-open dialog when request is accepted
  useEffect(() => {
    if (currentRequest?.status === 'request_accepted' || 
        currentRequest?.status === 'quote_accepted' ||
        currentRequest?.status === 'in_progress') {
      console.log('useServiceRequestDialogs - Auto-opening dialog for status:', currentRequest.status);
      setDialogKey(prev => prev + 1);
    }
  }, [currentRequest?.status]);
  
  // Price quote dialog - HIGHEST PRIORITY - shows when quote is received
  const showPriceQuoteDialog = useMemo(() => {
    if (!open || !currentRequest) return false;
    
    const shouldShow = currentRequest.status === 'quote_received' && !!currentRequest.currentQuote;
    
    console.log('useServiceRequestDialogs - Price quote dialog visibility:', {
      open,
      status: currentRequest?.status,
      hasQuote: !!currentRequest?.currentQuote,
      shouldShow,
      quoteAmount: currentRequest?.currentQuote?.amount
    });
    
    return shouldShow;
  }, [open, currentRequest?.status, currentRequest?.currentQuote]);
  
  // Status dialog - shows for accepted/in-progress states (but NOT when price quote is active)
  const showStatusDialog = useMemo(() => {
    if (!open || !currentRequest || showPriceQuoteDialog) return false;
    
    const shouldShow = currentRequest.status === 'request_accepted' || 
                      currentRequest.status === 'in_progress' ||
                      currentRequest.status === 'quote_accepted' ||
                      currentRequest.status === 'quote_declined';
    
    console.log('useServiceRequestDialogs - Status dialog visibility:', {
      open,
      status: currentRequest?.status,
      showingPriceQuote: showPriceQuoteDialog,
      shouldShow
    });
    
    return shouldShow;
  }, [open, currentRequest?.status, showPriceQuoteDialog]);
  
  // Form dialog - ONLY for new requests when no current request exists
  const showFormDialog = useMemo(() => {
    if (!open) return false;
    
    const shouldShow = !currentRequest;
    
    console.log('useServiceRequestDialogs - Form dialog visibility:', {
      open,
      hasCurrentRequest: !!currentRequest,
      shouldShow
    });
    
    return shouldShow;
  }, [open, currentRequest]);
  
  return {
    showPriceQuoteDialog,
    showStatusDialog,
    showFormDialog,
    dialogKey
  };
};
