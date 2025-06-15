
import React, { createContext, useContext, useState } from "react";
import { ServiceRequest, ServiceRequestStatus } from "@/types/newServiceRequest";

interface ServiceRequestContextValue {
  currentRequest: ServiceRequest | null;
  setCurrentRequest: (req: ServiceRequest | null) => void;
  status: ServiceRequestStatus | null;
  setStatus: (status: ServiceRequestStatus | null) => void;
}

const ServiceRequestContext = createContext<ServiceRequestContextValue | undefined>(undefined);

export const ServiceRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);
  const [status, setStatus] = useState<ServiceRequestStatus | null>(null);

  return (
    <ServiceRequestContext.Provider value={{ currentRequest, setCurrentRequest, status, setStatus }}>
      {children}
    </ServiceRequestContext.Provider>
  );
};

export function useServiceRequest() {
  const ctx = useContext(ServiceRequestContext);
  if (!ctx) throw new Error("useServiceRequest must be used within ServiceRequestProvider");
  return ctx;
}
