
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from '@/components/employee/EmployeeHeader';
import ServiceRequestList from '@/components/employee/ServiceRequestList';
import RequestDetailsDialog from '@/components/employee/RequestDetailsDialog';
import EmployeeSettingsMenu from '@/components/employee/EmployeeSettingsMenu';
import { ServiceRequest } from '@/types/serviceRequest';
import { useApp } from '@/contexts/AppContext';

// Mock data for service requests
const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    type: 'flat-tyre',
    message: 'I have a flat tyre and need assistance',
    timestamp: '01:47:27',
    username: 'user123',
    status: 'pending',
    location: { lat: 42.6977, lng: 23.3219 }
  },
  {
    id: '2',
    type: 'out-of-fuel',
    message: 'I am out of fuel and need assistance',
    timestamp: '01:42:27',
    username: 'driver456',
    status: 'pending',
    location: { lat: 42.6977, lng: 23.3219 }
  },
  {
    id: '3',
    type: 'tow-truck',
    message: 'I have a major problem with my car and need a tow truck',
    timestamp: '01:37:27',
    username: 'traveler789',
    status: 'pending',
    location: { lat: 42.6977, lng: 23.3219 }
  }
];

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock employee location
  const employeeLocation = { lat: 42.6977, lng: 23.3219 };

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

  const handleRequestSelect = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleAcceptRequest = (requestId: string, priceQuote: number) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'accepted' as const, priceQuote }
          : req
      )
    );
    setShowRequestDetails(false);
    setSelectedRequest(null);
  };

  const handleDeclineRequest = () => {
    if (selectedRequest) {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'declined' as const }
            : req
        )
      );
    }
    setShowRequestDetails(false);
    setSelectedRequest(null);
  };

  const getRequestTitle = (type: string) => {
    switch (type) {
      case 'flat-tyre':
        return 'Flat Tyre Assistance';
      case 'out-of-fuel':
        return 'Out of Fuel';
      case 'tow-truck':
        return 'Tow Truck Request';
      default:
        return 'Service Request';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        onSettingsOpen={handleSettingsOpen}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Requests</h2>
        </div>

        <ServiceRequestList
          requests={requests}
          onRequestSelect={handleRequestSelect}
        />
      </div>

      {showRequestDetails && selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          employeeLocation={employeeLocation}
          onClose={() => setShowRequestDetails(false)}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
          getRequestTitle={getRequestTitle}
          language={language}
        />
      )}

      <EmployeeSettingsMenu
        open={showSettings}
        onClose={handleSettingsClose}
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />
    </div>
  );
};

export default EmployeeDashboard;
