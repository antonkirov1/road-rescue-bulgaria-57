
import { useSimulatedServiceRequest } from '@/hooks/useSimulatedServiceRequest';
import { useServiceRequestManagerRealLife } from '@/hooks/useServiceRequestManagerRealLife';

export const useServiceRequestFlow = () => {
  // Use simulated system for simulation mode
  const simulatedFlow = useSimulatedServiceRequest();
  
  // Use real-life system for real-life mode  
  const realLifeFlow = useServiceRequestManagerRealLife();

  // For now, always use simulated flow in simulation dashboard
  // This can be made conditional based on context if needed
  const isSimulationMode = true; // This should be determined by context
  
  if (isSimulationMode) {
    return simulatedFlow;
  } else {
    return {
      step: realLifeFlow.currentRequest?.status as any,
      request: realLifeFlow.currentRequest as any,
      createRequest: (
        type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
        description: string,
        userId: string,
        isRealLife: boolean = false
      ) => realLifeFlow.createRequest(type, description, userId, isRealLife),
      acceptQuote: realLifeFlow.acceptQuote,
      acceptRevisedQuote: realLifeFlow.acceptQuote, // Map to same function
      declineQuote: realLifeFlow.declineQuote,
      finalDeclineQuote: () => realLifeFlow.declineQuote(),
      cancelRequest: realLifeFlow.cancelRequest,
      closeAll: () => {},
      handleNoTechnicianOk: () => {},
      completeRequest: () => {},
      rateEmployee: () => {},
    };
  }
};
