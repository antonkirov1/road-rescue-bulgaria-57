import { useState, useEffect, useRef } from "react";
import { ServiceRequest, ServiceRequestStatus } from "@/types/newServiceRequest";
import { EmployeeAccountService } from "@/services/employeeAccountService";
import { supabase } from "@/integrations/supabase/client";

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

  // Helper to get random employee name from employee_simulation table
  const getRandomSimulationEmployee = async (): Promise<string> => {
    try {
      console.log('Fetching simulation employees...');
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('full_name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching simulation employees:", error);
        return "Technician";
      }

      console.log('Simulation employees data:', data);

      if (data && data.length > 0) {
        const randomEmployee = data[Math.floor(Math.random() * data.length)];
        console.log('Selected simulation employee:', randomEmployee.full_name);
        return randomEmployee.full_name;
      }
      
      console.log('No simulation employees found, returning default');
      return "Technician";
    } catch (error) {
      console.error("Error in getRandomSimulationEmployee:", error);
      return "Technician";
    }
  };

  // Helper to get random employee name from employee_accounts table
  const getRandomRealLifeEmployee = async (): Promise<string> => {
    try {
      console.log('Fetching real life employees...');
      const availableEmployees = await EmployeeAccountService.getAvailableEmployees();
      console.log('Available real life employees:', availableEmployees);
      
      if (availableEmployees.length > 0) {
        const randomEmployee = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
        const employeeName = randomEmployee.real_name || randomEmployee.username || "Technician";
        console.log('Selected real life employee:', employeeName);
        return employeeName;
      }
      console.log('No real life employees found, returning default');
      return "Available Technician";
    } catch (error) {
      console.error("Error fetching real employees:", error);
      return "Available Technician";
    }
  };

  // Helper to get random employee name
  const getRandomEmployeeName = async (isRealLife: boolean = false): Promise<string> => {
    console.log('Getting random employee name, isRealLife:', isRealLife);
    if (isRealLife) {
      return await getRandomRealLifeEmployee();
    } else {
      return await getRandomSimulationEmployee();
    }
  };

  function createRequest(type: ServiceRequest["type"], description: string, userId: string, isRealLife: boolean = false) {
    console.log('Creating request:', { type, description, userId, isRealLife });
    
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
      console.log('Timeout triggered for employee search');
      
      // For simulation dashboard, reduce the chance of "no technician" to almost zero
      const noTechnicianChance = isRealLife ? 0.3 : 0.05; // 5% chance for simulation, 30% for real life
      
      if (req.type === "Other Car Problems" && Math.random() < noTechnicianChance) {
        console.log('No technician found');
        setStep("no_technician");
      } else {
        console.log('Finding employee...');
        const employeeName = await getRandomEmployeeName(isRealLife);
        console.log('Employee found:', employeeName);
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
      assignedEmployeeName: r.assignedEmployeeName // Keep the same employee for revised quote
    });
  }

  async function finalDeclineQuote(isRealLife: boolean = false) {
    console.log('Final decline quote, searching for new employee...');
    // Keep request active and search for a new employee
    setStep("searching");
    setRequest(r => r && { 
      ...r, 
      declineCount: (r.declineCount || 0) + 1, 
      previousEmployeeName: r.assignedEmployeeName,
      assignedEmployeeName: undefined, 
      priceQuote: undefined, 
      revisedPriceQuote: undefined 
    });
    
    // Simulate search for new employee
    timers.current.push(window.setTimeout(async () => {
      const noTechnicianChance = isRealLife ? 0.3 : 0.05;
      
      if (Math.random() < noTechnicianChance) {
        console.log('No technician found after final decline');
        setStep("no_technician");
      } else {
        console.log('Finding new employee after final decline...');
        const employeeName = await getRandomEmployeeName(isRealLife);
        console.log('New employee found:', employeeName);
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
