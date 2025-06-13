
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ServiceRequest } from '@/types/newServiceRequest';
import NewUIEventHandler from './NewUIEventHandler';

interface NewServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentScreen: string | null;
  request: ServiceRequest | null;
  onAcceptQuote: () => void;
  onDeclineQuote: () => void;
  onCancelRequest: () => void;
  onClose: () => void;
}

const NewServiceRequestDialog: React.FC<NewServiceRequestDialogProps> = ({
  open,
  onOpenChange,
  currentScreen,
  request,
  onAcceptQuote,
  onDeclineQuote,
  onCancelRequest,
  onClose
}) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Only allow closing if service is completed or no active request
      if (!request || 
          request.status === 'completed' || 
          request.status === 'cancelled') {
        onClose();
      } else {
        // Show confirmation for active requests
        const shouldCancel = window.confirm(
          'Are you sure you want to cancel your active service request?'
        );
        if (shouldCancel) {
          onCancelRequest();
        }
      }
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <NewUIEventHandler
          currentScreen={currentScreen}
          request={request}
          onAcceptQuote={onAcceptQuote}
          onDeclineQuote={onDeclineQuote}
          onCancelRequest={onCancelRequest}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceRequestDialog;
