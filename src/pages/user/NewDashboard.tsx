
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useNewServiceRequest } from '@/hooks/useNewServiceRequest';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardServices from '@/components/dashboard/DashboardServices';
import NewServiceRequestManager from '@/components/newService/NewServiceRequestManager';
import ExitConfirmDialog from '@/components/dashboard/ExitConfirmDialog';

// Define the service types that can be handled by the dashboard
type DashboardServiceType = ServiceRequest['type'] | 'emergency' | 'support';

const NewDashboard: React.FC = () => {
  const { isAuthenticated, userLocation, language, setLanguage, logout, user } = useApp();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const { isOpen, selectedService, openServiceRequest, closeServiceRequest } = useNewServiceRequest();
  
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

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      const hasOpenModal = isOpen || showEmergencyServices || showSettings || 
                          showLocationPicker || showOngoingRequests || showExitConfirm;
      
      if (hasOpenModal) {
        closeServiceRequest();
        setShowEmergencyServices(false);
        setShowSettings(false);
        setShowLocationPicker(false);
        setShowOngoingRequests(false);
        setShowExitConfirm(false);
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
  }, [isOpen, showEmergencyServices, showSettings, showLocationPicker, showOngoingRequests, showExitConfirm, closeServiceRequest]);
  
  const handleServiceSelect = (service: DashboardServiceType) => {
    console.log('Dashboard - Service selected:', service);
    
    if (service === 'emergency') {
      setShowEmergencyServices(true);
    } else if (service === 'support') {
      // Handle support differently - could show a contact dialog
      return;
    } else {
      // Map old service types to new ones if needed
      let mappedService: ServiceRequest['type'];
      
      switch (service) {
        case 'flat-tyre':
          mappedService = 'Flat Tyre';
          break;
        case 'out-of-fuel':
          mappedService = 'Out of Fuel';
          break;
        case 'car-battery':
          mappedService = 'Car Battery';
          break;
        case 'other-car-problems':
          mappedService = 'Other Car Problems';
          break;
        case 'tow-truck':
          mappedService = 'Tow Truck';
          break;
        default:
          // If it's already a new service type, use it directly
          mappedService = service as ServiceRequest['type'];
      }
      
      openServiceRequest(mappedService);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/user');
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
        onOngoingRequestsClick={() => setShowOngoingRequests(true)}
      />
      
      <DashboardServices onServiceSelect={handleServiceSelect} />
      
      {/* New Service Request Manager */}
      {isOpen && selectedService && (
        <NewServiceRequestManager
          type={selectedService}
          open={isOpen}
          onClose={closeServiceRequest}
          userLocation={userLocation}
          userId={user?.username || 'anonymous'}
        />
      )}

      <ExitConfirmDialog
        open={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default NewDashboard;
