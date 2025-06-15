
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface CancelledScreenProps {
  onClose: () => void;
}

const CancelledScreen: React.FC<CancelledScreenProps> = ({ onClose }) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-600" />
          Request Cancelled
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Request Cancelled
          </h3>
          <p className="text-sm text-gray-600">
            Your service request has been cancelled. No charges have been applied.
          </p>
        </div>

        <Button 
          onClick={onClose}
          className="w-full"
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default CancelledScreen;
