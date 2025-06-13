
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MigrationPanel from '@/components/admin/MigrationPanel';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';
import { useApp } from '@/contexts/AppContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const [showChat, setShowChat] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

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
      
      <MigrationPanel />

      <ChatInterface
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default AdminDashboard;
