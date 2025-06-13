
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, User, Clock } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface LiveTrackingScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  request,
  onClose
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          {t('live-tracking')}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <p className="text-center text-sm text-blue-800 mt-2">
                {t('live-tracking')}
              </p>
            </div>

            {request.assignedEmployeeId && (
              <>
                <h4 className="font-medium mb-3">{t('technician-info')}</h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{request.assignedEmployeeId}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{t('eta')}: 5-10 {t('minutes')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">2.3 {t('km-away')}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'tel:+359888123456'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t('call-employee')}
                </Button>
              </>
            )}
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

export default LiveTrackingScreen;
