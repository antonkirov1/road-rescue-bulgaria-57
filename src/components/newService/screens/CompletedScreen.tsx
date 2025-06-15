
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, User, Clock } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface CompletedScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const CompletedScreen: React.FC<CompletedScreenProps> = ({
  request,
  onClose
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Service Completed
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Service completed successfully!
          </h3>
          <p className="text-sm text-gray-600">
            Your {request.type.toLowerCase()} service has been completed.
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Service Summary</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Technician: {request.assignedEmployeeName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Service: {request.type}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Total: {request.revisedPriceQuote || request.priceQuote} BGN</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Rate Service
        </Button>
      </div>
    </>
  );
};

export default CompletedScreen;
