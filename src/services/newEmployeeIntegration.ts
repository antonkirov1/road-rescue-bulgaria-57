
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { ServiceRequest } from '@/types/newServiceRequest';

export interface EmployeeResponse {
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

class EmployeeIntegrationService {
  async findAvailableEmployee(
    request: ServiceRequest, 
    blacklistedEmployees: string[] = []
  ): Promise<EmployeeResponse | null> {
    // Simulate finding an available employee
    const mockEmployees: EmployeeResponse[] = [
      {
        id: '1',
        name: 'John Smith',
        location: { lat: request.userLocation.lat + 0.01, lng: request.userLocation.lng + 0.01 },
        specialties: [request.type as ServiceType],
        rating: 4.8,
        vehicleInfo: 'White Van - ABC123',
        isAvailable: true
      },
      {
        id: '2', 
        name: 'Maria Garcia',
        location: { lat: request.userLocation.lat - 0.01, lng: request.userLocation.lng - 0.01 },
        specialties: [request.type as ServiceType],
        rating: 4.9,
        vehicleInfo: 'Blue Truck - XYZ789',
        isAvailable: true
      }
    ];

    const availableEmployees = mockEmployees.filter(emp => 
      !blacklistedEmployees.includes(emp.name) && emp.isAvailable
    );

    return availableEmployees.length > 0 ? availableEmployees[0] : null;
  }

  async notifyEmployeeOfRequest(employee: EmployeeResponse, request: ServiceRequest): Promise<boolean> {
    // Simulate employee notification
    console.log(`Notifying ${employee.name} of request ${request.id}`);
    return Math.random() > 0.1; // 90% success rate
  }

  generateQuote(serviceType: ServiceRequest['type'], isRevised: boolean = false): Quote {
    const basePrices = {
      'Flat Tyre': 40,
      'Out of Fuel': 30,
      'Car Battery': 60,
      'Other Car Problems': 50,
      'Tow Truck': 100
    };

    const basePrice = basePrices[serviceType] || 50;
    const variation = isRevised ? -10 : Math.floor(Math.random() * 20) - 10;
    const finalPrice = Math.max(20, basePrice + variation);

    return {
      amount: finalPrice,
      employeeName: 'Mock Employee',
      timestamp: new Date().toISOString(),
      isRevised
    };
  }

  async employeeDeclinedRequest(
    employeeId: string, 
    requestId: string, 
    reason: string
  ): Promise<void> {
    console.log(`Employee ${employeeId} declined request ${requestId}: ${reason}`);
  }

  async registerRealEmployee(employee: {
    id: string;
    name: string;
    location: { lat: number; lng: number };
    isAvailable: boolean;
  }): Promise<void> {
    console.log(`Registering real employee: ${employee.name}`);
  }

  async updateEmployeeAvailability(employeeId: string, available: boolean): Promise<void> {
    console.log(`Updating employee ${employeeId} availability to ${available}`);
  }

  async employeeAcceptedRequest(employeeId: string, requestId: string): Promise<void> {
    console.log(`Employee ${employeeId} accepted request ${requestId}`);
  }
}

export const employeeIntegrationService = new EmployeeIntegrationService();
