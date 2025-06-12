
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, Clock, User } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface RequestAcceptedScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const RequestAcceptedScreen: React.FC<RequestAcceptedScreenProps> = ({
  request,
  onClose
}) => {
  const getStatusMessage = () => {
    switch (request.status) {
      case 'accepted':
        return 'Quote accepted! Technician is preparing to come to your location.';
      case 'in_progress':
        return 'Technician has arrived and service is in progress.';
      default:
        return 'Your request has been accepted by a technician.';
    }
  };

  const getStatusIcon = () => {
    if (request.status === 'in_progress') {
      return <Clock className="h-8 w-8 text-blue-600" />;
    }
    return <CheckCircle className="h-8 w-8 text-green-600" />;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Request Status</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="text-center bg-green-50 rounded-lg p-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {request.status === 'in_progress' ? 'Service in Progress' : 'Request Accepted'}
          </h3>
          <p className="text-green-700">
            {getStatusMessage()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Technician: {request.assignedEmployeeId}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium">{request.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Agreed Price:</span>
              <span className="font-semibold text-green-600">
                {request.revisedPriceQuote || request.priceQuote} BGN
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize font-medium">{request.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {request.status === 'in_progress' && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Estimated completion time</span>
            </div>
            <p className="text-blue-600">5-15 minutes depending on the service</p>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </DialogFooter>
    </>
  );
};

export default RequestAcceptedScreen;
