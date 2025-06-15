
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { ServiceRequestProvider } from "@/components/newService/ServiceRequestProvider";
import RequestSystemDialog from "@/components/newService/RequestSystemDialog";
import { ServiceRequest } from "@/types/newServiceRequest";

const services = [
  { id: "flat-tyre", type: "Flat Tyre" as const, icon: "🛞", description: "Tire replacement service" },
  { id: "out-of-fuel", type: "Out of Fuel" as const, icon: "⛽", description: "Fuel delivery service" },
  { id: "car-battery", type: "Car Battery" as const, icon: "🔋", description: "Battery jump start or replacement" },
  { id: "other-problems", type: "Other Car Problems" as const, icon: "🔧", description: "General automotive assistance" },
  { id: "tow-truck", type: "Tow Truck" as const, icon: "🚛", description: "Vehicle towing service" },
];

export default function SimulationDashboard() {
  const { language } = useApp();
  const t = useTranslation(language);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedServiceType, setSelectedServiceType] = React.useState<ServiceRequest['type'] | null>(null);

  const handleServiceSelect = (serviceType: ServiceRequest['type']) => {
    setSelectedServiceType(serviceType);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedServiceType(null);
  };

  return (
    <ServiceRequestProvider>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("simulation-dashboard")}</h1>
          <p className="text-lg text-gray-600">{t("welcome-simulation")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{service.icon}</div>
                <CardTitle className="text-lg">{service.type}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <Button 
                  onClick={() => handleServiceSelect(service.type)}
                  className="w-full"
                >
                  {t("request-service")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Simulation Mode</h3>
              <p className="text-sm text-gray-600">
                This is a simulation environment. All requests and interactions are simulated for demonstration purposes.
              </p>
            </CardContent>
          </Card>
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
