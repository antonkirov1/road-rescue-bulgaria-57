
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useServiceRequestFlow } from "./hooks/useServiceRequestFlow";
import SearchingScreen from "./screens/SearchingScreen";
import NoTechnicianScreen from "./screens/NoTechnicianScreen";
import QuoteScreen from "./screens/QuoteScreen";
import RevisedPriceQuoteScreen from "./screens/RevisedPriceQuoteScreen";
import TrackingScreen from "./screens/TrackingScreen";
import CompletedScreen from "./screens/CompletedScreen";
import CancelledScreen from "./screens/CancelledScreen";
import RateEmployeeScreen from "./screens/RateEmployeeScreen";

interface Props {
  open: boolean;
  type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck";
  onClose: () => void;
  onMinimize?: () => void;
  userId: string;
  maxDeclines?: number;
  isRealLife?: boolean;
  initialRequest?: any;
  initialStep?: any;
  onRequestChange?: (request: any, step: any) => void;
}

const RequestSystemDialog: React.FC<Props> = ({ 
  open, 
  type, 
  onClose, 
  onMinimize,
  userId, 
  maxDeclines = 2,
  isRealLife = false,
  initialRequest,
  initialStep,
  onRequestChange
}) => {
  const {
    step,
    request,
    createRequest,
    acceptQuote,
    acceptRevisedQuote,
    declineQuote,
    finalDeclineQuote,
    cancelRequest,
    closeAll,
    handleNoTechnicianOk,
    completeRequest,
    rateEmployee,
  } = useServiceRequestFlow();

  // Use initial state if provided (for restored requests)
  const currentStep = initialStep || step;
  const currentRequest = initialRequest || request;

  console.log('RequestSystemDialog render:', {
    open,
    currentStep,
    hasRequest: !!currentRequest,
    type,
    userId
  });

  // Notify parent about request changes
  React.useEffect(() => {
    if (onRequestChange && (request || initialRequest) && (step || initialStep)) {
      onRequestChange(currentRequest, currentStep);
    }
  }, [request, step, initialRequest, initialStep, onRequestChange, currentRequest, currentStep]);

  React.useEffect(() => {
    console.log('RequestSystemDialog useEffect:', {
      open,
      hasCurrentRequest: !!currentRequest,
      hasInitialRequest: !!initialRequest,
      type,
      userId,
      isRealLife
    });

    if (open && !currentRequest && !initialRequest) {
      console.log('Creating new request with type:', type);
      createRequest(type, `Service for ${type}`, userId, isRealLife);
    }
    if (!open && !initialRequest) {
      closeAll();
    }
  }, [open, isRealLife, type, userId, currentRequest, initialRequest, createRequest, closeAll]);

  const handleClose = () => {
    if (!initialRequest) {
      closeAll();
    }
    onClose();
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      handleClose();
    }
  };

  const handleCancelRequest = () => {
    cancelRequest();
    onClose();
  };

  const handleCompleteRequest = () => {
    completeRequest();
  };

  const handleRateEmployee = (rating: number) => {
    rateEmployee(rating);
    onClose();
  };

  const handleNoTechnicianOkAndClose = () => {
    handleNoTechnicianOk();
    onClose();
  };

  const handleCloseAll = () => {
    closeAll();
    onClose();
  };

  const handleFinalDecline = () => {
    finalDeclineQuote();
  };

  if (!open) {
    console.log('Dialog not open, returning null');
    return null;
  }

  if (!currentStep) {
    console.log('No current step, showing searching as fallback');
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <SearchingScreen 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  const renderScreen = () => {
    console.log('Rendering screen for step:', currentStep);
    
    switch (currentStep) {
      case "searching":
        return (
          <SearchingScreen 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "no_technician":
        return <NoTechnicianScreen onOk={handleNoTechnicianOkAndClose} />;
      case "quote_received":
        if (!currentRequest) {
          console.log('No request for quote screen, showing searching');
          return (
            <SearchingScreen 
              onCancel={handleCancelRequest} 
              onMinimize={handleMinimize} 
            />
          );
        }
        return (
          <QuoteScreen 
            request={currentRequest} 
            onAccept={acceptQuote} 
            onDecline={declineQuote} 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "revised_quote":
        if (!currentRequest) {
          console.log('No request for revised quote screen, showing searching');
          return (
            <SearchingScreen 
              onCancel={handleCancelRequest} 
              onMinimize={handleMinimize} 
            />
          );
        }
        return (
          <RevisedPriceQuoteScreen 
            request={currentRequest} 
            onAccept={acceptRevisedQuote} 
            onDecline={declineQuote} 
            onFinalDecline={handleFinalDecline} 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "live_tracking":
        if (!currentRequest) {
          console.log('No request for tracking screen, showing searching');
          return (
            <SearchingScreen 
              onCancel={handleCancelRequest} 
              onMinimize={handleMinimize} 
            />
          );
        }
        return (
          <TrackingScreen 
            request={currentRequest} 
            onComplete={handleCompleteRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "completed":
        if (!currentRequest) {
          console.log('No request for completed screen');
          return null;
        }
        return <CompletedScreen request={currentRequest} onClose={handleCompleteRequest} />;
      case "rate_employee":
        if (!currentRequest) {
          console.log('No request for rate employee screen');
          return null;
        }
        return <RateEmployeeScreen request={currentRequest} onRate={handleRateEmployee} />;
      case "cancelled":
        return <CancelledScreen onClose={handleCloseAll} />;
      default:
        console.log('Unknown step, showing searching as fallback:', currentStep);
        return (
          <SearchingScreen 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {renderScreen()}
      </DialogContent>
    </Dialog>
  );
};

export default RequestSystemDialog;
