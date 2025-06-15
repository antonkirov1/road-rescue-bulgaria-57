import React from 'react';
import { useServiceRequestState } from '@/hooks/useServiceRequestState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NewUIEventHandler from './NewUIEventHandler';

const NewServiceRequestManager = ({
  type,
  open,
  onClose,
  onMinimize,
  userLocation,
  userId,
  persistentState
}) => {
  const {
    currentScreen,
    currentRequest,
    assignedEmployee,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize,
    handleLiveTracking
  } = useServiceRequestState({
    type,
    open,
    userLocation,
    userId,
    onClose,
    onMinimize,
    persistentState
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
      <DialogContent className="max-w-md mx-auto my-8 max-h-[90vh] p-0 gap-0">
        <NewUIEventHandler
          currentScreen={currentScreen}
          request={currentRequest}
          assignedEmployee={assignedEmployee}
          onAcceptQuote={handleAcceptQuote}
          onDeclineQuote={handleDeclineQuote}
          onCancelRequest={handleCancelRequest}
          onClose={handleClose}
          onLiveTracking={handleLiveTracking}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceRequestManager;
