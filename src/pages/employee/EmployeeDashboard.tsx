
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from '@/components/employee/EmployeeHeader';
import EmployeeSettingsMenu from '@/components/employee/EmployeeSettingsMenu';
import NewServiceRequestManager from '@/components/newService/NewServiceRequestManager';
import { useApp } from '@/contexts/AppContext';
import { useEmployeeDashboardIntegration } from '@/hooks/useEmployeeDashboardIntegration';
import { useTranslation } from '@/utils/translations';
import { ServiceRequest } from '@/types/newServiceRequest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, User } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const t = useTranslation(language);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('employee-status')}</span>
                <Badge variant={isAvailable ? "default" : "secondary"}>
                  {isAvailable ? t('available') : t('unavailable')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleToggleAvailability}
                variant={isAvailable ? "destructive" : "default"}
                className="w-full"
              >
                {isAvailable ? t('go-offline') : t('go-online')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Request */}
        {currentRequest && (
          <div className="mb-6">
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">
                  {t('current-service-request')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{t('customer-id')}:</span>
                  <span>{currentRequest.userId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{t('service-type')}:</span>
                  <span>{getServiceTypeDisplay(currentRequest.type)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{t('location')}:</span>
                  <span>Sofia, Bulgaria</span>
                </div>
                {currentRequest.priceQuote && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">{t('quote')}:</span>
                    <span>{currentRequest.priceQuote} BGN</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button 
                    onClick={handleCompleteService}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {t('complete-service')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Incoming Requests */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('incoming-requests')} ({incomingRequests.length})
          </h2>
          
          {incomingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {isAvailable ? t('no-pending-requests') : t('you-are-currently-offline')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{getServiceTypeDisplay(request.type)}</span>
                      <Badge variant="outline">
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {t('customer-id')}: {request.userId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Sofia, Bulgaria</span>
                    </div>
                    {request.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={() => handleAcceptRequest(request)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {t('accept')}
                      </Button>
                      <Button 
                        onClick={() => handleDeclineRequest(request)}
                        variant="outline"
                        className="flex-1"
                      >
                        {t('decline')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
