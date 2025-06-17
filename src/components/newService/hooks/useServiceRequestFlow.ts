import { useState, useEffect, useRef } from "react";
import { ServiceRequest, ServiceRequestStatus } from "@/types/newServiceRequest";
import { EmployeeAccountService } from "@/services/employeeAccountService";

export function useServiceRequestFlow() {
  const [step, setStep] = useState<ServiceRequestStatus | null>(null);
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const timers = useRef<number[]>([]);

  // Clean up timers on unmount/close
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Helper to get random employee name
  const getRandomEmployeeName = async (isRealLife: boolean = false): Promise<string> => {
    if (isRealLife) {
      try {
        const availableEmployees = await EmployeeAccountService.getAvailableEmployees();
        if (availableEmployees.length > 0) {
          const randomEmployee = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
          return randomEmployee.real_name || randomEmployee.username || "Technician";
        }
      } catch (error) {
        console.error("Error fetching real employees:", error);
      }
      return "Available Technician";
    } else {
      // For simulation - use existing simulation names
      const simulationNames = [
        "Ivan Petrov", "Maria Georgieva", "Dimitar Stoev", "Elena Nikolova", 
        "Georgi Popov", "Svetlana Dimitrova", "Petar Ivanov", "Anna Stoyanova"
      ];
      return simulationNames[Math.floor(Math.random() * simulationNames.length)];
    }
  };

  function createRequest(type: ServiceRequest["type"], description: string, userId: string, isRealLife: boolean = false) {
    const req: ServiceRequest = {
      id: String(Date.now()) + Math.random().toString(16),
      type,
      status: "searching",
      userLocation: { lat: 0, lng: 0 },
      userId,
      declineCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      description,
    };
    setRequest(req);
    setStep("searching");

    // Simulate search, then show quote, or "no technician" after a delay
    timers.current.push(window.setTimeout(async () => {
      if (req.type === "Other Car Problems" && Math.random() < 0.5) {
        setStep("no_technician");
      } else {
        const employeeName = await getRandomEmployeeName(isRealLife);
        setStep("quote_received");
        setRequest(r => r && { ...r, priceQuote: 120, assignedEmployeeName: employeeName });
      }
    }, 1200));
  }

  function acceptQuote() {
    setStep("live_tracking");
    timers.current.push(window.setTimeout(() => setStep("completed"), 2000));
  }

  function acceptRevisedQuote() {
    setStep("live_tracking");
    timers.current.push(window.setTimeout(() => setStep("completed"), 1500));
  }

  function declineQuote() {
    setStep("revised_quote");
    setRequest(r => r && { 
      ...r, 
      revisedPriceQuote: 130, 
      previousEmployeeName: r.assignedEmployeeName, 
      assignedEmployeeName: "Another Technician" 
    });
  }

  async function finalDeclineQuote(isRealLife: boolean = false) {
    // Keep request active and search for a new employee
    setStep("searching");
    setRequest(r => r && { 
      ...r, 
      declineCount: (r.declineCount || 0) + 1, 
      assignedEmployeeName: undefined, 
      priceQuote: undefined, 
      revisedPriceQuote: undefined 
    });
    
    // Simulate search for new employee
    timers.current.push(window.setTimeout(async () => {
      if (Math.random() < 0.3) {
        setStep("no_technician");
      } else {
        const employeeName = await getRandomEmployeeName(isRealLife);
        setStep("quote_received");
        setRequest(r => r && { 
          ...r, 
          priceQuote: Math.floor(Math.random() * 50) + 100, 
          assignedEmployeeName: employeeName 
        });
      }
    }, 1500));
  }

  function handleNoTechnicianOk() {
    setStep("cancelled");
    setRequest(null);
  }

  function cancelRequest() {
    setStep("cancelled");
    setRequest(null);
  }

  function completeRequest() {
    setStep("rate_employee");
  }

  function rateEmployee(rating: number) {
    setStep(null);
    setRequest(null);
  }

  function closeAll() {
    setStep(null);
    setRequest(null);
  }

  return {
    step,
    request,
    createRequest,
    acceptQuote,
    acceptRevisedQuote,
    declineQuote,
    finalDeclineQuote,
    cancelRequest,
    closeAll,
    handleNoTechnicianOk,
    completeRequest,
    rateEmployee,
  };
}
