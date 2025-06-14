
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface CancelRequestWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

const CancelRequestWarningDialog: React.FC<CancelRequestWarningDialogProps> = ({
  open,
  onClose,
  onConfirmCancel
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <AlertDialogTitle className="text-xl">
            Are you sure you want to cancel your request?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Your card will still be charged with the service fee.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            No, don't cancel my request.
          </Button>
          <Button
            onClick={onConfirmCancel}
            variant="destructive"
            className="w-full"
          >
            Yes, cancel and pay the service fee.
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelRequestWarningDialog;
