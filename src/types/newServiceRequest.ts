
export type ServiceRequestStatus =
  | "searching"
  | "no_technician"
  | "quote_received"
  | "revised_quote"
  | "live_tracking"
  | "completed"
  | "rate_employee"
  | "cancelled";

export interface ServiceRequest {
  id: string;
  type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck";
  status: ServiceRequestStatus;
  userLocation: { lat: number; lng: number };
  userId: string;
  description?: string;
  priceQuote?: number;
  revisedPriceQuote?: number;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  previousEmployeeName?: string;
  declineCount: number;
  createdAt: Date;
  updatedAt: Date;
  technicianEta?: number;
  rating?: number;
}
