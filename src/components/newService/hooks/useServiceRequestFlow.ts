
import { useSimulatedServiceRequest } from '@/hooks/useSimulatedServiceRequest';
import { useServiceRequestManagerRealLife } from '@/hooks/useServiceRequestManagerRealLife';
import { ServiceType } from '@/components/service/types/serviceRequestState';

// Helper function to map display format to ServiceType
const mapDisplayTypeToServiceType = (
  displayType: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck"
): ServiceType => {
  switch (displayType) {
    case "Flat Tyre":
      return "flat-tyre";
    case "Out of Fuel":
      return "out-of-fuel";
    case "Car Battery":
      return "car-battery";
    case "Other Car Problems":
      return "other-car-problems";
    case "Tow Truck":
      return "tow-truck";
    default:
      return "other-car-problems"; // fallback
  }
};

export const useServiceRequestFlow = () => {
  // Use simulated system for simulation mode
  const simulatedFlow = useSimulatedServiceRequest();
  
  // Use real-life system for real-life mode  
  const realLifeFlow = useServiceRequestManagerRealLife();

  // Always use simulated flow in simulation dashboard context
  const isSimulationMode = true;
  
  console.log('useServiceRequestFlow - current state:', {
    isSimulationMode,
    simulatedStep: simulatedFlow.step,
    simulatedRequest: simulatedFlow.request?.id,
    simulatedRequestType: simulatedFlow.request?.type
  });
  
  if (isSimulationMode) {
    return {
      step: simulatedFlow.step,
      request: simulatedFlow.request,
      createRequest: (
        type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
        description: string,
        userId: string,
        isRealLife: boolean = false
      ) => {
        console.log('useServiceRequestFlow.createRequest called:', { type, description, userId, isRealLife });
        return simulatedFlow.createRequest(type, description, userId);
      },
      acceptQuote: simulatedFlow.acceptQuote,
      acceptRevisedQuote: simulatedFlow.acceptQuote, // Map to same function for now
      declineQuote: simulatedFlow.declineQuote,
      finalDeclineQuote: simulatedFlow.declineQuote,
      cancelRequest: simulatedFlow.cancelRequest,
      closeAll: simulatedFlow.closeAll,
      handleNoTechnicianOk: simulatedFlow.handleNoTechnicianOk,
      completeRequest: simulatedFlow.completeRequest,
      rateEmployee: simulatedFlow.rateEmployee,
    };
  } else {
    const location = { lat: 0, lng: 0 };
    
    return {
      step: realLifeFlow.currentRequest?.status as any,
      request: realLifeFlow.currentRequest as any,
      createRequest: (
        type: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck",
        description: string,
        userId: string,
        isRealLife: boolean = false
      ) => {
        return realLifeFlow.createRequest(mapDisplayTypeToServiceType(type), location, description);
      },
      acceptQuote: realLifeFlow.acceptQuote,
      acceptRevisedQuote: realLifeFlow.acceptQuote, // Map to same function
      declineQuote: () => realLifeFlow.declineQuote(),
      finalDeclineQuote: () => realLifeFlow.declineQuote(),
      cancelRequest: realLifeFlow.cancelRequest,
      closeAll: () => {},
      handleNoTechnicianOk: () => {},
      completeRequest: () => {},
      rateEmployee: () => {},
    };
  }
};
