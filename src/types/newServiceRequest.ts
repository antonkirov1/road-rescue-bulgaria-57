
export interface ServiceRequest {
  id: string;
  type: 'Flat Tyre' | 'Out of Fuel' | 'Car Battery' | 'Other Car Problems' | 'Tow Truck';
  status: 'pending' | 'quote_sent' | 'quote_revised' | 'quote_declined' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  userLocation: {
    lat: number;
    lng: number;
  };
  userId: string;
  description?: string;
  priceQuote?: number;
  revisedPriceQuote?: number;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  declineCount: number;
  createdAt: Date;
  updatedAt: Date;
}
