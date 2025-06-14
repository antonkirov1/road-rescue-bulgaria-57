
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useNewServiceRequest } from '@/hooks/useNewServiceRequest';
import { usePersistentServiceRequest } from '@/hooks/usePersistentServiceRequest';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardServices from '@/components/dashboard/DashboardServices';
import ExitConfirmDialog from '@/components/dashboard/ExitConfirmDialog';
import SettingsMenu from '@/components/settings/SettingsMenu';

// Define the service types that can be handled by the dashboard
type DashboardServiceType = ServiceRequest['type'] | 'emergency' | 'support';

interface NewServiceRequestManagerProps {
  type: ServiceRequest['type'];
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  userLocation?: { lat: number; lng: number } | null;
  userId: string;
  persistentState: any;
  isRealLife?: boolean; // Flag to distinguish between simulation and real-life
}

const NewServiceRequestManager: React.FC<NewServiceRequestManagerProps> = ({
  type,
  open,
  onClose,
  onMinimize,
  userLocation,
  userId,
  persistentState,
  isRealLife = false
}) => {
  const { language } = useApp();
  const t = useTranslation(language);

  // This is a placeholder component that would contain the actual service request logic
  // In a real implementation, this would render different components based on the service type
  // and handle the service request flow
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isRealLife ? 'Real-Life' : 'Simulation'} Service Request: {type}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onMinimize}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Minimize
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            {isRealLife 
              ? 'This is a real-life service request. All actions will have actual consequences.'
              : 'This is a simulated service request for training purposes.'
            }
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Service Type</label>
            <input 
              type="text" 
              value={type} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">User Location</label>
            <input 
              type="text" 
              value={userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'Not available'} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">User ID</label>
            <input 
              type="text" 
              value={userId} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700" 
            />
          </div>

          {!isRealLife && (
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded border-l-4 border-blue-400">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🎮 Simulation Mode: This request is for training purposes only
              </p>
            </div>
          )}

          {isRealLife && (
            <div className="bg-red-50 dark:bg-red-900 p-3 rounded border-l-4 border-red-400">
              <p className="text-sm text-red-800 dark:text-red-200">
                🚨 Real-Life Mode: This request will create actual service tickets
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle submission logic here
              console.log(`Submitting ${isRealLife ? 'real-life' : 'simulation'} service request:`, type);
              onClose();
            }}
            className={`px-4 py-2 text-white rounded ${
              isRealLife 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewServiceRequestManager;
