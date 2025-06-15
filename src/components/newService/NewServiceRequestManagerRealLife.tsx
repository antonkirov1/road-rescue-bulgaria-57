
import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { useServiceRequestLogicRealLife } from './NewServiceRequestLogicRealLife';
import NewUIEventHandler from './NewUIEventHandler';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import GoogleMap from "@/components/GoogleMap";

interface NewServiceRequestManagerRealLifeProps {
  type: ServiceRequest['type'];
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  userLocation?: { lat: number; lng: number } | null;
  userId: string;
  persistentState: ReturnType<typeof usePersistentServiceRequest>;
}

const getDisplayName = (serviceType: string): ServiceRequest['type'] => {
  const mapping: Record<string, ServiceRequest['type']> = {
    'flat-tyre': 'Flat Tyre',
    'out-of-fuel': 'Out of Fuel',
    'car-battery': 'Car Battery',
    'other-car-problems': 'Other Car Problems',
    'tow-truck': 'Tow Truck'
  };
  return mapping[serviceType] || 'Other Car Problems';
};

const mapToServiceRequestStatus = (status: string): ServiceRequest['status'] => {
  const mapping: Record<string, ServiceRequest['status']> = {
    'pending': 'pending',
    'accepted': 'accepted',
    'declined': 'quote_declined',
    'in_progress': 'in_progress',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'quote_sent': 'quote_sent',
    'quote_revised': 'quote_revised',
    'request_created': 'pending',
    'request_accepted': 'accepted',
    'employee_assigned': 'accepted',
    'quote_accepted': 'accepted',
    // ... extend as needed
  };
  return mapping[status] || 'pending';
};

const mapBackendRequestToUI = (
  backendRequest: any,
  userId: string,
  serviceTypeUi: ServiceRequest['type'],
  location: { lat: number; lng: number }
): ServiceRequest => {
  // Defensive: Wherever the backend could have a quote, assign to priceQuote, if revised, assign to revisedPriceQuote, etc.
  // Some fields may be missing, so provide fallbacks/defaults.
  return {
    id: backendRequest.id,
    type: getDisplayName(backendRequest.type ?? serviceTypeUi),
    status: mapToServiceRequestStatus(backendRequest.status),
    userLocation: backendRequest.userLocation ?? location,
    userId,
    description: backendRequest.message || backendRequest.description || `Service request for ${serviceTypeUi}`,
    priceQuote:
      typeof backendRequest.priceQuote === 'number'
        ? backendRequest.priceQuote
        : backendRequest.currentQuote?.amount ?? null,
    revisedPriceQuote:
      typeof backendRequest.revisedPriceQuote === 'number'
        ? backendRequest.revisedPriceQuote
        : backendRequest.currentQuote?.isRevised
          ? backendRequest.currentQuote.amount
          : undefined,
    assignedEmployeeId: backendRequest.assignedEmployeeId,
    assignedEmployeeName: backendRequest.assignedEmployeeName || backendRequest.currentEmployeeName,
    declineCount: backendRequest.declineCount ?? 0,
    createdAt: backendRequest.createdAt
      ? new Date(backendRequest.createdAt)
      : new Date(),
    updatedAt: backendRequest.updatedAt
      ? new Date(backendRequest.updatedAt)
      : new Date(),
  };
};

const NewServiceRequestManagerRealLife: React.FC<NewServiceRequestManagerRealLifeProps> = ({
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

  // Use your hook to get actual real request state from backend (no simulation):
  const {
    currentScreen,
    currentRequest,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize,
  } = useServiceRequestLogicRealLife({
    type,
    open,
    userLocation: location,
    userId,
    onClose,
    onMinimize,
    persistentState,
  });

  // Open/close logic -- close only, no minimize unless explicitly requested:
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
  };

  // Defensive: If backendRequest changes structure, map every time
  const compatibleRequest = currentRequest
    ? mapBackendRequestToUI(currentRequest, userId, type, location)
    : null;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md mx-auto my-8 max-h-[90vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center border-b justify-between px-4 py-3 bg-white shrink-0">
            <DialogHeader className="flex flex-1 items-center justify-center">
              <DialogTitle className="!mb-0 flex items-center gap-1 text-lg font-extrabold font-clash tracking-tight">
                RoadSaver (Live)
              </DialogTitle>
            </DialogHeader>
            <div>
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

          <div className="w-full bg-background/70 h-48 flex items-center justify-center shrink-0">
            <GoogleMap
              userLocation={location}
              height="100%"
            />
          </div>

          <div className="flex-1 px-4 py-4 overflow-y-auto bg-white min-h-0">
            <NewUIEventHandler
              currentScreen={currentScreen}
              request={compatibleRequest}
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

export default NewServiceRequestManagerRealLife;

