
import React from "react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Settings, Bell } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">RoadSaver Admin</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>This admin dashboard is under construction. Please check back soon.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
