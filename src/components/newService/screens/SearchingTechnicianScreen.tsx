
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Clock, Search } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface SearchingTechnicianScreenProps {
  request: ServiceRequest;
  onCancel: () => void;
}

const SearchingTechnicianScreen: React.FC<SearchingTechnicianScreenProps> = ({
  request,
  onCancel
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Searching for Technician</DialogTitle>
      </DialogHeader>
      
      <div className="text-center py-8">
        <div className="relative mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Clock className="h-6 w-6 text-orange-500 animate-spin" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Finding Available Technician</h2>
        <p className="text-gray-600 mb-4">
          We're searching for the nearest available technician for your {request.type} service.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-blue-700 mt-2">This usually takes 30-60 seconds</p>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel Request
        </Button>
      </DialogFooter>
    </>
  );
};

export default SearchingTechnicianScreen;
