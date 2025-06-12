
import React, { memo } from 'react';
import ServiceCard from '@/components/service/ServiceCard';
import { ServiceRequest } from '@/types/newServiceRequest';
import { ServiceType as ServiceCardType } from '@/components/service/serviceIcons';

type ServiceType = ServiceRequest['type'] | 'emergency' | 'support';

interface DashboardServicesProps {
  onServiceSelect: (service: ServiceType) => void;
}

const services: ServiceType[] = [
  'Flat Tyre',
  'Out of Fuel', 
  'Car Battery',
  'Other Car Problems',
  'Tow Truck',
  'support'
];

const DashboardServices: React.FC<DashboardServicesProps> = memo(({ onServiceSelect }) => {
  // Map new service types to old service types for ServiceCard display
  const getServiceCardType = (service: ServiceType): ServiceCardType => {
    switch (service) {
      case 'Flat Tyre':
        return 'flat-tyre';
      case 'Out of Fuel':
        return 'out-of-fuel';
      case 'Car Battery':
        return 'car-battery';
      case 'Other Car Problems':
        return 'other-car-problems';
      case 'Tow Truck':
        return 'tow-truck';
      case 'support':
        return 'support';
      default:
        return 'other-car-problems';
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {services.map((service) => (
          <ServiceCard 
            key={service}
            type={getServiceCardType(service)} 
            onClick={() => onServiceSelect(service)} 
          />
        ))}
      </div>
    </div>
  );
});

DashboardServices.displayName = 'DashboardServices';

export default DashboardServices;
