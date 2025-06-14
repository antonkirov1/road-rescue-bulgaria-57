
import { ServiceType } from '@/components/service/types/serviceRequestState';

export interface ServiceRequestState {
  id: string;
  type: ServiceType;
  status: 'request_created' | 'request_accepted' | 'employee_assigned' | 'quote_received' | 'quote_accepted' | 'quote_declined' | 'in_progress' | 'completed' | 'cancelled' | 'pending' | 'accepted' | 'declined';
  userLocation: { lat: number; lng: number };
  blacklistedEmployees: string[];
  timestamp: string;
  assignedEmployee: Employee | null;
  currentQuote: Quote | null;
  declineCount: number;
  hasReceivedRevision: boolean;
  createdAt: string;
  updatedAt: string;
  assignedEmployeeName: string;
  priceQuote: number | null;
  employeeLocation?: { lat: number; lng: number };
  etaSeconds: number;
  message: string;
  isSubmitting: boolean;
  showRealTimeUpdate: boolean;
  showPriceQuote: boolean;
  declineReason: string;
  serviceFee?: number;
  hasDeclinedOnce?: boolean;
  isWaitingForRevision?: boolean;
  currentEmployeeName?: string;
  declinedEmployees?: string[];
}

export interface Employee {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  specialties: ServiceType[];
  rating: number;
  vehicleInfo: string;
  isAvailable: boolean;
}

export interface Quote {
  amount: number;
  employeeName: string;
  timestamp: string;
  isRevised?: boolean;
}

export interface EmployeeSimulationFunctions {
  loadEmployees: () => Promise<void>;
  getRandomEmployee: (blacklistedEmployees: string[]) => any;
}

export type ServiceRequestListener = (request: ServiceRequestState | null) => void;
