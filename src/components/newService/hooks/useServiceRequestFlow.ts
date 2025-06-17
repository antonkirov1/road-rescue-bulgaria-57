import { useState, useEffect, useRef } from "react";
import { ServiceRequest, ServiceRequestStatus } from "@/types/newServiceRequest";

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

  function createRequest(type: ServiceRequest["type"], description: string, userId: string) {
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
    timers.current.push(window.setTimeout(() => {
      if (req.type === "Other Car Problems" && Math.random() < 0.5) {
        setStep("no_technician");
      } else {
        setStep("quote_received");
        setRequest(r => r && { ...r, priceQuote: 120, assignedEmployeeName: "Ivan Petrov" });
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
    setRequest(r => r && { ...r, revisedPriceQuote: 130, previousEmployeeName: r.assignedEmployeeName, assignedEmployeeName: "Another Tech" });
  }

  function finalDeclineQuote() {
    // Keep request active and search for a new employee
    setStep("searching");
    setRequest(r => r && { ...r, declineCount: (r.declineCount || 0) + 1, assignedEmployeeName: undefined, priceQuote: undefined, revisedPriceQuote: undefined });
    
    // Simulate search for new employee
    timers.current.push(window.setTimeout(() => {
      if (Math.random() < 0.3) {
        setStep("no_technician");
      } else {
        setStep("quote_received");
        setRequest(r => r && { ...r, priceQuote: Math.floor(Math.random() * 50) + 100, assignedEmployeeName: "New Technician" });
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
