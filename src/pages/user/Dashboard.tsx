import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardModals from '@/components/dashboard/DashboardModals';
import ExitConfirmDialog from '@/components/dashboard/ExitConfirmDialog';
import { ServiceType as OldServiceType } from '@/components/service/types/serviceRequestState';

// Create a separate DashboardServices component for the old system
const OldDashboardServices: React.FC<{ onServiceSelect: (service: OldServiceType) => void }> = ({ onServiceSelect }) => {
  const { language } = useApp();
  const t = useTranslation(language);
  
  const services: OldServiceType[] = [
    'flat-tyre',
    'out-of-fuel', 
    'car-battery',
    'other-car-problems',
    'tow-truck',
    'support'
  ];

  return (
    <div className="container max-w-md mx-auto px-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {services.map((service) => (
          <div 
            key={service}
            className="group p-3 sm:p-4 hover:bg-secondary/70 transition-colors cursor-pointer flex flex-col min-h-[120px] sm:min-h-[140px] border rounded-lg" 
            onClick={() => onServiceSelect(service)}
          >
            <div className="flex justify-center items-center h-12 sm:h-16 mb-2 sm:mb-3">
              <div className="bg-roadsaver-primary/10 p-3 sm:p-4 text-roadsaver-primary transition-transform duration-200 group-hover:scale-110 rounded-full flex items-center justify-center">
                {/* Icon placeholder */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center text-center">
              <h3 className="text-sm sm:text-lg font-semibold mb-1 leading-tight min-h-[1.5rem] sm:min-h-[2rem] flex items-center justify-center">
                {t(service)}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                {t(`${service}-desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { isAuthenticated, userLocation, setUserLocation, language, setLanguage, logout } = useApp();
  const { currentRequest } = useServiceRequestManager();
  const navigate = useNavigate();
  const t = useTranslation(language);
  
  const [selectedService, setSelectedService] = useState<OldServiceType | null>(null);
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showOngoingRequests, setShowOngoingRequests] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user');
    }
  }, [isAuthenticated, navigate]);

  // Handle browser back button - only show exit dialog if no modals are open
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      // Check if any modal/dialog is currently open
      const hasOpenModal = selectedService || showEmergencyServices || showSettings || 
                          showLocationPicker || showOngoingRequests || showExitConfirm;
      
      if (hasOpenModal) {
        // Close the currently open modal/dialog instead of showing exit dialog
        setSelectedService(null);
        setShowEmergencyServices(false);
        setShowSettings(false);
        setShowLocationPicker(false);
        setShowOngoingRequests(false);
        setShowExitConfirm(false);
      } else {
        // Only show exit dialog if we're on the main dashboard with no modals open
        setShowExitConfirm(true);
      }
      
      // Push the current state back to prevent actual navigation
      window.history.pushState(null, '', window.location.pathname);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedService, showEmergencyServices, showSettings, showLocationPicker, showOngoingRequests, showExitConfirm]);
  
  const handleServiceSelect = (service: OldServiceType) => {
    console.log('Dashboard - Service selected:', service);
    
    // Check if there's an ongoing request that would block new requests
    if (currentRequest && currentRequest.status !== 'completed' && currentRequest.status !== 'cancelled') {
      toast({
        title: "Request in Progress",
        description: "Please wait for your current request to be completed before making a new one.",
        variant: "destructive"
      });
      return;
    }
    
    if (service === 'emergency') {
      setShowEmergencyServices(true);
    } else if (service === 'support') {
      // Contact support is handled in ServiceCard
      return;
    } else {
      // For all other services, open the service request dialog
      console.log('Dashboard - Setting selected service:', service);
      setSelectedService(service);
    }
  };
  
  const handleRequestClose = () => {
    console.log('Dashboard - Closing service request');
    setSelectedService(null);
  };
  
  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
    setShowLocationPicker(false);
    toast({
      title: t('location-updated'),
      description: t('location-updated-msg')
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/user');
  };

  const handleViewRequest = () => {
    if (currentRequest) {
      setSelectedService(currentRequest.type as OldServiceType);
    }
  };

  const handleReviewPriceQuote = () => {
    if (currentRequest) {
      setSelectedService(currentRequest.type as OldServiceType);
    }
  };

  console.log('Dashboard - Current state:', {
    selectedService,
    currentRequest: currentRequest ? {
      id: currentRequest.id,
      status: currentRequest.status,
      hasQuote: !!currentRequest.currentQuote
    } : null
  });
  
  return (
    <div className="min-h-screen bg-background pb-16 font-clash">
      <DashboardHeader
        language={language}
        t={t}
        onEmergencyClick={() => setShowEmergencyServices(true)}
        onLocationClick={() => setShowLocationPicker(true)}
        onSettingsClick={() => setShowSettings(true)}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'bg' : 'en')}
        onOngoingRequestsClick={() => setShowOngoingRequests(true)}
      />
      
      <OldDashboardServices onServiceSelect={handleServiceSelect} />
      
      <DashboardModals
        selectedService={selectedService}
        showEmergencyServices={showEmergencyServices}
        showSettings={showSettings}
        showLocationPicker={showLocationPicker}
        showOngoingRequests={showOngoingRequests}
        userLocation={userLocation}
        language={language}
        t={t}
        onServiceRequestClose={() => setSelectedService(null)}
        onEmergencyServicesClose={() => setShowEmergencyServices(false)}
        onSettingsClose={() => setShowSettings(false)}
        onLocationPickerClose={() => setShowLocationPicker(false)}
        onOngoingRequestsClose={() => setShowOngoingRequests(false)}
        onLocationChange={(location) => {
          setUserLocation(location);
          setShowLocationPicker(false);
          toast({
            title: t('location-updated'),
            description: t('location-updated-msg')
          });
        }}
        onLanguageChange={setLanguage}
        onViewRequest={() => {
          if (currentRequest) {
            setSelectedService(currentRequest.type as OldServiceType);
          }
        }}
        onReviewPriceQuote={() => {
          if (currentRequest) {
            setSelectedService(currentRequest.type as OldServiceType);
          }
        }}
      />

      <ExitConfirmDialog
        open={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onLogout={() => {
          logout();
          navigate('/user');
        }}
      />
    </div>
  );
};

export default Dashboard;
