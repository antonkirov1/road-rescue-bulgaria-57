
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, Star, ThumbsUp } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface ServiceCompletedScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const ServiceCompletedScreen: React.FC<ServiceCompletedScreenProps> = ({
  request,
  onClose
}) => {
  const finalPrice = request.revisedPriceQuote || request.priceQuote || 0;
  const serviceFee = 5;
  const totalPaid = finalPrice + serviceFee;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Service Completed</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="text-center bg-green-50 rounded-lg p-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Service Completed!
          </h3>
          <p className="text-green-700">
            Your {request.type} service has been successfully completed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Service Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium">{request.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Technician:</span>
              <span>{request.assignedEmployeeId}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Price:</span>
              <span>{finalPrice} BGN</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee:</span>
              <span>{serviceFee} BGN</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Paid:</span>
              <span className="text-green-600">{totalPaid} BGN</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Thank you for using RoadSaver!</span>
          </div>
          <p className="text-blue-700 text-sm mb-3">
            We hope you had a great experience with our service.
          </p>
          
          <div className="flex items-center gap-1">
            <span className="text-sm text-blue-700">Rate your experience:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 text-yellow-400 fill-current cursor-pointer hover:text-yellow-500"
              />
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
          Done
        </Button>
      </DialogFooter>
    </>
  );
};

export default ServiceCompletedScreen;
