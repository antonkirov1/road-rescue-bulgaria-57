
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ServiceRequestState } from '@/services/serviceRequest/types';

interface ServiceRequestDialogManagerProps {
  currentRequest: ServiceRequestState | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceRequestDialogManager: React.FC<ServiceRequestDialogManagerProps> = ({
  currentRequest,
  isOpen,
  onClose
}) => {
  if (!currentRequest || !isOpen) return null;

  const getDialogContent = () => {
    switch (currentRequest.status) {
      case 'request_accepted':
        return <div>Request accepted - finding technician...</div>;
      case 'quote_received':
        return (
          <div>
            <h3>Price Quote Received</h3>
            <p>Amount: {currentRequest.currentQuote?.amount} BGN</p>
            <p>From: {currentRequest.currentQuote?.employeeName}</p>
          </div>
        );
      case 'quote_declined':
        return <div>Quote declined - searching for alternatives...</div>;
      case 'quote_accepted':
      case 'in_progress':
        return <div>Service in progress...</div>;
      case 'completed':
        return <div>Service completed successfully!</div>;
      case 'cancelled':
        return <div>Request cancelled</div>;
      default:
        return <div>Processing request...</div>;
    }
  };

  const shouldShowDialog = () => {
    if (currentRequest.status === 'cancelled') return false;
    return true;
  };

  if (!shouldShowDialog()) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};
