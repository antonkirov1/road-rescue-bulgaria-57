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
      console.log('Fetching simulation employees from employee_simulation table...');
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error("Error fetching simulation employees:", error);
        return "Simulation Technician";
      }

      if (!data || data.length === 0) {
        console.log('No simulation employees found in database, returning default name');
        return "Simulation Technician";
      }

      console.log(`Found ${data.length} simulation employees:`, data);
      const randomEmployee = data[Math.floor(Math.random() * data.length)];
      console.log('Selected simulation employee:', randomEmployee);
      return randomEmployee.full_name || "Simulation Technician";
    } catch (error) {
      console.error("Exception in getRandomSimulationEmployee:", error);
      return "Simulation Technician";
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
        const employeeName = randomEmployee.real_name || randomEmployee.username || "Real Life Technician";
        console.log('Selected real life employee:', employeeName);
        return employeeName;
      }
      console.log('No real life employees found, returning default');
      return "Real Life Technician";
    } catch (error) {
      console.error("Error fetching real employees:", error);
      return "Real Life Technician";
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
      console.log('Search timeout triggered, isRealLife:', isRealLife);
      
      try {
        // For simulation dashboard, almost always find an employee
        const noTechnicianChance = isRealLife ? 0.3 : 0.01; // 1% chance for simulation, 30% for real life
        
        if (Math.random() < noTechnicianChance) {
          console.log('No technician found (rare case)');
          setStep("no_technician");
        } else {
          console.log('Finding employee...');
          const employeeName = await getRandomEmployeeName(isRealLife);
          console.log('Employee found:', employeeName);
          
          // Generate a random price quote
          const priceQuote = Math.floor(Math.random() * 50) + 100; // 100-150 BGN
          console.log('Generated price quote:', priceQuote);
          
          setStep("quote_received");
          setRequest(r => r && { 
            ...r, 
            priceQuote,
            assignedEmployeeName: employeeName,
            status: "quote_received"
          });
        }
      } catch (error) {
        console.error('Error in search timeout:', error);
        // Fallback - always provide a technician for simulation
        if (!isRealLife) {
          console.log('Fallback: providing default simulation technician');
          setStep("quote_received");
          setRequest(r => r && { 
            ...r, 
            priceQuote: 120,
            assignedEmployeeName: "Simulation Technician",
            status: "quote_received"
          });
        } else {
          setStep("no_technician");
        }
      }
    }, 1500)); // Increased timeout slightly for better UX
  }

  function acceptQuote() {
    setStep("live_tracking");
    setRequest(r => r && { ...r, status: "live_tracking" });
    timers.current.push(window.setTimeout(() => {
      setStep("completed");
      setRequest(r => r && { ...r, status: "completed" });
    }, 2000));
  }

  function acceptRevisedQuote() {
    setStep("live_tracking");
    setRequest(r => r && { ...r, status: "live_tracking" });
    timers.current.push(window.setTimeout(() => {
      setStep("completed");
      setRequest(r => r && { ...r, status: "completed" });
    }, 1500));
  }

  function declineQuote() {
    setStep("revised_quote");
    setRequest(r => r && { 
      ...r, 
      revisedPriceQuote: (r.priceQuote || 120) + 10, 
      previousEmployeeName: r.assignedEmployeeName,
      status: "revised_quote"
    });
  }

  async function finalDeclineQuote(isRealLife: boolean = false) {
    console.log('Final decline quote, searching for new employee...');
    setStep("searching");
    setRequest(r => r && { 
      ...r, 
      declineCount: (r.declineCount || 0) + 1, 
      previousEmployeeName: r.assignedEmployeeName,
      assignedEmployeeName: undefined, 
      priceQuote: undefined, 
      revisedPriceQuote: undefined,
      status: "searching"
    });
    
    timers.current.push(window.setTimeout(async () => {
      const noTechnicianChance = isRealLife ? 0.3 : 0.01;
      
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
          assignedEmployeeName: employeeName,
          status: "quote_received"
        });
      }
    }, 1500));
  }

  function handleNoTechnicianOk() {
    setStep("cancelled");
    setRequest(r => r && { ...r, status: "cancelled" });
  }

  function cancelRequest() {
    setStep("cancelled");
    setRequest(r => r && { ...r, status: "cancelled" });
  }

  function completeRequest() {
    setStep("rate_employee");
    setRequest(r => r && { ...r, status: "rate_employee" });
  }

  function rateEmployee(rating: number) {
    console.log('Employee rated:', rating);
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
