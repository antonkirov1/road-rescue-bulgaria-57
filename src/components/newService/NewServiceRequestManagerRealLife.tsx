import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { useServiceRequestLogicRealLife } from './NewServiceRequestLogicRealLife';
import NewUIEventHandler from './NewUIEventHandler';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minimize, X, Activity } from 'lucide-react';

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
    'cancelled': 'cancelled'
  };
  return mapping[status] || 'pending';
};

/**
 * Optional: Active Request Button for real-life UI exact-matching simulation
 */
function ActiveRequestButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed z-30 bottom-7 right-7 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-3 flex items-center shadow-lg transition-all animate-fade-in"
      style={{ animationDelay: '200ms' }}
      aria-label="Open active service request"
      onClick={onClick}
    >
      <Activity className="w-6 h-6 mr-2 animate-pulse" />
      <span>Active Request</span>
    </button>
  );
}

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

  const {
    currentScreen,
    currentRequest,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize
  } = useServiceRequestLogicRealLife({
    type,
    open,
    userLocation: location,
    userId,
    onClose,
    onMinimize,
    persistentState
  });

  /**
   * Exact minimize/close handling as simulation:
   * - clicking outside OR pressing escape => minimize if not finished, else close
   */
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (currentRequest && !['completed', 'cancelled'].includes(currentRequest.status)) {
        handleMinimize();
      } else {
        handleClose();
      }
    }
  };
  const handleInteractOutside = (e: Event) => {
    e.preventDefault();
    if (currentRequest && !['completed', 'cancelled'].includes(currentRequest.status)) {
      handleMinimize();
    } else {
      handleClose();
    }
  };

  if (!open) return null;

  const compatibleRequest = currentRequest ? {
    ...currentRequest,
    userId,
    type: getDisplayName(currentRequest.type),
    message: currentRequest.message || `Service request for ${type}`,
    location: { lat: location.lat, lng: location.lng },
    status: mapToServiceRequestStatus(currentRequest.status),
    timestamp: currentRequest.timestamp || new Date().toISOString(),
    username: userId,
    createdAt: currentRequest.timestamp ? new Date(currentRequest.timestamp) : new Date(),
    updatedAt: currentRequest.timestamp ? new Date(currentRequest.timestamp) : new Date()
  } : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-hidden flex flex-col px-0 pt-0"
        onInteractOutside={handleInteractOutside}
      >
        <div className="flex items-center border-b justify-between px-6 py-5">
          {/* Mini icon/logo to match simulation style, adjust if needed */}
          <span className="text-red-600 text-2xl" aria-label="app icon">🚨</span>
          <DialogHeader className="flex flex-1 items-center justify-center">
            <DialogTitle className="!mb-0 flex items-center gap-1 text-xl font-extrabold font-clash tracking-tight">
              RoadSaver
            </DialogTitle>
          </DialogHeader>
          {/* Minimize and Close on right */}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-500 hover:text-red-700"
              aria-label="Minimize"
              onClick={handleMinimize}
            >
              <Minimize className="w-4 h-4" />
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

        {/* Map placeholder (replace with Google Maps as soon as component is ready) */}
        <div className="w-full bg-background/70 h-40 flex items-center justify-center">
          {/* Future: <GoogleMap ... /> */}
          <span className="text-sm text-muted-foreground">Location map goes here</span>
        </div>

        <div className="flex-1 px-6 pb-4 overflow-y-auto">
          <NewUIEventHandler
            currentScreen={currentScreen}
            request={compatibleRequest}
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

export default NewServiceRequestManagerRealLife;
