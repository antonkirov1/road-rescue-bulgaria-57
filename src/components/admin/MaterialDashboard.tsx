
import React from 'react';
import UserManagement from './user/UserManagement';
import EmployeeManagement from './employee/EmployeeManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Bot, BarChart3 } from 'lucide-react';

interface MaterialDashboardProps {
  currentView: 'dashboard' | 'users' | 'employees' | 'simulation';
  onViewChange: (view: 'dashboard' | 'users' | 'employees' | 'simulation') => void;
}

const MaterialDashboard: React.FC<MaterialDashboardProps> = ({ currentView, onViewChange }) => {
  if (currentView === 'users') {
    return <UserManagement />;
  }
  
  if (currentView === 'employees') {
    return <EmployeeManagement />;
  }
  
  if (currentView === 'simulation') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Simulation functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Simulated</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Analytics</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialDashboard;
