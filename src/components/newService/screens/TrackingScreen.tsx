
import React, { useState, useEffect } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ServiceRequest } from '@/types/newServiceRequest';
import { MapPin, Clock, User, Minimize2 } from 'lucide-react';

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
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-complete when timer reaches 0
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
      
      setProgress(prev => Math.min(100, prev + (100 / 300))); // Progress increases over 5 minutes
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
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

      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {request.assignedEmployeeName || 'Your Technician'} is on the way!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Your service request has been accepted and the technician is heading to your location.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Service Type:</span>
            <span className="text-sm text-gray-900">{request.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Price Quote:</span>
            <span className="text-sm text-gray-900">${request.priceQuote}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              ETA:
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {timeRemaining <= 0 && (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-3">
              ✅ Service completed!
            </p>
            <Button 
              onClick={onComplete}
              className="w-full"
            >
              Mark as Complete
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackingScreen;
