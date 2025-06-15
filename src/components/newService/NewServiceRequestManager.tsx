
import React from 'react';
import { ServiceRequest, Employee } from '@/types/newServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { useServiceRequestLogic } from './NewServiceRequestLogic';
import NewUIEventHandler from './NewUIEventHandler';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minimize, X } from 'lucide-react';
import GoogleMap from "@/components/GoogleMap";

interface NewServiceRequestManagerProps {
  type: ServiceRequest['type'];
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  userLocation?: { lat: number; lng: number } | null;
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
  const defaultLocation = { lat: 42.6977, lng: 23.3219 }; // Sofia, Bulgaria
  const location = userLocation || defaultLocation;

  // Use simulation service request logic
  const {
    currentScreen,
    currentRequest,
    assignedEmployee,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize,
  } = useServiceRequestLogic({
    type,
    open,
    userLocation: location,
    userId,
    onClose,
    onMinimize,
    persistentState,
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
  };

  const handleInteractOutside = (e: Event) => {
    e.preventDefault();
    handleMinimize();
  };

  if (!open) return null;

  const requestWithEmployeeInfo = currentRequest ? {
      ...currentRequest,
      assignedEmployeeName: assignedEmployee?.name,
    } : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0"
        onInteractOutside={handleInteractOutside}
      >
        <div className="flex items-center border-b justify-between px-6 py-5">
          <DialogHeader className="flex flex-1 items-center justify-center">
            <DialogTitle className="!mb-0 flex items-center gap-1 text-xl font-extrabold font-clash tracking-tight">
              RoadSaver (Sim)
            </DialogTitle>
          </DialogHeader>
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-500 hover:text-gray-400"
              aria-label="Minimize"
              onClick={handleMinimize}
            >
              <Minimize className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-500 hover:text-red-700"
              aria-label="Close"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="w-full bg-background/70 h-40 flex items-center justify-center">
          {location && (
            <GoogleMap
              userLocation={location}
              employeeLocation={assignedEmployee?.location}
              height="160px"
            />
          )}
        </div>

        <div className="flex-1 px-6 pb-4 overflow-y-auto">
          <NewUIEventHandler
            currentScreen={currentScreen}
            request={requestWithEmployeeInfo}
            onAcceptQuote={handleAcceptQuote}
            onDeclineQuote={handleDeclineQuote}
            onCancelRequest={handleCancelRequest}
            onClose={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceRequestManager;
