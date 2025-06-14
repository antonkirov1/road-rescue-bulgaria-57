import { ServiceType } from '@/components/service/types/serviceRequestState';

export interface ServiceRequestState {
  id: string;
  type: ServiceType;
  status: 'request_created' | 'request_accepted' | 'employee_assigned' | 'quote_received' | 'quote_accepted' | 'quote_declined' | 'in_progress' | 'completed' | 'cancelled';
  userLocation: { lat: number; lng: number };
  blacklistedEmployees: string[];
  timestamp: string;
  assignedEmployee: Employee | null;
  currentQuote: Quote | null;
  declineCount: number;
  hasReceivedRevision: boolean;
}

export interface Employee {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  specialties: ServiceType[];
  rating: number;
  vehicleInfo: string;
}

export interface Quote {
  amount: number;
  employeeName: string;
  timestamp: string;
  isRevised?: boolean;
}

export interface EmployeeSimulationFunctions {
  simulateEmployeeResponse: (
    requestId: string,
    timestamp: string,
    serviceType: ServiceType,
    userLocation: { lat: number; lng: number },
    onQuoteReceived: (quote: number) => void,
    setShowPriceQuote: (show: boolean) => void,
    setShowRealTimeUpdate: (show: boolean) => void,
    onStatusUpdate: (status: 'pending' | 'accepted' | 'declined') => void,
    setDeclineReason: (reason: string) => void,
    onEmployeeLocationUpdate: (location: { lat: number; lng: number } | undefined) => void,
    onEmployeeAssigned: (employeeName: string) => void,
    blacklistedEmployees: string[]
  ) => void;
  handleAccept: (
    requestId: string,
    finalPrice: number,
    employeeName: string,
    username: string,
    userLocation: { lat: number; lng: number },
    employeeLocation: { lat: number; lng: number },
    estimatedEta: number,
    serviceType: ServiceType,
    onEtaUpdate: (remaining: number) => void,
    onLocationUpdate: (location: { lat: number; lng: number }) => void,
    onComplete: () => void
  ) => Promise<void>;
  addEmployeeToBlacklist: (requestId: string, employeeName: string, username: string) => Promise<void>;
}

export type ServiceRequestListener = (request: ServiceRequestState | null) => void;
