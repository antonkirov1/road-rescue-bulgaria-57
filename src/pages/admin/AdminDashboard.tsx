
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MigrationPanel from '@/components/admin/MigrationPanel';
import EmployeeManagement from '@/components/admin/employee/EmployeeManagement';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';
import { useApp } from '@/contexts/AppContext';
import { Users, Database, MessageSquare } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState('migration');

  const handleBackToHome = () => {
    navigate('/');
  };

  const tabs = [
    { id: 'migration', label: 'Migration', icon: Database },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <ChatIcon 
          onClick={() => setShowChat(true)}
          className="ml-2"
        />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'migration' && <MigrationPanel />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Chat Management</h2>
            <p className="text-gray-600 mb-4">
              Manage chat rooms and communication settings.
            </p>
            <Button onClick={() => setShowChat(true)}>
              Open Chat Interface
            </Button>
          </div>
        )}
      </div>

      <ChatInterface
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default AdminDashboard;
