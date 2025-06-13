
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Bot, BarChart3 } from 'lucide-react';
import UserManagement from './user/UserManagement';
import EmployeeManagement from './employee/EmployeeManagement';

interface MaterialDashboardProps {
  currentView: 'dashboard' | 'users' | 'employees' | 'simulation';
  onViewChange: (view: 'dashboard' | 'users' | 'employees' | 'simulation') => void;
}

const MaterialDashboard: React.FC<MaterialDashboardProps> = ({
  currentView,
  onViewChange
}) => {
  const handleStatsUpdate = async () => {
    // This will be called by child components to trigger stats refresh
    // The actual stats refresh is handled in the parent MigrationPanel
  };

  const renderDashboardOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onViewChange('users')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Manage Users</div>
          <p className="text-xs text-muted-foreground">
            View and manage user accounts
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onViewChange('employees')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Employees</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Manage Employees</div>
          <p className="text-xs text-muted-foreground">
            View and manage employee accounts
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onViewChange('simulation')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Simulation</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Employee Simulation</div>
          <p className="text-xs text-muted-foreground">
            Manage simulated employees
          </p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Analytics</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">System Stats</div>
          <p className="text-xs text-muted-foreground">
            View system analytics
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderSimulation = () => (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Employee simulation functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  switch (currentView) {
    case 'users':
      return <UserManagement onStatsUpdate={handleStatsUpdate} />;
    case 'employees':
      return <EmployeeManagement onStatsUpdate={handleStatsUpdate} />;
    case 'simulation':
      return renderSimulation();
    default:
      return renderDashboardOverview();
  }
};

export default MaterialDashboard;
