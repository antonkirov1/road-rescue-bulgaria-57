
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import GoogleMap from '@/components/GoogleMap';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface ServiceRequestFormProps {
  type: 'flat-tyre' | 'out-of-fuel' | 'other-car-problems' | 'tow-truck' | 'emergency' | 'support' | 'car-battery';
  message: string;
  onMessageChange: (message: string) => void;
  userLocation: { lat: number; lng: number };
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  type,
  message,
  onMessageChange,
  userLocation,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  
  const requiresDescription = type === 'other-car-problems';
  const messageMinLength = requiresDescription ? 20 : 0;
  const messageMaxLength = 300;

  // Get default message for the service type from translations
  const getDefaultMessage = (serviceType: string) => {
    switch (serviceType) {
      case 'flat-tyre':
        return t('I have a flat tyre and need assistance');
      case 'out-of-fuel':
        return t('I am out of fuel and need assistance');
      case 'car-battery':
        return t('My car battery is dead. I need assistance.');
      case 'tow-truck':
        return t('I have a major problem with my car and need a tow truck');
      case 'emergency':
        return t('I need emergency assistance immediately');
      case 'support':
        return t('I need to speak with customer support');
      default:
        return '';
    }
  };

  return (
    <>
      {requiresDescription && (
        <div className="space-y-2">
          <Textarea
            placeholder={t('Describe your issue (20-300 characters)')}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="min-h-[100px]"
          />
          <p className={`text-xs ${message.length < messageMinLength || message.length > messageMaxLength ? 'text-red-500' : 'text-muted-foreground'}`}>
            {message.length}/{messageMaxLength} {t('characters')}
          </p>
        </div>
      )}
      
      <GoogleMap userLocation={userLocation} height="200px" />
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>{t('cancel')}</Button>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting || (requiresDescription && (message.length < messageMinLength || message.length > messageMaxLength))}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? t('Sending...') : t('Send Request')}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ServiceRequestForm;
