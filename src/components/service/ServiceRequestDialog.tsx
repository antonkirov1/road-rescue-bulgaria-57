
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from '@/utils/translations';
import { useApp } from '@/contexts/AppContext';

interface ServiceRequestDialogProps {
  type: string;
  open: boolean;
  onClose: () => void;
  showRealTimeUpdate: boolean;
  children: React.ReactNode;
}

const ServiceRequestDialog: React.FC<ServiceRequestDialogProps> = ({
  type,
  open,
  onClose,
  showRealTimeUpdate,
  children
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  // Simple close handler that only closes the dialog
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={(e) => {
          // Allow backdrop clicks to close the dialog normally
          console.log('ServiceRequestDialog - Backdrop click, closing dialog');
        }}
      >
        <DialogHeader>
          <DialogTitle className={showRealTimeUpdate ? "sr-only" : ""}>
            {t(type)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestDialog;
