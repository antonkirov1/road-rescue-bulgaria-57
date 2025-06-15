
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, User, Clock } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import GoogleMap from '@/components/GoogleMap';

interface LiveTrackingScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  request,
  onClose
}) => {
  const { language, userLocation } = useApp();
  const t = useTranslation(language);

  // Simulated employee location (offset from userLocation)
  const employeeLat = userLocation.lat + 0.01;
  const employeeLng = userLocation.lng + 0.01;
  const employeeLocation = { lat: employeeLat, lng: employeeLng };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          {t('live-tracking')}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Live Map */}
        <div className="rounded-lg overflow-hidden border">
          <GoogleMap
            userLocation={userLocation}
            employeeLocation={employeeLocation}
            height="200px"
          />
        </div>

        <Card>
          <CardContent className="p-4">
            {request.assignedEmployeeName && (
              <>
                <h4 className="font-medium mb-3">{t('technician-info')}</h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{request.assignedEmployeeName}</span>
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

        {/* Map Legend */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium mb-2 text-sm">{t('map-legend')}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>{t('your-location')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{t('employee-location')}</span>
            </div>
          </div>
        </div>

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
