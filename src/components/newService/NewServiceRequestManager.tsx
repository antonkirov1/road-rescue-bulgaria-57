
import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useServiceRequestLogic } from './NewServiceRequestLogic';
import NewServiceRequestDialog from './NewServiceRequestDialog';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';

interface NewServiceRequestManagerProps {
  type: ServiceRequest['type'];
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  userLocation: { lat: number; lng: number };
  userId: string;
  persistentState: ReturnType<typeof usePersistentServiceRequest>;
}

const NewServiceRequestManager: React.FC<NewServiceRequestManagerProps> = ({
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
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize
  } = useServiceRequestLogic({
    type,
    open,
    userLocation,
    userId,
    onClose,
    onMinimize,
    persistentState
  });

  return (
    <NewServiceRequestDialog
      open={open}
      onOpenChange={() => {}} // Let the dialog handle its own open/close logic
      currentScreen={currentScreen}
      request={currentRequest}
      onAcceptQuote={handleAcceptQuote}
      onDeclineQuote={handleDeclineQuote}
      onCancelRequest={handleCancelRequest}
      onClose={handleClose}
      onMinimize={handleMinimize}
    />
  );
};

export default NewServiceRequestManager;
