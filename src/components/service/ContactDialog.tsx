
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactDialogIcons } from './serviceIcons';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailContact: () => void;
  onPhoneContact: () => void;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onOpenChange,
  onEmailContact,
  onPhoneContact
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>{t('Contact Options')}</DialogTitle>
          <DialogDescription>
            {t('How would you like to contact our support team?')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button 
            onClick={onEmailContact}
            className="w-full justify-start bg-green-600 hover:bg-green-700"
          >
            {ContactDialogIcons.email}
            {t('Write an Email')}
          </Button>
          <Button 
            onClick={onPhoneContact}
            variant="outline"
            className="w-full justify-start"
          >
            {ContactDialogIcons.phone}
            {t('Give us a Call')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
