
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, DollarSign, User } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface CurrentRequestCardProps {
  currentRequest: ServiceRequest;
  onCompleteService: () => void;
  getServiceTypeDisplay: (type: ServiceRequest['type']) => string;
  t: (key: string) => string;
}

const CurrentRequestCard: React.FC<CurrentRequestCardProps> = ({
  currentRequest,
  onCompleteService,
  getServiceTypeDisplay,
  t
}) => {
  return (
    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
      <CardHeader>
        <CardTitle className="text-green-800 dark:text-green-200">
          {t('current-service-request')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-medium">{t('customer-id')}:</span>
          <span>{currentRequest.userId}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{t('service-type')}:</span>
          <span>{getServiceTypeDisplay(currentRequest.type)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">{t('location')}:</span>
          <span>Sofia, Bulgaria</span>
        </div>
        {currentRequest.priceQuote && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{t('quote')}:</span>
            <span>{currentRequest.priceQuote} BGN</span>
          </div>
        )}
        <div className="pt-4">
          <Button 
            onClick={onCompleteService}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t('complete-service')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentRequestCard;
