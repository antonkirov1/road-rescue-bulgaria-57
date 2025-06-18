
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
      ) => {
        // Pass the correct location object instead of userId
        const location = { lat: 0, lng: 0 };
        return realLifeFlow.createRequest(mapDisplayTypeToServiceType(type), description, location);
      },
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
