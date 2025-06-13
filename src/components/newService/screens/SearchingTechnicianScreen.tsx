
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface SearchingTechnicianScreenProps {
  request: ServiceRequest;
  onCancel: () => void;
}

const SearchingTechnicianScreen: React.FC<SearchingTechnicianScreenProps> = ({
  request,
  onCancel
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          {t(request.type)}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center py-8">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('finding-employee')}
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          {t('finding-employee')}
        </p>

        <Button 
          variant="outline" 
          onClick={onCancel}
          className="w-full"
        >
          {t('cancel')}
        </Button>
      </div>
    </>
  );
};

export default SearchingTechnicianScreen;
