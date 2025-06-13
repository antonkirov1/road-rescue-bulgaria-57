
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
  onMinimize: () => void;
}

const NewServiceRequestDialog: React.FC<NewServiceRequestDialogProps> = ({
  open,
  onOpenChange,
  currentScreen,
  request,
  onAcceptQuote,
  onDeclineQuote,
  onCancelRequest,
  onClose,
  onMinimize
}) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // If there's an active request, minimize instead of closing
      if (request && 
          !['completed', 'cancelled'].includes(request.status)) {
        console.log('Minimizing active request instead of closing');
        onMinimize();
        return;
      } else {
        // No active request or completed/cancelled - close normally
        onClose();
      }
    }
  };

  const handleInteractOutside = (e: Event) => {
    // Prevent default closing behavior
    e.preventDefault();
    
    // If there's an active request that's not completed/cancelled, minimize it
    if (request && !['completed', 'cancelled'].includes(request.status)) {
      console.log('Minimizing due to outside interaction');
      onMinimize();
    } else {
      // No active request or completed/cancelled - close normally
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={handleInteractOutside}
      >
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
