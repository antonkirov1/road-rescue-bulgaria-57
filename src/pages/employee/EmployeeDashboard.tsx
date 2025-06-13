
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from '@/components/employee/EmployeeHeader';
import EmployeeSettingsMenu from '@/components/employee/EmployeeSettingsMenu';
import EmployeeStatusCard from '@/components/employee/EmployeeStatusCard';
import CurrentRequestCard from '@/components/employee/CurrentRequestCard';
import IncomingRequestsList from '@/components/employee/IncomingRequestsList';
import NewServiceRequestManager from '@/components/newService/NewServiceRequestManager';
import { useApp } from '@/contexts/AppContext';
import { useEmployeeDashboardIntegration } from '@/hooks/useEmployeeDashboardIntegration';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import { useTranslation } from '@/utils/translations';
import { ServiceRequest } from '@/types/newServiceRequest';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const t = useTranslation(language);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const persistentServiceState = usePersistentServiceRequest();
  
  // Mock employee data - in a real app this would come from auth
  const employeeId = 'emp_' + Date.now();
  const employeeName = 'John Smith';
  
  const {
    isAvailable,
    incomingRequests,
    currentRequest,
    updateAvailability,
    acceptRequest,
    declineRequest,
    completeService
  } = useEmployeeDashboardIntegration(employeeId, employeeName);

  const handleLogout = () => {
    navigate('/');
  };

  const handleLanguageChange = (newLanguage: 'en' | 'bg') => {
    setLanguage(newLanguage);
  };

  const handleSettingsOpen = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleToggleAvailability = () => {
    updateAvailability(!isAvailable);
  };

  const handleAcceptRequest = (request: ServiceRequest) => {
    acceptRequest(request);
  };

  const handleDeclineRequest = (request: ServiceRequest) => {
    declineRequest(request, t('employee-declined'));
  };

  const handleCompleteService = () => {
    if (currentRequest) {
      completeService(currentRequest.id);
    }
  };

  const getServiceTypeDisplay = (type: ServiceRequest['type']) => {
    return t(`${type.toLowerCase().replace(' ', '-')}`);
  };

  const handleMinimizeRequest = () => {
    // For employee dashboard, we can simply close the request
    // since employees don't need the minimize functionality like users do
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EmployeeHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        onSettingsOpen={handleSettingsOpen}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Availability Toggle */}
        <div className="mb-6">
          <EmployeeStatusCard
            isAvailable={isAvailable}
            onToggleAvailability={handleToggleAvailability}
            t={t}
          />
        </div>

        {/* Current Request */}
        {currentRequest && (
          <div className="mb-6">
            <CurrentRequestCard
              currentRequest={currentRequest}
              onCompleteService={handleCompleteService}
              getServiceTypeDisplay={getServiceTypeDisplay}
              t={t}
            />
          </div>
        )}

        {/* Incoming Requests */}
        <IncomingRequestsList
          incomingRequests={incomingRequests}
          isAvailable={isAvailable}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          getServiceTypeDisplay={getServiceTypeDisplay}
          t={t}
        />
      </div>

      <EmployeeSettingsMenu
        open={showSettings}
        onClose={handleSettingsClose}
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />

      {selectedRequest && (
        <NewServiceRequestManager
          type={selectedRequest.type}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onMinimize={handleMinimizeRequest}
          userLocation={{ lat: 42.6977, lng: 23.3219 }}
          userId={selectedRequest.userId}
          persistentState={persistentServiceState}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
