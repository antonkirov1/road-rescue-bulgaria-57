
import React from "react";
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
}

const RequestSystemDialog: React.FC<Props> = ({ open, type, onClose, userId }) => {
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
    if (open && !request) createRequest(type, `Service for ${type}`, userId);
    if (!open) closeAll();
    // eslint-disable-next-line
  }, [open]);

  if (!open || !step) return null;

  switch (step) {
    case "searching":
      return <SearchingScreen onCancel={cancelRequest} />;
    case "no_technician":
      return <NoTechnicianScreen onOk={handleNoTechnicianOk} />;
    case "quote_received":
      return <QuoteScreen request={request!} onAccept={acceptQuote} onDecline={declineQuote} onCancel={cancelRequest} />;
    case "revised_quote":
      return <RevisedQuoteScreen request={request!} onAccept={acceptRevisedQuote} onCancel={cancelRequest} />;
    case "live_tracking":
      return <TrackingScreen request={request!} onComplete={completeRequest} />;
    case "completed":
      return <CompletedScreen request={request!} onClose={completeRequest} />;
    case "rate_employee":
      return <RateEmployeeScreen request={request!} onRate={rateEmployee} />;
    case "cancelled":
      return <CancelledScreen onClose={closeAll} />;
    default:
      return null;
  }
};

export default RequestSystemDialog;
