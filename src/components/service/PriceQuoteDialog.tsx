
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WaitingForRevisionDialog from './price-quote/WaitingForRevisionDialog';
import PriceQuoteContent from './price-quote/PriceQuoteContent';
import DeclineConfirmDialog from './price-quote/DeclineConfirmDialog';
import CancelConfirmDialog from './price-quote/CancelConfirmDialog';

interface PriceQuoteDialogProps {
  open: boolean;
  onClose: () => void;
  serviceType: string;
  priceQuote: number;
  onAccept: () => void;
  onDecline: (isSecondDecline?: boolean) => void;
  onCancelRequest: () => void;
  hasDeclinedOnce?: boolean;
  employeeName?: string;
  showWaitingForRevision?: boolean;
}

const PriceQuoteDialog: React.FC<PriceQuoteDialogProps> = ({
  open,
  onClose,
  serviceType,
  priceQuote,
  onAccept,
  onDecline,
  onCancelRequest,
  hasDeclinedOnce = false,
  employeeName = '',
  showWaitingForRevision = false
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  console.log('PriceQuoteDialog render:', { 
    open, 
    serviceType, 
    priceQuote, 
    employeeName, 
    hasDeclinedOnce,
    showWaitingForRevision 
  });

  // Force dialog to stay open and log when it opens
  useEffect(() => {
    if (open) {
      console.log('PriceQuoteDialog - OPENED AUTOMATICALLY:', {
        priceQuote,
        employeeName,
        hasDeclinedOnce
      });
    }
  }, [open, priceQuote, employeeName, hasDeclinedOnce]);

  const handleCancelRequest = () => {
    console.log('handleCancelRequest called');
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    console.log('confirmCancel called');
    onCancelRequest();
    setShowCancelConfirm(false);
    onClose();
  };

  const handleDecline = () => {
    if (!hasDeclinedOnce) {
      // First decline - show confirmation
      setShowDeclineConfirm(true);
    } else {
      // Second decline (Final Decline) - direct decline (blacklist employee and find new one)
      onDecline(true);
    }
  };

  const confirmDecline = () => {
    console.log('confirmDecline called - first decline');
    setShowDeclineConfirm(false);
    onDecline(false); // First decline
  };

  const handleAccept = () => {
    console.log('handleAccept called');
    onAccept();
  };

  // For price quote dialogs, clicking outside should NOT close - user must respond
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      console.log('PriceQuoteDialog - Backdrop click blocked - user must respond to quote');
      // Don't close - force user to make a choice
      return;
    }
  };

  // Show waiting for revision dialog
  if (showWaitingForRevision) {
    return (
      <WaitingForRevisionDialog
        open={open}
        onOpenChange={handleOpenChange}
        employeeName={employeeName}
        onCancelRequest={handleCancelRequest}
      />
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent 
          className="max-w-md"
          onInteractOutside={(e) => {
            e.preventDefault(); // Block backdrop clicks for price quotes
            console.log('PriceQuoteDialog - Backdrop click prevented - user must respond');
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault(); // Prevent ESC key closing
            console.log('PriceQuoteDialog - ESC key prevented');
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {hasDeclinedOnce ? 'Revised Price Quote' : 'Price Quote Received'}
            </DialogTitle>
          </DialogHeader>
          <PriceQuoteContent
            serviceType={serviceType}
            priceQuote={priceQuote}
            employeeName={employeeName}
            hasDeclinedOnce={hasDeclinedOnce}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onCancelRequest={handleCancelRequest}
          />
        </DialogContent>
      </Dialog>
      
      <DeclineConfirmDialog
        open={showDeclineConfirm}
        onOpenChange={setShowDeclineConfirm}
        employeeName={employeeName}
        onConfirm={confirmDecline}
        onCancel={() => setShowDeclineConfirm(false)}
      />
      
      <CancelConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
};

export default PriceQuoteDialog;
