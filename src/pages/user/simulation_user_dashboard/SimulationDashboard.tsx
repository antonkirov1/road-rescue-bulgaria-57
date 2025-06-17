import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/ui/theme-toggle';
import RequestSystemDialog from '@/components/newService/RequestSystemDialog';
import { usePersistentRequest } from '@/hooks/usePersistentRequest';

const SimulationDashboard: React.FC = () => {
  const { user, logout, language } = useApp();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Service request state
  const [selectedService, setSelectedService] = useState<"Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck" | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  // Persistent request state
  const {
    request: persistentRequest,
    step: persistentStep,
    serviceType: persistentServiceType,
    isMinimized,
    hasActiveRequest,
    setActiveRequest,
    minimizeRequest,
    restoreRequest,
    clearRequest
  } = usePersistentRequest();

  React.useEffect(() => {
    if (isMinimized && persistentRequest && persistentStep && persistentServiceType) {
      console.log('Restoring minimized request on dashboard');
    }
  }, [isMinimized, persistentRequest, persistentStep, persistentServiceType]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const serviceTypes = [
    "Flat Tyre",
    "Out of Fuel",
    "Car Battery",
    "Other Car Problems",
    "Tow Truck"
  ];

  const handleServiceClick = (serviceType: "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck") => {
    console.log('Service clicked:', serviceType);
    setSelectedService(serviceType);
    setIsRequestDialogOpen(true);
  };

  const handleCloseRequest = () => {
    console.log('Closing request dialog');
    setIsRequestDialogOpen(false);
    setSelectedService(null);
    clearRequest();
  };

  const handleMinimizeRequest = () => {
    console.log('Minimizing request');
    minimizeRequest();
    setIsRequestDialogOpen(false);
  };

  const handleRequestChange = (request: any, step: any) => {
    console.log('Request changed:', { request, step });
    if (request && step) {
      setActiveRequest(request, step, selectedService || persistentServiceType || undefined);
    }
  };

  const handleRestoreRequest = () => {
    console.log('Restoring minimized request');
    if (persistentRequest && persistentStep && persistentServiceType) {
      setSelectedService(persistentServiceType as "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck");
      setIsRequestDialogOpen(true);
      restoreRequest();
    }
  };

  const cardStyle = "p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out";
  const buttonStyle = "w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-clash">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">RoadSaver - Simulation</h1>

          <div className="flex items-center gap-4">
            <ThemeToggle showLabels={false} size="sm" />
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newLanguage = language === 'en' ? 'bg' : 'en';
                  console.log(`Switching language to ${newLanguage}`);
                  useApp.setState({ language: newLanguage });
                }}
                aria-label={t(language === 'en' ? 'switch-to-bulgarian' : 'switch-to-english')}
                className="h-10 w-10 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <span className="absolute -bottom-1 -right-1 text-xs bg-white text-blue-600 px-1 rounded">
                {language.toUpperCase()}
              </span>
            </div>
            <Button onClick={handleLogout} variant="outline">{t("logout")}</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t("welcome-back")}, {user?.username}!</h2>
          <p className="text-gray-600">{t("simulation-dashboard-subtitle")}</p>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTypes.map((type) => (
            <Card key={type} className={cardStyle}>
              <CardContent>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{type}</h3>
                <p className="text-gray-500">{t('simulation-service-description')}</p>
                <Button className={buttonStyle} onClick={() => handleServiceClick(type as "Flat Tyre" | "Out of Fuel" | "Car Battery" | "Other Car Problems" | "Tow Truck")}>
                  {t("request-service")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Request Dialog */}
        {selectedService && (
          <RequestSystemDialog
            open={isRequestDialogOpen}
            type={selectedService}
            onClose={handleCloseRequest}
            onMinimize={handleMinimizeRequest}
            userId={user?.username || 'simulation_user'}
            isRealLife={false}
            initialRequest={isMinimized ? persistentRequest : undefined}
            initialStep={isMinimized ? persistentStep : undefined}
            onRequestChange={handleRequestChange}
          />
        )}

        {/* Minimized Request Indicator */}
        {isMinimized && persistentRequest && persistentStep && (
          <div className="fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-md shadow-lg cursor-pointer hover:bg-blue-700 transition duration-300 ease-in-out" onClick={handleRestoreRequest}>
            {t("minimized-request")} ({persistentServiceType}) - {t(persistentStep)}
          </div>
        )}
      </main>
    </div>
  );
};

export default SimulationDashboard;
