
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Star, DollarSign } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface ServiceCompletedScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const ServiceCompletedScreen: React.FC<ServiceCompletedScreenProps> = ({
  request,
  onClose
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          {t('completed')}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('completed')}!
          </h3>
          <p className="text-gray-600">
            {t('service-description')} {t('completed').toLowerCase()}
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">{t('total-price')}</span>
              <span className="text-lg font-semibold text-green-600">
                {request.priceQuote} BGN
              </span>
            </div>
            
            {request.assignedEmployeeId && (
              <div className="text-sm text-gray-600">
                {t('assigned-employee')}: Employee #{request.assignedEmployeeId}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">{t('rate-service')}:</p>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-6 w-6 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform"
              />
            ))}
          </div>
        </div>

        <Button 
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {t('finish')}
        </Button>
      </div>
    </>
  );
};

export default ServiceCompletedScreen;
