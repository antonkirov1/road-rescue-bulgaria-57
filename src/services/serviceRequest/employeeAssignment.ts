
import { toast } from "@/components/ui/use-toast";
import { SimulatedEmployeeBlacklistService } from '@/services/simulatedEmployeeBlacklistService';
import { ServiceRequestState, EmployeeSimulationFunctions } from './types';

export class EmployeeAssignmentService {
  private employeeSimulation: EmployeeSimulationFunctions | null = null;

  initialize(employeeSimulation: EmployeeSimulationFunctions): void {
    this.employeeSimulation = employeeSimulation;
  }

  async findAvailableEmployee(request: ServiceRequestState): Promise<{
    name: string;
    id: string;
    location: { lat: number; lng: number };
  } | null> {
    if (!this.employeeSimulation) {
      throw new Error('Employee simulation not initialized');
    }

    try {
      const { loadEmployees, getRandomEmployee } = this.employeeSimulation;
      await loadEmployees();
      
      // Get blacklisted employees from database
      const dbBlacklisted = await SimulatedEmployeeBlacklistService.getBlacklistedEmployees(request.id);
      const allBlacklisted = [...request.blacklistedEmployees, ...dbBlacklisted];
      
      console.log('Finding employee from employee_simulation, blacklisted:', allBlacklisted);
      
      // Only use employees from employee_simulation table
      const employee = getRandomEmployee(allBlacklisted);
      
      if (!employee) {
        toast({
          title: "No employees available",
          description: "All simulated employees are currently busy. Please try again later.",
          variant: "destructive"
        });
        return null;
      }
      
      console.log('Found simulated employee:', employee.full_name, 'Employee ID:', employee.id);
      
      return {
        name: employee.full_name,
        id: employee.id.toString(),
        location: {
          lat: request.userLocation.lat + (Math.random() - 0.5) * 0.02,
          lng: request.userLocation.lng + (Math.random() - 0.5) * 0.02
        }
      };
      
    } catch (error) {
      console.error('Error finding simulated employee:', error);
      throw error;
    }
  }

  async blacklistEmployee(requestId: string, employeeName: string): Promise<void> {
    try {
      await SimulatedEmployeeBlacklistService.addToBlacklist(
        requestId,
        employeeName,
        'current_user'
      );
      console.log('Simulated employee blacklisted:', employeeName);
    } catch (error) {
      console.error('Error blacklisting simulated employee:', error);
      throw error;
    }
  }
}
