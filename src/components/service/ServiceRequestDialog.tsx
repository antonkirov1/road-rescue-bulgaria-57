
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
  onCancel?: () => void;
}

const ServiceRequestDialog: React.FC<ServiceRequestDialogProps> = ({
  type,
  open,
  onClose,
  showRealTimeUpdate,
  children,
  onCancel
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // If there's an onCancel handler and we're showing real-time updates, show cancel confirmation
      if (showRealTimeUpdate && onCancel) {
        onCancel();
      } else {
        onClose();
      }
    }
  };

  const handleInteractOutside = (e: Event) => {
    // If showing real-time updates, prevent closing and show cancel confirmation
    if (showRealTimeUpdate && onCancel) {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={handleInteractOutside}
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
