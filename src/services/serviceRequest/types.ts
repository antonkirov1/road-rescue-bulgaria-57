
import { ServiceType } from '@/components/service/types/serviceRequestState';

export interface ServiceRequestState {
  id: string;
  type: ServiceType;
  userLocation: { lat: number; lng: number };
  status: 'request_accepted' | 'quote_received' | 'quote_declined' | 'quote_accepted' | 'in_progress' | 'completed' | 'cancelled';
  
  // Employee data
  assignedEmployee: {
    name: string;
    id: string;
    location?: { lat: number; lng: number };
  } | null;
  
  // Quote data
  currentQuote: {
    amount: number;
    employeeName: string;
    isRevised: boolean;
  } | null;
  
  // Tracking data
  declineCount: number;
  blacklistedEmployees: string[];
  hasReceivedRevision: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSimulationFunctions {
  loadEmployees: () => Promise<void>;
  getRandomEmployee: (blacklisted: string[]) => any;
}

export type ServiceRequestListener = (request: ServiceRequestState | null) => void;
