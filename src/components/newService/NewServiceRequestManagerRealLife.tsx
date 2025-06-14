
import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { useServiceRequestLogicRealLife } from './NewServiceRequestLogicRealLife';
import NewUIEventHandler from './NewUIEventHandler';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (currentRequest && !['completed', 'cancelled'].includes(currentRequest.status)) {
        console.log('Minimizing real-life request due to dialog close');
        handleMinimize();
      } else {
        handleClose();
      }
    }
  };

  const handleInteractOutside = (e: Event) => {
    e.preventDefault();
    
    if (currentRequest && !['completed', 'cancelled'].includes(currentRequest.status)) {
      console.log('Minimizing real-life request due to outside interaction');
      handleMinimize();
    } else {
      handleClose();
    }
  };

  if (!open) return null;

  // Create a compatible request object for the UI handler
  const compatibleRequest = currentRequest ? {
    ...currentRequest,
    userId: userId,
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
        className="max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={handleInteractOutside}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-red-600">🚨</span>
            Real-Life Service Request: {type}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleMinimize}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Minimize
            </button>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="bg-red-50 dark:bg-red-900 p-3 rounded border-l-4 border-red-400">
            <p className="text-sm text-red-800 dark:text-red-200">
              🚨 Real-Life Mode: This request will create actual service tickets and contact real employees
            </p>
          </div>
        </div>

        <NewUIEventHandler
          currentScreen={currentScreen}
          request={compatibleRequest}
          onAcceptQuote={handleAcceptQuote}
          onDeclineQuote={handleDeclineQuote}
          onCancelRequest={handleCancelRequest}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceRequestManagerRealLife;
