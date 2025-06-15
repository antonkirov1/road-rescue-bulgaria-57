
import { ServiceRequest } from '@/types/newServiceRequest';
import { employeeIntegrationService, EmployeeResponse } from '@/services/newEmployeeIntegration';
import { toast } from '@/components/ui/use-toast';

interface UseQuoteHandlingProps {
  setCurrentRequest: (request: ServiceRequest) => void;
  setCurrentScreen: (screen: string | null) => void;
  setAssignedEmployee: (employee: EmployeeResponse | null) => void;
  employeeDeclineCount: number;
  setEmployeeDeclineCount: (count: number) => void;
  hasReceivedRevision: boolean;
  setHasReceivedRevision: (value: boolean) => void;
  blacklistCurrentEmployee: (employeeName: string) => void;
  resetEmployeeTracking: () => void;
  findEmployee: (request: ServiceRequest) => Promise<void>;
}

export const useQuoteHandling = ({
  setCurrentRequest,
  setCurrentScreen,
  setAssignedEmployee,
  employeeDeclineCount,
  setEmployeeDeclineCount,
  hasReceivedRevision,
  setHasReceivedRevision,
  blacklistCurrentEmployee,
  resetEmployeeTracking,
  findEmployee
}: UseQuoteHandlingProps) => {

  const generateQuote = (request: ServiceRequest, employee: EmployeeResponse, isRevised: boolean = false) => {
    const quote = employeeIntegrationService.generateQuote(request.type, isRevised);
    
    // NOTE: status must match "quote_received" or "revised_quote" from union
    const updatedRequest: ServiceRequest = {
      ...request,
      status: isRevised ? "revised_quote" : "quote_received",
      priceQuote: isRevised ? undefined : quote.amount,
      revisedPriceQuote: isRevised ? quote.amount : undefined,
      assignedEmployeeId: employee.id,
      assignedEmployeeName: employee.name,
    };

    setCurrentRequest(updatedRequest);
    setCurrentScreen(isRevised ? 'show_revised_price_quote' : 'show_price_quote_received');
    
    toast({
      title: isRevised ? "Revised Quote Received" : "Price Quote Received",
      description: `${employee.name} sent you a ${isRevised ? 'revised ' : ''}quote of ${quote.amount} BGN.`
    });
  };

  const handleDeclineQuote = async (currentRequest: ServiceRequest, assignedEmployee: EmployeeResponse) => {
    if (!currentRequest || !assignedEmployee) return;
    
    try {
      const newDeclineCount = employeeDeclineCount + 1;
      setEmployeeDeclineCount(newDeclineCount);
      console.log(`Decline #${newDeclineCount} for employee ${assignedEmployee.name}`);

      if (newDeclineCount === 1 && !hasReceivedRevision) {
        // First decline - same employee sends revision
        console.log('First decline - generating revised quote with lower price');
        const updatedRequest: ServiceRequest = {
          ...currentRequest,
          declineCount: currentRequest.declineCount + 1,
          status: "quote_received", // stay on quote_received to maintain flow
        };
        setCurrentRequest(updatedRequest);
        setHasReceivedRevision(true);

        toast({
          title: "Quote Declined",
          description: `${assignedEmployee.name} will send you a revised quote with a lower price.`
        });

        // Generate revised quote after a short delay
        setTimeout(() => {
          generateQuote(updatedRequest, assignedEmployee, true);
        }, 1500);
      } else {
        // Second decline OR decline after revision - blacklist employee and find new one
        console.log(`Second decline (total: ${newDeclineCount}) - blacklisting employee ${assignedEmployee.name} and finding new one`);
        blacklistCurrentEmployee(assignedEmployee.name);

        await employeeIntegrationService.employeeDeclinedRequest(
          assignedEmployee.id, 
          currentRequest.id, 
          newDeclineCount === 1 ? 'Customer declined revised quote' : 'Customer declined quote twice'
        );

        setAssignedEmployee(null);
        resetEmployeeTracking();
        setCurrentScreen('show_searching_technician');

        toast({
          title: "Quote Declined", 
          description: "Looking for another available employee..."
        });

        setTimeout(() => {
          const updatedRequest: ServiceRequest = {
            ...currentRequest,
            revisedPriceQuote: undefined,
            priceQuote: undefined,
            assignedEmployeeId: undefined,
            assignedEmployeeName: undefined,
            status: "searching",
          };
          setCurrentRequest(updatedRequest);
          findEmployee(updatedRequest);
        }, 2000);
      }
    } catch (error) {
      console.error('Error declining quote:', error);
      toast({
        title: "Error",
        description: "Failed to decline quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    generateQuote,
    handleDeclineQuote
  };
};
