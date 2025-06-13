
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, User, RefreshCw } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

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
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          {t('quote-received')} - {t('updated')}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            {t('revised-quote-message')}
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">{t('quoted-price')}</h3>
                <p className="text-2xl font-bold text-green-600">
                  {request.currentQuote?.amount} BGN
                </p>
              </div>
            </div>

            {request.assignedEmployee && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{t('assigned-employee')}: {request.assignedEmployee.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button 
            onClick={onAccept}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t('confirm')} - {request.currentQuote?.amount} BGN
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="w-full"
          >
            {t('decline')}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="w-full text-red-600 hover:text-red-700"
          >
            {t('cancel')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RevisedPriceQuoteScreen;
