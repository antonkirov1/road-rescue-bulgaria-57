
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardServices from '@/components/dashboard/DashboardServices';
import DashboardModals from '@/components/dashboard/DashboardModals';
import ExitConfirmDialog from '@/components/dashboard/ExitConfirmDialog';

type ServiceType = 'flat-tyre' | 'out-of-fuel' | 'other-car-problems' | 'tow-truck' | 'emergency' | 'support' | 'car-battery';

const Dashboard: React.FC = () => {
  const { isAuthenticated, userLocation, setUserLocation, language, setLanguage, logout } = useApp();
  const { currentRequest } = useServiceRequestManager();
  const navigate = useNavigate();
  const t = useTranslation(language);
  
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
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
  
  const handleServiceSelect = (service: ServiceType) => {
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
      setSelectedService(currentRequest.type as ServiceType);
    }
  };

  const handleReviewPriceQuote = () => {
    if (currentRequest) {
      setSelectedService(currentRequest.type as ServiceType);
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
      
      <DashboardServices onServiceSelect={handleServiceSelect} />
      
      <DashboardModals
        selectedService={selectedService}
        showEmergencyServices={showEmergencyServices}
        showSettings={showSettings}
        showLocationPicker={showLocationPicker}
        showOngoingRequests={showOngoingRequests}
        userLocation={userLocation}
        language={language}
        t={t}
        onServiceRequestClose={handleRequestClose}
        onEmergencyServicesClose={() => setShowEmergencyServices(false)}
        onSettingsClose={() => setShowSettings(false)}
        onLocationPickerClose={() => setShowLocationPicker(false)}
        onOngoingRequestsClose={() => setShowOngoingRequests(false)}
        onLocationChange={handleLocationChange}
        onLanguageChange={setLanguage}
        onViewRequest={handleViewRequest}
        onReviewPriceQuote={handleReviewPriceQuote}
      />

      <ExitConfirmDialog
        open={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Dashboard;
