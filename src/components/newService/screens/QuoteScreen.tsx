
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clock, MapPin, Minimize2 } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface QuoteScreenProps {
  request: ServiceRequest;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onMinimize?: () => void;
}

const QuoteScreen: React.FC<QuoteScreenProps> = ({
  request,
  onAccept,
  onDecline,
  onCancel,
  onMinimize
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>
            Price Quote Received
          </DialogTitle>
          {onMinimize && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMinimize}
              className="h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
        </div>
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

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              {request.priceQuote} BGN
            </h3>
            <p className="text-sm text-green-700">
              Total service cost
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="flex-1"
          >
            Decline
          </Button>
          
          <Button 
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Accept Quote
          </Button>
        </div>

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

export default QuoteScreen;
