
import React from "react";
import { useServiceRequestFlow } from "./hooks/useServiceRequestFlow";
import SearchingScreen from "./screens/SearchingScreen";
import QuoteScreen from "./screens/QuoteScreen";
import TrackingScreen from "./screens/TrackingScreen";
import CompletedScreen from "./screens/CompletedScreen";
import CancelledScreen from "./screens/CancelledScreen";

interface Props {
  open: boolean;
  type: string;
  onClose: () => void;
  userId: string;
}

const RequestSystemDialog: React.FC<Props> = ({ open, type, onClose, userId }) => {
  const {
    step,
    request,
    createRequest,
    acceptQuote,
    declineQuote,
    cancelRequest,
    closeAll,
  } = useServiceRequestFlow();

  React.useEffect(() => {
    if (open && !request) createRequest(type, `Service for ${type}`);
    if (!open) closeAll();
  }, [open]);

  if (!open || !step) return null;

  switch (step) {
    case "searching":
      return <SearchingScreen onCancel={cancelRequest} />;
    case "quote_received":
      return <QuoteScreen request={request!} onAccept={acceptQuote} onDecline={declineQuote} onCancel={cancelRequest} />;
    case "live_tracking":
      return <TrackingScreen request={request!} onComplete={closeAll} />;
    case "completed":
      return <CompletedScreen request={request!} onClose={closeAll} />;
    case "cancelled":
      return <CancelledScreen onClose={closeAll} />;
    default:
      return null;
  }
};

export default RequestSystemDialog;
