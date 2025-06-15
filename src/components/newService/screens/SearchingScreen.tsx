
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface SearchingScreenProps {
  onCancel: () => void;
}

const SearchingScreen: React.FC<SearchingScreenProps> = ({ onCancel }) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Searching for Technician
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Finding the best technician for you...
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we locate available technicians in your area.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={onCancel}
          className="w-full"
        >
          Cancel Request
        </Button>
      </div>
    </>
  );
};

export default SearchingScreen;
