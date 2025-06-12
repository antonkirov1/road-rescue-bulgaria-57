
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Auth from '@/pages/user/Auth';
import NewDashboard from '@/pages/user/NewDashboard';
import EmployeeAuth from '@/pages/employee/EmployeeAuth';
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard';
import Home from '@/pages/Home';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user" element={<Auth />} />
              <Route path="/user/dashboard" element={<NewDashboard />} />
              <Route path="/employee" element={<EmployeeAuth />} />
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
