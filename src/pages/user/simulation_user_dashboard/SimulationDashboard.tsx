
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { ServiceRequestProvider } from "@/components/newService/ServiceRequestProvider";
import RequestSystemDialog from "@/components/newService/RequestSystemDialog";
import { ServiceRequest } from "@/types/newServiceRequest";
import DashboardServices from "@/components/dashboard/DashboardServices";

export default function SimulationDashboard() {
  const { language } = useApp();
  const t = useTranslation(language);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedServiceType, setSelectedServiceType] = React.useState<ServiceRequest['type'] | null>(null);

  const handleServiceSelect = (serviceType: ServiceRequest['type'] | 'emergency' | 'support') => {
    if (serviceType === 'support' || serviceType === 'emergency') {
      return; // Handle these differently if needed
    }
    setSelectedServiceType(serviceType);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedServiceType(null);
  };

  return (
    <ServiceRequestProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">RoadSaver</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">Active Request</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Services</h2>
          <DashboardServices onServiceSelect={handleServiceSelect} />
        </div>

        {isDialogOpen && selectedServiceType && (
          <RequestSystemDialog
            open={isDialogOpen}
            type={selectedServiceType}
            onClose={closeDialog}
            userId={"simulation-user"}
          />
        )}
      </div>
    </ServiceRequestProvider>
  );
}
