
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Bell, LogOut, Users, Wrench, MapPin, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';
import ThemeToggle from '@/components/ui/theme-toggle';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, logout } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/employee');
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleNotificationsToggle = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-xl font-semibold">Employee Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle showLabels={false} size="sm" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationsToggle}
            className="text-white hover:bg-white/20"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsToggle}
            className="text-white hover:bg-white/20"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <ChatIcon 
            onClick={() => setShowChat(true)}
            className="ml-2"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-white/20"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Work Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Set Availability
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">New service request assigned</p>
                <p className="text-xs text-gray-600">Road repair needed at Main St.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">Task completed successfully</p>
                <p className="text-xs text-gray-600">Pothole repair at Oak Ave.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Great progress!
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Areas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Zones assigned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Tasks */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Tasks</CardTitle>
            <CardDescription>
              Your assigned service requests and maintenance tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Pothole Repair - Main Street</h3>
                    <p className="text-sm text-muted-foreground">Assigned 2 hours ago</p>
                  </div>
                </div>
                <Button size="sm">View Details</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Street Light Maintenance - Oak Avenue</h3>
                    <p className="text-sm text-muted-foreground">Due today</p>
                  </div>
                </div>
                <Button size="sm">View Details</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Sidewalk Inspection - Pine Road</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for tomorrow</p>
                  </div>
                </div>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and tools for field work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center">
                <CheckCircle className="h-6 w-6 mb-2" />
                Complete Task
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MapPin className="h-6 w-6 mb-2" />
                Check Location
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                Request Support
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Wrench className="h-6 w-6 mb-2" />
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default EmployeeDashboard;
