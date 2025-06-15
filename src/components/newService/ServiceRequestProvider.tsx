
import React, { createContext, useContext, useState, useCallback } from "react";
import { ServiceRequest, ServiceRequestStatus } from "@/types/newServiceRequest";

type ServiceRequestContextValue = {
  request: ServiceRequest | null;
  setRequest: (r: ServiceRequest | null) => void;
  step: ServiceRequestStatus | null;
  setStep: (s: ServiceRequestStatus | null) => void;
};

const ServiceRequestContext = createContext<ServiceRequestContextValue | undefined>(undefined);

export const ServiceRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [step, setStep] = useState<ServiceRequestStatus | null>(null);

  return (
    <ServiceRequestContext.Provider value={{ request, setRequest, step, setStep }}>
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequest = () => {
  const ctx = useContext(ServiceRequestContext);
  if (!ctx) throw new Error("useServiceRequest must be used within a ServiceRequestProvider");
  return ctx;
};
