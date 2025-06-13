
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface ExitConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const ExitConfirmDialog: React.FC<ExitConfirmDialogProps> = ({
  open,
  onClose,
  onLogout
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('Do you want to exit?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('If you do, press the Log Out button.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            {t('Log Out')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitConfirmDialog;
