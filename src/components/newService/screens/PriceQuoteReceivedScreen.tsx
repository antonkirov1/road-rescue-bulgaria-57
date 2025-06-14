
import React, { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import PriceBreakdown from '../../service/price-quote/PriceBreakdown';
import CancelRequestWarningDialog from '../../service/CancelRequestWarningDialog';

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
  const { language } = useApp();
  const t = useTranslation(language);
  const [showCancelWarning, setShowCancelWarning] = useState(false);

  const employeeName = request.assignedEmployeeName || `Employee #${request.assignedEmployeeId}`;
  const serviceFee = 5;
  const totalPrice = (request.priceQuote || 0) + serviceFee;

  const handleCancelClick = () => {
    setShowCancelWarning(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelWarning(false);
    onCancel();
  };

  const handleCloseCancelWarning = () => {
    setShowCancelWarning(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('quote-received')}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <User className="h-4 w-4" />
              <span>{t('assigned-employee')}: {employeeName}</span>
            </div>

            <PriceBreakdown
              priceQuote={request.priceQuote || 0}
              serviceFee={serviceFee}
              totalPrice={totalPrice}
            />
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button 
            onClick={onAccept}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t('confirm')} - {totalPrice.toFixed(2)} BGN
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
            onClick={handleCancelClick}
            className="w-full text-red-600 hover:text-red-700"
          >
            {t('cancel')}
          </Button>
        </div>
      </div>

      <CancelRequestWarningDialog
        open={showCancelWarning}
        onClose={handleCloseCancelWarning}
        onConfirmCancel={handleConfirmCancel}
      />
    </>
  );
};

export default PriceQuoteReceivedScreen;
