import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCheck, MapPin, Phone, XCircle } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent } from '@/components/ui/card';

interface NewUIEventHandlerProps {
  currentScreen: string;
  request: ServiceRequest | null;
  onAcceptQuote: () => void;
  onDeclineQuote: () => void;
  onCancelRequest: () => void;
  onClose: () => void;
  onLiveTracking?: () => void; // OPTIONAL: allow simulation system to open modal
}

const NewUIEventHandler: React.FC<NewUIEventHandlerProps> = ({
  currentScreen,
  request,
  onAcceptQuote,
  onDeclineQuote,
  onCancelRequest,
  onClose,
  onLiveTracking, // <- receive prop
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  if (!request) {
    return <div>{t('no-request-available')}</div>;
  }

  if (currentScreen === 'request_received') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('request-received')}</h2>
        <p>{t('request-description')}: {request.description}</p>
        <p>{t('service-type')}: {request.type}</p>
        <Button onClick={onCancelRequest} variant="destructive" className="w-full">
          <XCircle className="w-4 h-4 mr-2" />
          {t('cancel-request')}
        </Button>
      </div>
    );
  }

  if (currentScreen === 'quote_received') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('quote-received')}</h2>
        <p>{t('price-quote')}: ${request.priceQuote}</p>
        <div className="flex gap-2">
          <Button onClick={onAcceptQuote} className="w-full">
            <CheckCheck className="w-4 h-4 mr-2" />
            {t('accept-quote')}
          </Button>
          <Button onClick={onDeclineQuote} variant="outline" className="w-full">
            {t('decline-quote')}
          </Button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quote_revised') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('quote-revised')}</h2>
        <p>{t('revised-price-quote')}: ${request.revisedPriceQuote}</p>
        <div className="flex gap-2">
          <Button onClick={onAcceptQuote} className="w-full">
            <CheckCheck className="w-4 h-4 mr-2" />
            {t('accept-revised-quote')}
          </Button>
          <Button onClick={onDeclineQuote} variant="outline" className="w-full">
            {t('decline-quote')}
          </Button>
        </div>
      </div>
    );
  }

  // Render for "employee_assigned" screen (SIMULATION) with full live tracking feature
  if (currentScreen === 'employee_assigned' && request) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">{t('technician-info')}</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{t('eta')}: 5-10 {t('minutes')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">2.3 {t('km-away')}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { window.location.href = 'tel:+359888123456' }}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" onClick={onLiveTracking}>
                <MapPin className="w-4 h-4 mr-2" />
                Track
              </Button>
            </div>
          </CardContent>
        </Card>
        <Button onClick={onClose} variant="outline" className="w-full">
          {t('close')}
        </Button>
      </div>
    );
  }

  if (currentScreen === 'live_tracking') {
    return (
      <div className="space-y-4">
        <h2>{t('live-tracking')}</h2>
        <p>{t('technician-on-the-way')}</p>
        <Button onClick={onClose} variant="outline" className="w-full">
          {t('close')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2>{t('unknown-screen')}</h2>
      <p>{t('current-screen')}: {currentScreen}</p>
    </div>
  );
};

export default NewUIEventHandler;
