import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, User, Phone, MapPin, Clock } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface RequestAcceptedScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const RequestAcceptedScreen: React.FC<RequestAcceptedScreenProps> = ({
  request,
  onClose
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  const getStatusMessage = () => {
    switch (request.status) {
      case 'live_tracking':
        return request.assignedEmployeeName ? t('employee-assigned') : t('finding-employee');
      case 'completed':
        return t('employee-on-way');
      default:
        return t('request-accepted');
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          {t('request-accepted')}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getStatusMessage()}
          </h3>
        </div>

        {request.assignedEmployeeName && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">{t('your-technician')}</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{request.assignedEmployeeName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{t('arrive-in')} 15-20 {t('minutes')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{t('live-tracking')}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => window.location.href = 'tel:+359888123456'}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  {t('call')}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {t('track')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

export default RequestAcceptedScreen;
