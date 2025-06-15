
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clock, MapPin } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface RevisedQuoteScreenProps {
  request: ServiceRequest;
  onAccept: () => void;
  onCancel: () => void;
}

const RevisedQuoteScreen: React.FC<RevisedQuoteScreenProps> = ({
  request,
  onAccept,
  onCancel
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Revised Quote Received
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Technician Details</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{request.assignedEmployeeName || "Technician"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Estimated arrival: 15-20 minutes</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Service: {request.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="mb-2">
              <span className="text-sm text-gray-500 line-through">
                Original: {request.priceQuote} BGN
              </span>
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              {request.revisedPriceQuote} BGN
            </h3>
            <p className="text-sm text-blue-700">
              Revised service cost
            </p>
          </CardContent>
        </Card>

        <Button 
          onClick={onAccept}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Accept Revised Quote
        </Button>

        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="w-full text-red-600 hover:text-red-700"
          size="sm"
        >
          Cancel Request
        </Button>
      </div>
    </>
  );
};

export default RevisedQuoteScreen;
