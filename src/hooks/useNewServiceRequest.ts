
import { useState } from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';

export const useNewServiceRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRequest['type'] | null>(null);

  const openServiceRequest = (serviceType: ServiceRequest['type']) => {
    setSelectedService(serviceType);
    setIsOpen(true);
  };

  const closeServiceRequest = () => {
    setIsOpen(false);
    setSelectedService(null);
  };

  return {
    isOpen,
    selectedService,
    openServiceRequest,
    closeServiceRequest
  };
};
