
import { ServiceRequest } from '@/types/newServiceRequest';
import { employeeIntegrationService, EmployeeResponse } from '@/services/newEmployeeIntegration';
import { toast } from '@/components/ui/use-toast';

interface UseEmployeeManagementProps {
  setCurrentScreen: (screen: string | null) => void;
  setAssignedEmployee: (employee: EmployeeResponse | null) => void;
  resetEmployeeTracking: () => void;
  blacklistedEmployees: string[];
  setBlacklistedEmployees: (fn: (prev: string[]) => string[]) => void;
  onClose: () => void;
  generateQuote: (request: ServiceRequest, employee: EmployeeResponse, isRevised?: boolean) => void;
}

export const useEmployeeManagement = ({
  setCurrentScreen,
  setAssignedEmployee,
  resetEmployeeTracking,
  blacklistedEmployees,
  setBlacklistedEmployees,
  onClose,
  generateQuote
}: UseEmployeeManagementProps) => {
  
  const findEmployee = async (request: ServiceRequest) => {
    try {
      const employee = await employeeIntegrationService.findAvailableEmployee(request, blacklistedEmployees);
      
      if (!employee) {
        setCurrentScreen('show_no_technicians_available');
        setTimeout(() => {
          onClose();
        }, 3000);
        return;
      }

      setAssignedEmployee(employee);
      resetEmployeeTracking();
      console.log('Found employee:', employee.name);
      
      // Notify employee and wait for acceptance
      const notified = await employeeIntegrationService.notifyEmployeeOfRequest(employee, request);
      
      if (notified) {
        // Generate quote
        setTimeout(() => {
          generateQuote(request, employee, false);
        }, 1000 + Math.random() * 2000);
      } else {
        // Employee couldn't be notified, find another
        setBlacklistedEmployees(prev => [...prev, employee.name]);
        setTimeout(() => {
          findEmployee(request);
        }, 1000);
      }
    } catch (error) {
      console.error('Error finding employee:', error);
      setCurrentScreen('show_no_technicians_available');
    }
  };

  const blacklistCurrentEmployee = (employeeName: string) => {
    setBlacklistedEmployees(prev => [...prev, employeeName]);
  };

  return {
    findEmployee,
    blacklistCurrentEmployee
  };
};
