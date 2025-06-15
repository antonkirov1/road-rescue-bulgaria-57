
import React from "react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Settings, Bell } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import EmployeeHeader from '@/components/employee/EmployeeHeader';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();

  const handleLogout = () => {
    navigate('/employee');
  };

  const handleSettingsOpen = () => {
    console.log('Settings clicked');
  };

  const handleLanguageChange = (newLanguage: 'en' | 'bg') => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        onSettingsOpen={handleSettingsOpen}
        employeeId="EMP001"
      />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        <p>This dashboard for employees is under construction. Please check back soon.</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
