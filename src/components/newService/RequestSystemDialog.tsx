
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useServiceRequestFlow } from "./hooks/useServiceRequestFlow";
import SearchingScreen from "./screens/SearchingScreen";
import NoTechnicianScreen from "./screens/NoTechnicianScreen";
import QuoteScreen from "./screens/QuoteScreen";
import RevisedQuoteScreen from "./screens/RevisedQuoteScreen";
import TrackingScreen from "./screens/TrackingScreen";
import CompletedScreen from "./screens/CompletedScreen";
import CancelledScreen from "./screens/CancelledScreen";
import RateEmployeeScreen from "./screens/RateEmployeeScreen";

interface Props {
  open: boolean;
  type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck";
  onClose: () => void;
  userId: string;
  maxDeclines?: number;
}

const RequestSystemDialog: React.FC<Props> = ({ open, type, onClose, userId, maxDeclines = 2 }) => {
  const {
    step,
    request,
    createRequest,
    acceptQuote,
    acceptRevisedQuote,
    declineQuote,
    cancelRequest,
    closeAll,
    handleNoTechnicianOk,
    completeRequest,
    rateEmployee,
  } = useServiceRequestFlow();

  React.useEffect(() => {
    if (open && !request) {
      createRequest(type, `Service for ${type}`, userId);
    }
    if (!open) {
      closeAll();
    }
    // eslint-disable-next-line
  }, [open]);

  const handleClose = () => {
    closeAll();
    onClose();
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

  if (!open || !step) return null;

  const renderScreen = () => {
    switch (step) {
      case "searching":
        return <SearchingScreen onCancel={handleCancelRequest} />;
      case "no_technician":
        return <NoTechnicianScreen onOk={handleNoTechnicianOkAndClose} />;
      case "quote_received":
        return <QuoteScreen request={request!} onAccept={acceptQuote} onDecline={declineQuote} onCancel={handleCancelRequest} />;
      case "revised_quote":
        return <RevisedQuoteScreen request={request!} onAccept={acceptRevisedQuote} onCancel={handleCancelRequest} />;
      case "live_tracking":
        return <TrackingScreen request={request!} onComplete={handleCompleteRequest} />;
      case "completed":
        return <CompletedScreen request={request!} onClose={handleCompleteRequest} />;
      case "rate_employee":
        return <RateEmployeeScreen request={request!} onRate={handleRateEmployee} />;
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
