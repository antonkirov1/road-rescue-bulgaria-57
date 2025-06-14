
import { toast } from "@/components/ui/use-toast";
import { UserHistoryService } from '@/services/userHistoryService';
import { SimulatedEmployeeBlacklistService } from '@/services/simulatedEmployeeBlacklistService';
import { ServiceRequestState } from './types';

export class RequestLifecycleManager {
  static async recordCompletion(request: ServiceRequestState): Promise<void> {
    if (!request.assignedEmployee || !request.currentQuote) return;
    
    try {
      await UserHistoryService.addHistoryEntry({
        user_id: 'current_user', // This should be actual user ID
        username: 'current_user',
        service_type: request.type,
        status: 'completed',
        employee_name: request.assignedEmployee.name,
        price_paid: request.currentQuote.amount,
        service_fee: 5,
        total_price: request.currentQuote.amount + 5,
        request_date: request.createdAt,
        completion_date: new Date().toISOString(),
        address_street: 'Sofia Center, Bulgaria',
        latitude: request.userLocation.lat,
        longitude: request.userLocation.lng
      });
    } catch (error) {
      console.error('Error recording completion:', error);
    }
  }

  static async cleanupCancelledRequest(requestId: string): Promise<void> {
    try {
      await SimulatedEmployeeBlacklistService.clearBlacklistForRequest(requestId);
    } catch (error) {
      console.error('Error cleaning up cancelled request:', error);
    }
  }

  static createRequest(
    id: string,
    type: ServiceRequestState['type'],
    userLocation: { lat: number; lng: number }
  ): ServiceRequestState {
    return {
      id,
      type,
      userLocation,
      status: 'request_accepted',
      assignedEmployee: null,
      currentQuote: null,
      declineCount: 0,
      blacklistedEmployees: [],
      hasReceivedRevision: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      assignedEmployeeName: '',
      priceQuote: null,
      etaSeconds: 0,
      message: '',
      isSubmitting: false,
      showRealTimeUpdate: false,
      showPriceQuote: false,
      declineReason: '',
      serviceFee: 5,
      hasDeclinedOnce: false,
      isWaitingForRevision: false,
      currentEmployeeName: '',
      declinedEmployees: [],
      employeeLocation: undefined
    };
  }

  static updateRequestTimestamp(request: ServiceRequestState): void {
    request.updatedAt = new Date().toISOString();
  }
}
