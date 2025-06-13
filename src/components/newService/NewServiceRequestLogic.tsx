
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';

interface UseServiceRequestLogicProps {
  type: ServiceRequest['type'];
  open: boolean;
  userLocation: { lat: number; lng: number };
  userId: string;
  onClose: () => void;
}

export const useServiceRequestLogic = ({
  type,
  open,
  userLocation,
  userId,
  onClose
}: UseServiceRequestLogicProps) => {
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);

  // Initialize when dialog opens
  useEffect(() => {
    if (open && !currentRequest) {
      console.log('Initializing new service request for:', type);
      handleSubmitRequest();
    }
  }, [open, type]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentScreen(null);
      setCurrentRequest(null);
    }
  }, [open]);

  const handleSubmitRequest = async () => {
    try {
      console.log('Starting service request for:', type);
      
      // Create a service request
      const newRequest: ServiceRequest = {
        id: `req_${Date.now()}`,
        type: type,
        status: 'pending',
        userLocation: userLocation,
        userId: userId,
        description: `I need ${type} assistance`,
        declineCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentRequest(newRequest);
      setCurrentScreen('show_searching_technician');
      
      // Simulate finding technician and getting quote
      setTimeout(() => {
        // Simulate quote received
        const quote = Math.floor(Math.random() * 50) + 20; // Random quote between 20-70
        const updatedRequest = {
          ...newRequest,
          status: 'quote_sent' as const,
          priceQuote: quote
        };
        setCurrentRequest(updatedRequest);
        setCurrentScreen('show_price_quote_received');
      }, 3000); // Show searching for 3 seconds
      
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
      const updatedRequest = {
        ...currentRequest,
        status: 'accepted' as const
      };
      setCurrentRequest(updatedRequest);
      setCurrentScreen('show_request_accepted');
      
      // Simulate service progression
      setTimeout(() => {
        setCurrentScreen('show_live_tracking');
      }, 2000);
      
      setTimeout(() => {
        const completedRequest = {
          ...updatedRequest,
          status: 'completed' as const
        };
        setCurrentRequest(completedRequest);
        setCurrentScreen('show_service_completed');
      }, 8000);
      
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
      const declineCount = currentRequest.declineCount + 1;
      
      if (declineCount === 1) {
        // First decline - show revised quote
        const revisedQuote = Math.max(10, (currentRequest.priceQuote || 50) - Math.floor(Math.random() * 15) - 5);
        const updatedRequest = {
          ...currentRequest,
          declineCount,
          revisedPriceQuote: revisedQuote,
          status: 'quote_revised' as const
        };
        setCurrentRequest(updatedRequest);
        setCurrentScreen('show_revised_price_quote');
      } else {
        // Second decline - find new technician
        setCurrentScreen('show_searching_technician');
        
        setTimeout(() => {
          const newQuote = Math.floor(Math.random() * 50) + 20;
          const updatedRequest = {
            ...currentRequest,
            declineCount: 0, // Reset for new employee
            priceQuote: newQuote,
            revisedPriceQuote: undefined,
            status: 'quote_sent' as const
          };
          setCurrentRequest(updatedRequest);
          setCurrentScreen('show_price_quote_received');
        }, 3000);
      }
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
      setCurrentScreen(null);
      setCurrentRequest(null);
      onClose();
      
      toast({
        title: "Request Cancelled",
        description: "Your service request has been cancelled."
      });
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

  return {
    currentScreen,
    currentRequest,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose
  };
};
