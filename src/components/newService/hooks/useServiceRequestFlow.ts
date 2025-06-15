
import { useState, useRef } from "react";
import { ServiceRequest, ServiceRequestStatus } from "@/types/newServiceRequest";

export function useServiceRequestFlow() {
  const [step, setStep] = useState<ServiceRequestStatus | null>(null);
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  // Simulate request step transitions after timeouts etc.
  // For full implementation, adapt from repo logic:
  function createRequest(type: ServiceRequest["type"], description: string) {
    const req: ServiceRequest = {
      id: String(Date.now()),
      type,
      status: "pending",
      userLocation: { lat: 0, lng: 0 },
      userId: "user",
      declineCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      description,
    };
    setRequest(req);
    setStep("searching");
    setTimeout(() => {
      setStep("quote_received");
      setRequest({ ...req, priceQuote: 100, assignedEmployeeName: "Ivan Petrov" });
    }, 1200);
  }

  function acceptQuote() {
    if (!request) return;
    setStep("live_tracking");
    setTimeout(() => setStep("completed"), 3000);
  }

  function declineQuote() {
    setStep("searching");
    setTimeout(() => setStep("quote_received"), 1000);
  }

  function cancelRequest() {
    setStep("cancelled");
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
    declineQuote,
    cancelRequest,
    closeAll,
  };
}
