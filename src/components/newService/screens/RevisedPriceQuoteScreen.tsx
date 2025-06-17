
import React, { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, RefreshCw } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import PriceBreakdown from '../../service/price-quote/PriceBreakdown';
import CancelRequestWarningDialog from '../../service/CancelRequestWarningDialog';

interface RevisedPriceQuoteScreenProps {
  request: ServiceRequest;
  onAccept: () => void;
  onDecline: () => void;
  onFinalDecline: () => void;
  onCancel: () => void;
}

const RevisedPriceQuoteScreen: React.FC<RevisedPriceQuoteScreenProps> = ({
  request,
  onAccept,
  onDecline,
  onFinalDecline,
  onCancel
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  const [showCancelWarning, setShowCancelWarning] = useState(false);

  // Use assignedEmployeeName if available, otherwise fall back to a generic display
  const employeeName = request.assignedEmployeeName || 'Assigned Technician';
  const revisedPrice = request.revisedPriceQuote || request.priceQuote || 0;
  const serviceFee = 5;
  const totalPrice = revisedPrice + serviceFee;

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
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <User className="h-4 w-4" />
              <span>{t('assigned-employee')}: {employeeName}</span>
            </div>

            <PriceBreakdown
              priceQuote={revisedPrice}
              serviceFee={serviceFee}
              totalPrice={totalPrice}
            />

            {request.priceQuote && revisedPrice !== request.priceQuote && (
              <p className="text-sm text-gray-500 line-through mt-2">
                Original: {request.priceQuote} BGN + {serviceFee} BGN = {(request.priceQuote + serviceFee).toFixed(2)} BGN
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button 
            onClick={onAccept}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Accept Revised Quote - {totalPrice.toFixed(2)} BGN
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onFinalDecline}
            className="w-full border-red-500 text-red-600 hover:bg-red-50"
          >
            Final decline
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

export default RevisedPriceQuoteScreen;
