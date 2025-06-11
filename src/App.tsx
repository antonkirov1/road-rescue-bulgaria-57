
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

// User pages
import UserAuth from '@/pages/user/Auth';
import UserDashboard from '@/pages/user/Dashboard';

// Employee pages  
import EmployeeAuth from '@/pages/employee/EmployeeAuth';
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard';

// Admin pages
import AdminAuth from '@/pages/admin/AdminAuth';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Shared pages
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Root route */}
                <Route path="/" element={<Index />} />
                
                {/* User routes */}
                <Route path="/user/auth" element={<UserAuth />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                
                {/* Employee routes */}
                <Route path="/employee/auth" element={<EmployeeAuth />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                
                {/* Admin routes */}
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Legacy routes for backward compatibility */}
                <Route path="/migration" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
