
import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useServiceRequestLogic } from './NewServiceRequestLogic';
import NewServiceRequestDialog from './NewServiceRequestDialog';

interface NewServiceRequestManagerProps {
  type: ServiceRequest['type'];
  open: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number };
  userId: string;
}

const NewServiceRequestManager: React.FC<NewServiceRequestManagerProps> = ({
  type,
  open,
  onClose,
  userLocation,
  userId
}) => {
  const {
    currentScreen,
    currentRequest,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose
  } = useServiceRequestLogic({
    type,
    open,
    userLocation,
    userId,
    onClose
  });

  return (
    <NewServiceRequestDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
      currentScreen={currentScreen}
      request={currentRequest}
      onAcceptQuote={handleAcceptQuote}
      onDeclineQuote={handleDeclineQuote}
      onCancelRequest={handleCancelRequest}
      onClose={handleClose}
    />
  );
};

export default NewServiceRequestManager;
