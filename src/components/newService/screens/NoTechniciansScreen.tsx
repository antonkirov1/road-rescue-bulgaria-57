
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Phone } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface NoTechniciansScreenProps {
  onClose: () => void;
}

const NoTechniciansScreen: React.FC<NoTechniciansScreenProps> = ({ onClose }) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          {t('service-unavailable')}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('service-unavailable')}
          </h3>
          <p className="text-gray-600 text-center">
            {t('no-technicians-available-message')}
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">{t('contact-support')}</h4>
            <p className="text-sm text-gray-600 mb-3">
              {t('contact-support-message')}
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = 'tel:+359888123456'}
            >
              <Phone className="h-4 w-4 mr-2" />
              {t('call')} +359 888 123 456
            </Button>
          </CardContent>
        </Card>

        <Button 
          variant="outline" 
          onClick={onClose}
          className="w-full"
        >
          {t('close')}
        </Button>
      </div>
    </>
  );
};

export default NoTechniciansScreen;
