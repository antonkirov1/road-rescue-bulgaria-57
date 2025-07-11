
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Car, Minimize2 } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface TrackingScreenProps {
  request: ServiceRequest;
  onComplete: () => void;
  onMinimize?: () => void;
}

const TrackingScreen: React.FC<TrackingScreenProps> = ({
  request,
  onComplete,
  onMinimize
}) => {
  // Simulate completion after 3 seconds
  React.useEffect(() => {
    console.log('TrackingScreen mounted, setting completion timer');
    const timer = setTimeout(() => {
      console.log('TrackingScreen timer expired, calling onComplete');
      onComplete();
    }, 3000);

    return () => {
      console.log('TrackingScreen unmounted, clearing timer');
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            Technician En Route
          </DialogTitle>
          {onMinimize && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMinimize}
              className="h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogHeader>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Live Tracking</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Technician is on the way</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">ETA: 5-10 minutes</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{request.assignedEmployeeName || "Technician"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Service in Progress</span>
          </div>
          <p className="text-sm text-blue-700">
            Your technician is currently traveling to your location. You can track their progress in real-time.
          </p>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = 'tel:+359888123456'}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Technician
        </Button>
      </div>
    </>
  );
};

export default TrackingScreen;
