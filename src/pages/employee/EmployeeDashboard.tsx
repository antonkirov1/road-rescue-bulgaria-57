
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  MessageCircle, 
  LogOut, 
  ArrowLeft,
  CheckCircle,
  MapPin,
  Users,
  Wrench,
  X,
  Calendar,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';
import { useApp } from '@/contexts/AppContext';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, logout } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/employee');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const tasks = [
    {
      id: 1,
      title: "Pothole Repair - Main Street",
      status: "urgent",
      assignedTime: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      title: "Street Light Maintenance - Oak Avenue",
      status: "due",
      assignedTime: "Due today",
      priority: "medium"
    },
    {
      id: 3,
      title: "Sidewalk Inspection - Pine Road",
      status: "scheduled",
      assignedTime: "Scheduled for tomorrow",
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-500';
      case 'due': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
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
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
              Online
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-white hover:bg-white/20"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
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
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Settings</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Location Services</span>
                <span className="text-green-300">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Push Notifications</span>
                <span className="text-green-300">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-sync Tasks</span>
                <span className="text-green-300">Enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Notifications</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-white/20 p-2 rounded">
                <div className="font-medium">New Task Assigned</div>
                <div className="text-xs opacity-80">Pothole repair on Main Street - 2 hours ago</div>
              </div>
              <div className="bg-white/20 p-2 rounded">
                <div className="font-medium">Task Due Soon</div>
                <div className="text-xs opacity-80">Street light maintenance due today</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Great progress!</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Active Requests
            </CardTitle>
            <p className="text-sm text-muted-foreground">Current maintenance tasks</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {task.title}
                      {getPriorityIcon(task.priority)}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.assignedTime}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-green-500 hover:bg-green-600 text-white border-green-500">
                  View Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Common tasks and tools for field work</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 bg-green-500 hover:bg-green-600 flex flex-col items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Complete Task
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
              <MapPin className="h-5 w-5" />
              Check Location
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
              <Users className="h-5 w-5" />
              Request Support
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
              <Wrench className="h-5 w-5" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      </div>

      <ChatInterface
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default EmployeeDashboard;
