
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DollarSign, User, TrendingDown } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface RevisedPriceQuoteScreenProps {
  request: ServiceRequest;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
}

const RevisedPriceQuoteScreen: React.FC<RevisedPriceQuoteScreenProps> = ({
  request,
  onAccept,
  onDecline,
  onCancel
}) => {
  const serviceFee = 5;
  const originalPrice = request.priceQuote || 0;
  const revisedPrice = request.revisedPriceQuote || 0;
  const totalPrice = revisedPrice + serviceFee;
  const savings = originalPrice - revisedPrice;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Revised Price Quote Received</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="text-center bg-blue-50 rounded-lg p-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <TrendingDown className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Better Price Offer!
          </h3>
          <p className="text-blue-700">
            The technician has revised their quote for your {request.type} service.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Technician: {request.assignedEmployeeId}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-gray-500 line-through">
              <span>Original Price:</span>
              <span>{originalPrice} BGN</span>
            </div>
            <div className="flex justify-between">
              <span>Revised Price:</span>
              <span className="font-semibold text-green-600">{revisedPrice} BGN</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee:</span>
              <span>+{serviceFee} BGN</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-green-600">{totalPrice} BGN</span>
            </div>
            {savings > 0 && (
              <div className="text-center text-green-600 font-medium">
                You save {savings} BGN!
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDecline} className="flex-1">
          Final Decline
        </Button>
        <Button onClick={onAccept} className="flex-1 bg-green-600 hover:bg-green-700">
          Accept
        </Button>
      </DialogFooter>
    </>
  );
};

export default RevisedPriceQuoteScreen;
