
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

  // Notify parent about request changes
  React.useEffect(() => {
    if (onRequestChange && (request || initialRequest) && (step || initialStep)) {
      onRequestChange(currentRequest, currentStep);
    }
  }, [request, step, initialRequest, initialStep, onRequestChange, currentRequest, currentStep]);

  React.useEffect(() => {
    if (open && !currentRequest && !initialRequest) {
      console.log('Creating new request with isRealLife:', isRealLife);
      createRequest(type, `Service for ${type}`, userId, isRealLife);
    }
    if (!open && !initialRequest) {
      closeAll();
    }
    // eslint-disable-next-line
  }, [open, isRealLife]);

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
    finalDeclineQuote(isRealLife);
  };

  if (!open || !currentStep) return null;

  const renderScreen = () => {
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
        return (
          <QuoteScreen 
            request={currentRequest!} 
            onAccept={acceptQuote} 
            onDecline={declineQuote} 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "revised_quote":
        return (
          <RevisedPriceQuoteScreen 
            request={currentRequest!} 
            onAccept={acceptRevisedQuote} 
            onDecline={declineQuote} 
            onFinalDecline={handleFinalDecline} 
            onCancel={handleCancelRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "live_tracking":
        return (
          <TrackingScreen 
            request={currentRequest!} 
            onComplete={handleCompleteRequest} 
            onMinimize={handleMinimize} 
          />
        );
      case "completed":
        return <CompletedScreen request={currentRequest!} onClose={handleCompleteRequest} />;
      case "rate_employee":
        return <RateEmployeeScreen request={currentRequest!} onRate={handleRateEmployee} />;
      case "cancelled":
        return <CancelledScreen onClose={handleCloseAll} />;
      default:
        return null;
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
