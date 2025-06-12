
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DollarSign, User, Info } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { toast } from '@/components/ui/use-toast';

interface PriceQuoteReceivedScreenProps {
  request: ServiceRequest;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
}

const PriceQuoteReceivedScreen: React.FC<PriceQuoteReceivedScreenProps> = ({
  request,
  onAccept,
  onDecline,
  onCancel
}) => {
  const serviceFee = 5;
  const totalPrice = (request.priceQuote || 0) + serviceFee;

  const handleInfoClick = () => {
    toast({
      title: "Service Fee Information",
      description: "A small fee for maintaining the app and platform services."
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Price Quote Received</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="text-center bg-green-50 rounded-lg p-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Quote Received!
          </h3>
          <p className="text-green-700">
            A technician is ready to help with your {request.type} service.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Technician: {request.assignedEmployeeId}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service Price:</span>
              <span className="font-semibold">{request.priceQuote} BGN</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span>Service Fee:</span>
                <button onClick={handleInfoClick} className="p-1">
                  <Info className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <span>+{serviceFee} BGN</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-green-600">{totalPrice} BGN</span>
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button variant="outline" onClick={onDecline} className="flex-1">
          Decline
        </Button>
        <Button onClick={onAccept} className="flex-1 bg-green-600 hover:bg-green-700">
          Accept
        </Button>
      </DialogFooter>
    </>
  );
};

export default PriceQuoteReceivedScreen;
