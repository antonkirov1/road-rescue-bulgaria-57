
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { roadsideAssistanceSystem } from '@/services/newRoadsideAssistanceSystem';
import { ServiceRequest, UIEvent } from '@/types/newServiceRequest';
import NewUIEventHandler from './NewUIEventHandler';
import { toast } from '@/components/ui/use-toast';

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
  const [currentScreen, setCurrentScreen] = useState<string | null>('show_searching_technician');
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && open) {
      // Set up event listeners
      const handleUIEvent = (eventType: UIEvent) => (data?: any) => {
        console.log(`UI Event: ${eventType}`, data);
        setCurrentScreen(eventType);
        if (data && data.id) {
          setCurrentRequest(data);
        }
      };

      // Register all UI event listeners
      roadsideAssistanceSystem.on('show_searching_technician', handleUIEvent('show_searching_technician'));
      roadsideAssistanceSystem.on('show_price_quote_received', handleUIEvent('show_price_quote_received'));
      roadsideAssistanceSystem.on('show_revised_price_quote', handleUIEvent('show_revised_price_quote'));
      roadsideAssistanceSystem.on('show_request_accepted', handleUIEvent('show_request_accepted'));
      roadsideAssistanceSystem.on('show_request_started', handleUIEvent('show_request_started'));
      roadsideAssistanceSystem.on('show_employee_en_route', handleUIEvent('show_employee_en_route'));
      roadsideAssistanceSystem.on('show_live_tracking', handleUIEvent('show_live_tracking'));
      roadsideAssistanceSystem.on('show_service_completed', handleUIEvent('show_service_completed'));
      roadsideAssistanceSystem.on('show_no_technicians_available', handleUIEvent('show_no_technicians_available'));
      roadsideAssistanceSystem.on('show_price_edit_notification', handleUIEvent('show_revised_price_quote'));

      setIsInitialized(true);
      
      // Immediately start the service request process
      handleSubmitRequest();
    }
  }, [isInitialized, open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentScreen('show_searching_technician');
      setCurrentRequest(null);
      setIsInitialized(false);
    }
  }, [open]);

  const handleSubmitRequest = async () => {
    try {
      console.log('Starting service request for:', type);
      
      // Create a mock request immediately for UI purposes
      const mockRequest: ServiceRequest = {
        id: `req_${Date.now()}`,
        type: type,
        status: 'pending',
        location: userLocation,
        userId: userId,
        message: `I need ${type} assistance`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCurrentRequest(mockRequest);
      setCurrentScreen('show_searching_technician');
      
      // Start the actual service request process
      const requestId = await roadsideAssistanceSystem.sendRequest(
        userId,
        type,
        `I need ${type} assistance`,
        userLocation
      );
      
      console.log('Service request created:', requestId);
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive"
      });
      onClose();
    }
  };

  const handleAcceptQuote = async () => {
    if (!currentRequest) return;
    
    try {
      await roadsideAssistanceSystem.acceptQuote(currentRequest.id);
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast({
        title: "Error",
        description: "Failed to accept quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineQuote = async () => {
    if (!currentRequest) return;
    
    try {
      await roadsideAssistanceSystem.declineQuote(currentRequest.id);
    } catch (error) {
      console.error('Error declining quote:', error);
      toast({
        title: "Error",
        description: "Failed to decline quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelRequest = async () => {
    if (!currentRequest) return;
    
    try {
      await roadsideAssistanceSystem.cancelRequest(currentRequest.id);
      setCurrentScreen(null);
      setCurrentRequest(null);
      onClose();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setCurrentScreen(null);
    setCurrentRequest(null);
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Only allow closing if service is completed or no active request
      if (!currentRequest || 
          currentRequest.status === 'completed' || 
          currentRequest.status === 'cancelled' ||
          currentRequest.status === 'declined') {
        handleClose();
      } else {
        // Show confirmation for active requests
        const shouldCancel = window.confirm(
          'Are you sure you want to cancel your active service request?'
        );
        if (shouldCancel) {
          handleCancelRequest();
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <NewUIEventHandler
          currentScreen={currentScreen}
          request={currentRequest}
          onAcceptQuote={handleAcceptQuote}
          onDeclineQuote={handleDeclineQuote}
          onCancelRequest={handleCancelRequest}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceRequestManager;
