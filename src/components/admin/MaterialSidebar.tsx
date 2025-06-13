
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  Bot, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  UserX,
  UserPlus
} from 'lucide-react';

interface MaterialSidebarProps {
  currentView: 'dashboard' | 'users' | 'employees' | 'simulation';
  onViewChange: (view: 'dashboard' | 'users' | 'employees' | 'simulation') => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  stats: {
    pendingUsers: number;
    existingUsers: number;
    employees: number;
    simulationEmployees: number;
    bannedUsers: number;
    activeEmployees: number;
    suspendedEmployees: number;
  };
  onStatsUpdate?: () => void;
}

const MaterialSidebar: React.FC<MaterialSidebarProps> = ({
  currentView,
  onViewChange,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  stats
}) => {
  const navigationItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: BarChart3,
      count: null
    },
    {
      id: 'users' as const,
      label: 'Users',
      icon: Users,
      count: stats.existingUsers
    },
    {
      id: 'employees' as const,
      label: 'Employees',
      icon: UserCheck,
      count: stats.employees
    },
    {
      id: 'simulation' as const,
      label: 'Simulation',
      icon: Bot,
      count: stats.simulationEmployees
    }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isCollapsed ? 'px-2' : 'px-3'
              } ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">{item.label}</span>
                  {item.count !== null && (
                    <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </div>

      {/* Stats Card */}
      {!isCollapsed && (
        <div className="p-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Users</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Active
                      </span>
                      <span className="text-sm font-semibold text-green-600">{stats.existingUsers - stats.bannedUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <UserX className="h-3 w-3 mr-1" />
                        Banned
                      </span>
                      <span className="text-sm font-semibold text-red-600">{stats.bannedUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Total
                      </span>
                      <span className="text-sm font-semibold text-blue-600">{stats.existingUsers}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Employees</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Active
                      </span>
                      <span className="text-sm font-semibold text-green-600">{stats.activeEmployees}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <UserX className="h-3 w-3 mr-1" />
                        Suspended
                      </span>
                      <span className="text-sm font-semibold text-orange-600">{stats.suspendedEmployees}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Total
                      </span>
                      <span className="text-sm font-semibold text-purple-600">{stats.employees}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default MaterialSidebar;
