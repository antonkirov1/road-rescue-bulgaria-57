
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle, Clock } from 'lucide-react';

interface NoTechniciansScreenProps {
  onClose: () => void;
}

const NoTechniciansScreen: React.FC<NoTechniciansScreenProps> = ({
  onClose
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Service Unavailable</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="text-center bg-orange-50 rounded-lg p-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            No Technicians Available
          </h3>
          <p className="text-orange-700">
            All our technicians are currently busy with other requests.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">What you can do:</span>
          </div>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Try again in a few minutes</li>
            <li>• Check if your location is in our service area</li>
            <li>• Contact our support team for assistance</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Need immediate help?</h4>
          <p className="text-sm text-gray-600 mb-3">
            For emergency situations, please contact emergency services directly.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Emergency: 112
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Support
            </Button>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </DialogFooter>
    </>
  );
};

export default NoTechniciansScreen;
