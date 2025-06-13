
import React, { useState, useEffect } from 'react';
import UserManagement from './user/UserManagement';
import EmployeeManagement from './employee/EmployeeManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Bot, BarChart3, UserX, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MaterialDashboardProps {
  currentView: 'dashboard' | 'users' | 'employees' | 'simulation';
  onViewChange: (view: 'dashboard' | 'users' | 'employees' | 'simulation') => void;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalEmployees: number;
  activeEmployees: number;
  suspendedEmployees: number;
  simulatedEmployees: number;
}

const MaterialDashboard: React.FC<MaterialDashboardProps> = ({ currentView, onViewChange }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    suspendedEmployees: 0,
    simulatedEmployees: 0
  });

  const loadStats = async () => {
    try {
      // Load user stats
      const { data: users } = await supabase
        .from('users')
        .select('*');

      const totalUsers = users?.length || 0;
      const bannedUsers = users?.filter(user => 
        user.banned_until && new Date(user.banned_until) > new Date()
      ).length || 0;
      const activeUsers = totalUsers - bannedUsers;

      // Load employee stats
      const { data: employees } = await supabase
        .from('employee_accounts')
        .select('*');

      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0;
      const suspendedEmployees = employees?.filter(emp => emp.status === 'suspended').length || 0;

      // Load simulation stats
      const { data: simulationEmployees } = await supabase
        .from('employee_simulation')
        .select('*');

      const simulatedEmployees = simulationEmployees?.length || 0;

      setStats({
        totalUsers,
        activeUsers,
        bannedUsers,
        totalEmployees,
        activeEmployees,
        suspendedEmployees,
        simulatedEmployees
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  useEffect(() => {
    loadStats();

    // Set up real-time subscriptions for stats updates
    const usersChannel = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        () => loadStats()
      )
      .subscribe();

    const employeesChannel = supabase
      .channel('employees-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employee_accounts' }, 
        () => loadStats()
      )
      .subscribe();

    const simulationChannel = supabase
      .channel('simulation-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employee_simulation' }, 
        () => loadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(employeesChannel);
      supabase.removeChannel(simulationChannel);
    };
  }, []);

  if (currentView === 'users') {
    return <UserManagement onStatsUpdate={loadStats} />;
  }
  
  if (currentView === 'employees') {
    return <EmployeeManagement onStatsUpdate={loadStats} />;
  }
  
  if (currentView === 'simulation') {
    return (
      <div className="space-y-6 p-4 md:p-6">
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
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* User Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <UserPlus className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center">
                  <UserX className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Banned Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bannedUsers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Employee Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Active Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeEmployees}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center">
                  <UserX className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Suspended</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.suspendedEmployees}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Simulation Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="flex items-center">
                  <Bot className="h-8 w-8 text-cyan-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Simulated Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.simulatedEmployees}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Analytics</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
                  </div>
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
