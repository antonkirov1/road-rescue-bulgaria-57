
// New service request types based on the provided structure
export interface ServiceRequest {
  id: string;
  userId: string;
  type: 'Flat Tyre' | 'Out of Fuel' | 'Car Battery' | 'Other Car Problems' | 'Tow Truck';
  status: 'pending' | 'quote_sent' | 'quote_revised' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'declined';
  assignedEmployeeId?: string;
  priceQuote?: number;
  revisedPriceQuote?: number;
  declineCount: number;
  description?: string;
  userLocation: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  location: { lat: number; lng: number };
  banCount: number;
  bannedUntil?: Date;
}

export interface Employee {
  id: string;
  name: string;
  isSimulated: boolean;
  location: { lat: number; lng: number };
  isAvailable: boolean;
}

export interface PriceRanges {
  [key: string]: { min: number; max: number };
}

export type UIEvent = 
  | 'show_searching_technician'
  | 'show_price_quote_received'
  | 'show_revised_price_quote'
  | 'show_request_accepted'
  | 'show_request_started'
  | 'show_employee_en_route'
  | 'show_live_tracking'
  | 'show_service_completed'
  | 'show_no_technicians_available'
  | 'show_price_edit_notification';
