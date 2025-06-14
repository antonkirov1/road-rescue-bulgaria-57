
import { useState, useEffect } from 'react';
import { ServiceType } from './types/serviceRequestState';
import { ServiceRequestState } from '@/services/serviceRequest/types';
import { toast } from "@/components/ui/use-toast";
import { UserHistoryService } from '@/services/userHistoryService';
import { useApp } from '@/contexts/AppContext';
import { useRequestSimulation } from './hooks/useRequestSimulation';

interface ServiceRequestLogicProps {
  type: ServiceType;
  userLocation: { lat: number; lng: number };
  onClose: () => void;
}

export const useServiceRequestLogic = ({ type, userLocation, onClose }: ServiceRequestLogicProps) => {
  const { user } = useApp();
  const [request, setRequest] = useState<ServiceRequestState>({
  id: '',
  type,
  status: 'pending',
  userLocation,
  blacklistedEmployees: [],
  timestamp: new Date().toISOString(),
  priceQuote: null,
  assignedEmployeeName: '',
  employeeLocation: undefined,
  etaSeconds: 0,
  message: '',
  isSubmitting: false,
  showRealTimeUpdate: false,
  showPriceQuote: false,
  declineReason: '',
  serviceFee: undefined,
  hasDeclinedOnce: undefined,
  isWaitingForRevision: undefined,
  currentEmployeeName: undefined,
  declinedEmployees: undefined
});


  const [showSearching, setShowSearching] = useState(false);
  const [showPriceQuote, setShowPriceQuote] = useState(false);
  const [showRealTimeUpdate, setShowRealTimeUpdate] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [etaRemaining, setEtaRemaining] = useState(0);

  const { simulateEmployeeResponse, handleAccept, addEmployeeToBlacklist } = useRequestSimulation();

  useEffect(() => {
    if (!user) return;

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setRequest(prev => ({ ...prev, id: requestId }));
    
    // Start simulation
    setTimeout(() => {
      setShowSearching(true);
      
      // Call simulation with correct number of arguments (11)
      simulateEmployeeResponse(
        requestId,
        new Date().toISOString(),
        type,
        userLocation,
        (quote: number) => {
          setRequest(prev => ({ ...prev, priceQuote: quote }));
          setShowSearching(false);
          setShowPriceQuote(true);
        },
        setShowPriceQuote,
        setShowRealTimeUpdate,
        (status: 'pending' | 'accepted' | 'declined') => {
          setRequest(prev => ({ ...prev, status }));
        },
        setDeclineReason,
        (location: { lat: number; lng: number } | undefined) => {
          setRequest(prev => ({ ...prev, employeeLocation: location }));
        },
        (employeeName: string) => {
          setRequest(prev => ({ ...prev, assignedEmployeeName: employeeName }));
        },
        request.blacklistedEmployees
      );
    }, 1000);
  }, [user, type, userLocation]);

  const handleAcceptQuote = async () => {
    if (!user || !request.employeeLocation || !request.assignedEmployeeName) return;

    setShowPriceQuote(false);
    setShowRealTimeUpdate(true);
    
    const estimatedEta = 120 + Math.floor(Math.random() * 180); // 2-5 minutes
    setEtaRemaining(estimatedEta);

    await handleAccept(
      request.id,
      request.priceQuote || 0,
      request.assignedEmployeeName,
      user.username,
      userLocation,
      request.employeeLocation,
      estimatedEta,
      type,
      (remaining: number) => setEtaRemaining(remaining),
      (location: { lat: number; lng: number }) => {
        setRequest(prev => ({ ...prev, employeeLocation: location }));
      },
      () => {
        setShowRealTimeUpdate(false);
        setShowCompleted(true);
      }
    );
  };

  const handleDeclineQuote = async () => {
    if (!user || !request.assignedEmployeeName) return;

    try {
      // Add current employee to blacklist
      await addEmployeeToBlacklist(request.id, request.assignedEmployeeName, user.username);
      
      // Update local blacklist
      setRequest(prev => ({
        ...prev,
        blacklistedEmployees: [...prev.blacklistedEmployees, prev.assignedEmployeeName],
        assignedEmployeeName: '',
        priceQuote: null,
        employeeLocation: undefined
      }));

      setShowPriceQuote(false);
      setShowSearching(true);

      // Find new employee
      setTimeout(() => {
        const updatedBlacklist = [...request.blacklistedEmployees, request.assignedEmployeeName];
        
        simulateEmployeeResponse(
          request.id,
          new Date().toISOString(),
          type,
          userLocation,
          (quote: number) => {
            setRequest(prev => ({ ...prev, priceQuote: quote }));
            setShowSearching(false);
            setShowPriceQuote(true);
          },
          setShowPriceQuote,
          setShowRealTimeUpdate,
          (status: 'pending' | 'accepted' | 'declined') => {
            setRequest(prev => ({ ...prev, status }));
          },
          setDeclineReason,
          (location: { lat: number; lng: number } | undefined) => {
            setRequest(prev => ({ ...prev, employeeLocation: location }));
          },
          (employeeName: string) => {
            setRequest(prev => ({ ...prev, assignedEmployeeName: employeeName }));
          },
          updatedBlacklist
        );
      }, 2000);

    } catch (error) {
      console.error('Error declining quote:', error);
      toast({
        title: "Error",
        description: "Failed to decline quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleComplete = () => {
    onClose();
  };

  return {
    request,
    showSearching,
    showPriceQuote,
    showRealTimeUpdate,
    showCompleted,
    declineReason,
    etaRemaining,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancel,
    handleComplete
  };
};
