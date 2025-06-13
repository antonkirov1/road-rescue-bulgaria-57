
import React from 'react';
import UserManagement from './user/UserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Bot, BarChart3 } from 'lucide-react';

interface MaterialDashboardProps {
  currentView: 'dashboard' | 'users' | 'employees' | 'simulation';
  onViewChange: (view: 'dashboard' | 'users' | 'employees' | 'simulation') => void;
}

const MaterialDashboard: React.FC<MaterialDashboardProps> = ({ currentView, onViewChange }) => {
  // Always show user management instead of the dashboard view
  return <UserManagement />;
};

export default MaterialDashboard;
