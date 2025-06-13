
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';
import { useApp } from '@/contexts/AppContext';

const SupportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const [showChat, setShowChat] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-xl font-semibold">Support Dashboard</h1>
        </div>
        <ChatIcon 
          onClick={() => setShowChat(true)}
          className="ml-2"
        />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Support Portal</h2>
          <p className="text-gray-600 mb-4">
            This is the support management dashboard where you can handle customer support requests and communications.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Active Tickets</h3>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Resolved Today</h3>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Pending Review</h3>
              <p className="text-2xl font-bold text-orange-600">6</p>
            </div>
          </div>
        </div>
      </div>

      <ChatInterface
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default SupportDashboard;
