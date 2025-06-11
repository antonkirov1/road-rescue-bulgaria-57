
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from '@/components/employee/EmployeeHeader';
import ServiceRequestList from '@/components/employee/ServiceRequestList';
import RequestDetailsDialog from '@/components/employee/RequestDetailsDialog';
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
    status: 'new'
  },
  {
    id: '2',
    type: 'out-of-fuel',
    message: 'I am out of fuel and need assistance',
    timestamp: '01:42:27',
    username: 'driver456',
    status: 'new'
  },
  {
    id: '3',
    type: 'tow-truck',
    message: 'I have a major problem with my car and need a tow truck',
    timestamp: '01:37:27',
    username: 'traveler789',
    status: 'new'
  }
];

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const handleLanguageChange = (newLanguage: 'en' | 'bg') => {
    setLanguage(newLanguage);
  };

  const handleSettingsOpen = () => {
    setShowSettings(true);
  };

  const handleRequestSelect = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
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
          open={showRequestDetails}
          onClose={() => setShowRequestDetails(false)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
