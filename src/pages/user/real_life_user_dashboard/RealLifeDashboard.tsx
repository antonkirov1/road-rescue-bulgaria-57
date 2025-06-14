
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useNewServiceRequest } from '@/hooks/useNewServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardServices from '@/components/dashboard/DashboardServices';
import NewServiceRequestManagerRealLife from '@/components/newService/NewServiceRequestManagerRealLife';
import ExitConfirmDialog from '@/components/dashboard/ExitConfirmDialog';
import SettingsMenu from '@/components/settings/SettingsMenu';

// Define the service types that can be handled by the dashboard (without simulation elements)
type DashboardServiceType = ServiceRequest['type'] | 'emergency' | 'support';

const RealLifeDashboard: React.FC = () => {
  const { isAuthenticated, userLocation, language, setLanguage, logout, user } = useApp();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const { isOpen, selectedService, openServiceRequest, closeServiceRequest } = useNewServiceRequest();
  
  // Add persistent service request state
  const persistentServiceState = usePersistentServiceRequest();
  
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showOngoingRequests, setShowOngoingRequests] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isServiceRequestMinimized, setIsServiceRequestMinimized] = useState(false);
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user/real-life-auth');
    }
  }, [isAuthenticated, navigate]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      const hasOpenModal = (isOpen && !isServiceRequestMinimized) || showEmergencyServices || showSettings || 
                          showLocationPicker || showOngoingRequests || showExitConfirm;
      
      if (hasOpenModal) {
        // If service request is open and active, minimize it instead of closing
        if (isOpen && !isServiceRequestMinimized) {
          setIsServiceRequestMinimized(true);
        } else {
          closeServiceRequest();
          setShowEmergencyServices(false);
          setShowSettings(false);
          setShowLocationPicker(false);
          setShowOngoingRequests(false);
          setShowExitConfirm(false);
        }
      } else {
        setShowExitConfirm(true);
      }
      
      window.history.pushState(null, '', window.location.pathname);
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, isServiceRequestMinimized, showEmergencyServices, showSettings, showLocationPicker, showOngoingRequests, showExitConfirm, closeServiceRequest]);
  
  const handleServiceSelect = (service: DashboardServiceType) => {
    console.log('Real Life Dashboard - Service selected:', service);
    
    if (service === 'emergency') {
      setShowEmergencyServices(true);
    } else if (service === 'support') {
      // Handle support differently - could show a contact dialog
      return;
    } else {
      // Service is already in the correct format for the new system
      setIsServiceRequestMinimized(false);
      openServiceRequest(service);
    }
  };

  const handleActiveRequestClick = () => {
    if (isOpen && isServiceRequestMinimized) {
      console.log('Restoring minimized service request');
      setIsServiceRequestMinimized(false);
    } else {
      setShowOngoingRequests(true);
    }
  };

  const handleServiceRequestMinimize = () => {
    console.log('Minimizing service request');
    setIsServiceRequestMinimized(true);
  };

  const handleServiceRequestClose = () => {
    console.log('Closing service request completely');
    setIsServiceRequestMinimized(false);
    persistentServiceState.resetState();
    closeServiceRequest();
  };

  const handleLogout = () => {
    logout();
    navigate('/user/real-life-auth');
  };
  
  return (
    <div className="min-h-screen bg-background pb-16 font-clash">
      <DashboardHeader
        language={language}
        t={t}
        onEmergencyClick={() => setShowEmergencyServices(true)}
        onLocationClick={() => setShowLocationPicker(true)}
        onSettingsClick={() => setShowSettings(true)}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'bg' : 'en')}
        onOngoingRequestsClick={handleActiveRequestClick}
      />
      
      <DashboardServices onServiceSelect={handleServiceSelect} />
      
      {/* Real-Life Service Request Manager - only show if not minimized */}
      {isOpen && selectedService && !isServiceRequestMinimized && (
        <NewServiceRequestManagerRealLife
          type={selectedService}
          open={true}
          onClose={handleServiceRequestClose}
          onMinimize={handleServiceRequestMinimize}
          userLocation={userLocation}
          userId={user?.username || 'anonymous'}
          persistentState={persistentServiceState}
        />
      )}

      {/* Settings Menu */}
      <SettingsMenu
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onLanguageChange={setLanguage}
        currentLanguage={language}
      />

      <ExitConfirmDialog
        open={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default RealLifeDashboard;
