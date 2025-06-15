
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface NoTechnicianScreenProps {
  onOk: () => void;
}

const NoTechnicianScreen: React.FC<NoTechnicianScreenProps> = ({ onOk }) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          No Technician Available
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sorry, no technicians available
          </h3>
          <p className="text-sm text-gray-600">
            Unfortunately, there are no technicians available in your area at the moment. Please try again later.
          </p>
        </div>

        <Button 
          onClick={onOk}
          className="w-full"
        >
          OK
        </Button>
      </div>
    </>
  );
};

export default NoTechnicianScreen;
