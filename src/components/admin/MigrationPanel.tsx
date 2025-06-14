import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { UserAccountService } from '@/services/userAccountService';
import { EmployeeAccountService } from '@/services/employeeAccountService';
import { supabase } from '@/integrations/supabase/client';
import MaterialDashboard from './MaterialDashboard';
import MaterialSidebar from './MaterialSidebar';
import MaterialHeader from './MaterialHeader';

const MigrationPanel: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'employees' | 'simulation'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    pendingUsers: 0, // No longer used since new_user_accounts is removed
    existingUsers: 0,
    employees: 0,
    simulationEmployees: 0,
    bannedUsers: 0,
    activeEmployees: 0,
    suspendedEmployees: 0
  });

  const refreshStats = async () => {
    try {
      console.log('Refreshing stats...');
      const [employees, usersData] = await Promise.all([
        EmployeeAccountService.getAllEmployees(),
        supabase.from('user_accounts').select('*') // Updated table name
      ]);
      
      // Get simulation employees count
      const { data: simulationEmployees } = await supabase
        .from('employee_simulation')
        .select('*');

      const users = usersData.data || [];
      const bannedUsers = users.filter(user => user.status === 'banned').length;

      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      const suspendedEmployees = employees.filter(emp => emp.status === 'suspended').length;
      
      const newStats = {
        pendingUsers: 0, // No pending users since new_user_accounts is removed
        existingUsers: users.length,
        employees: employees.length,
        simulationEmployees: simulationEmployees?.length || 0,
        bannedUsers,
        activeEmployees,
        suspendedEmployees
      };
      
      console.log('Updated stats:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  useEffect(() => {
    refreshStats();

    // Set up real-time subscriptions with proper channel names
    const usersChannel = supabase
      .channel('admin-users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_accounts' }, // Updated table name
        (payload) => {
          console.log('User accounts table changed:', payload);
          refreshStats();
        }
      )
      .subscribe((status) => {
        console.log('Users channel status:', status);
      });

    const employeesChannel = supabase
      .channel('admin-employees-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employee_accounts' }, 
        (payload) => {
          console.log('Employee accounts changed:', payload);
          refreshStats();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employee_simulation' }, 
        (payload) => {
          console.log('Employee simulation changed:', payload);
          refreshStats();
        }
      )
      .subscribe((status) => {
        console.log('Employees channel status:', status);
      });

    return () => {
      console.log('Cleaning up channels...');
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(employeesChannel);
    };
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    setTimeout(() => window.location.reload(), 1000);
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Admin Dashboard';
      case 'users':
        return 'User Management';
      case 'employees':
        return 'Employee Management';
      case 'simulation':
        return 'Employee Simulation';
      default:
        return 'Admin Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'System overview and statistics';
      case 'users':
        return 'Manage user accounts and permissions';
      case 'employees':
        return 'Manage employee accounts and roles';
      case 'simulation':
        return 'Employee simulation and testing';
      default:
        return 'System management';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 w-full">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'hidden lg:flex' : 'flex'} lg:flex`}>
        <MaterialSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          stats={stats}
          onStatsUpdate={refreshStats}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <MaterialHeader
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <MaterialDashboard
            currentView={currentView}
            onViewChange={setCurrentView}
            onStatsUpdate={refreshStats}
          />
        </main>
      </div>
    </div>
  );
};

export default MigrationPanel;
