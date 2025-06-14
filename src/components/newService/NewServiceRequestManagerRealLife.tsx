
import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { useServiceRequestLogicRealLife } from './NewServiceRequestLogicRealLife';
import NewUIEventHandler from './NewUIEventHandler';

interface NewServiceRequestManagerRealLifeProps {
  type: ServiceRequest['type'];
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  userLocation?: { lat: number; lng: number } | null;
  userId: string;
  persistentState: ReturnType<typeof usePersistentServiceRequest>;
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
    userId: userId, // Add the missing userId property
    type: currentRequest.type,
    message: currentRequest.message || `Service request for ${type}`,
    location: { lat: location.lat, lng: location.lng },
    status: currentRequest.status as 'pending' | 'accepted' | 'declined',
    timestamp: currentRequest.timestamp || new Date().toISOString(),
    username: userId
  } : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
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
      </div>
    </div>
  );
};

export default NewServiceRequestManagerRealLife;
