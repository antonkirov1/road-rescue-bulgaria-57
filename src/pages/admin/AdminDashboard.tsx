
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MigrationPanel from '@/components/admin/MigrationPanel';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          onClick={handleBackToHome}
          className="bg-white/90 backdrop-blur-sm"
        >
          ← Back to Home
        </Button>
      </div>
      <MigrationPanel />
    </div>
  );
};

export default AdminDashboard;
