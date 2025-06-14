
export interface ServiceRequestState {
  id: string;
  type: ServiceType;
  userLocation: { lat: number; lng: number };
  blacklistedEmployees: string[];
  timestamp: string;
  priceQuote: number | null;
  assignedEmployeeName: string;
  employeeLocation?: { lat: number; lng: number };
  etaSeconds: number;
  message: string;
  isSubmitting: boolean;
  showRealTimeUpdate: boolean;
  showPriceQuote: boolean;
  status: 'pending' | 'accepted' | 'declined';
  declineReason: string;
  serviceFee?: number;
  hasDeclinedOnce?: boolean;
  isWaitingForRevision?: boolean;
  currentEmployeeName?: string;
  declinedEmployees?: string[];
}

export type ServiceType = 'flat-tyre' | 'out-of-fuel' | 'other-car-problems' | 'tow-truck' | 'emergency' | 'support' | 'car-battery';
