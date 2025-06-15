
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { ServiceRequestProvider } from "@/components/newService/ServiceRequestProvider";
import RequestSystemDialog from "@/components/newService/RequestSystemDialog";
import { ServiceRequest } from "@/types/newServiceRequest";
import DashboardServices from "@/components/dashboard/DashboardServices";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SettingsMenu from "@/components/settings/SettingsMenu";

export default function SimulationDashboard() {
  const { language, setLanguage } = useApp();
  const t = useTranslation(language);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedServiceType, setSelectedServiceType] = React.useState<ServiceRequest['type'] | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);

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

  const handleEmergencyClick = () => {
    console.log('Emergency clicked');
  };

  const handleLocationClick = () => {
    console.log('Location clicked');
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'bg' : 'en');
  };

  const handleOngoingRequestsClick = () => {
    console.log('Ongoing requests clicked');
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'bg') => {
    setLanguage(newLanguage);
  };

  return (
    <ServiceRequestProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          language={language}
          t={t}
          onEmergencyClick={handleEmergencyClick}
          onLocationClick={handleLocationClick}
          onSettingsClick={handleSettingsClick}
          onLanguageToggle={handleLanguageToggle}
          onOngoingRequestsClick={handleOngoingRequestsClick}
          hasActiveRequest={false}
        />

        <div className="container max-w-md mx-auto px-4 py-4 sm:py-6">
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

        {showSettings && (
          <SettingsMenu
            open={showSettings}
            onClose={handleSettingsClose}
            onLanguageChange={handleLanguageChange}
            currentLanguage={language}
          />
        )}
      </div>
    </ServiceRequestProvider>
  );
}
