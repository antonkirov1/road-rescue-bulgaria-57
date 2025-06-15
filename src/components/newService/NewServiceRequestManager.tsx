
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

  console.log('NewServiceRequestManager - userLocation:', userLocation, 'location:', location);

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
      <DialogContent className="max-w-md mx-auto my-8 max-h-[90vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center border-b justify-between px-4 py-3 bg-white shrink-0">
            <DialogHeader className="flex flex-1 items-center justify-center">
              <DialogTitle className="!mb-0 flex items-center gap-1 text-lg font-extrabold font-clash tracking-tight">
                RoadSaver (Sim)
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-500 hover:text-gray-400 h-8 w-8"
                aria-label="Minimize"
                onClick={handleMinimize}
              >
                <Minimize className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-500 hover:text-red-700 h-8 w-8"
                aria-label="Close"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="w-full bg-background/70 h-32 flex items-center justify-center shrink-0">
            <GoogleMap
              userLocation={location}
              employeeLocation={assignedEmployee?.location}
              height="100%"
            />
          </div>

          <div className="flex-1 px-4 py-4 overflow-y-auto bg-white min-h-0">
            <NewUIEventHandler
              currentScreen={currentScreen}
              request={requestWithEmployeeInfo}
              onAcceptQuote={handleAcceptQuote}
              onDeclineQuote={handleDeclineQuote}
              onCancelRequest={handleCancelRequest}
              onClose={handleClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceRequestManager;
