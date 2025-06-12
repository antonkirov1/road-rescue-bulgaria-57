
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import GoogleMap from '@/components/GoogleMap';

interface LiveTrackingScreenProps {
  request: ServiceRequest;
  onClose: () => void;
}

const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  request,
  onClose
}) => {
  const [eta, setEta] = useState(15);
  const [employeeLocation, setEmployeeLocation] = useState({
    lat: 42.6977 + 0.001,
    lng: 23.3219 + 0.001
  });

  useEffect(() => {
    // Simulate employee movement towards user
    const interval = setInterval(() => {
      setEmployeeLocation(prev => ({
        lat: prev.lat + (request.userLocation.lat - prev.lat) * 0.1,
        lng: prev.lng + (request.userLocation.lng - prev.lng) * 0.1
      }));

      setEta(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [request.userLocation]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Live Tracking</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="text-center bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Technician En Route</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">ETA: {eta > 0 ? `${eta} seconds` : 'Arriving now'}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Live Location
          </h4>
          <div className="rounded-lg overflow-hidden">
            <GoogleMap
              userLocation={request.userLocation}
              employeeLocation={employeeLocation}
              height="200px"
            />
          </div>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Your location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Technician location</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Service Details</h4>
          <div className="space-y-1 text-sm text-green-700">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{request.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Technician:</span>
              <span>{request.assignedEmployeeId}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span>{request.revisedPriceQuote || request.priceQuote} BGN</span>
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose} className="w-full">
          Close Tracking
        </Button>
      </DialogFooter>
    </>
  );
};

export default LiveTrackingScreen;
