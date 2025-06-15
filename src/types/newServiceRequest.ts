
export type ServiceRequestStatus = "searching" | "quote_received" | "live_tracking" | "completed" | "cancelled";
export interface ServiceRequest {
  id: string;
  type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck";
  status: ServiceRequestStatus | string;
  userLocation: { lat: number; lng: number };
  userId: string;
  description?: string;
  priceQuote?: number;
  assignedEmployeeName?: string;
  declineCount: number;
  createdAt: Date;
  updatedAt: Date;
}
