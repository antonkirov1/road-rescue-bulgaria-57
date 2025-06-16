
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, MessageCircle, ArrowLeft, AlertTriangle, Clock, Calendar, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';
import EmployeeSettingsMenu from '@/components/employee/EmployeeSettingsMenu';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';

interface ServiceRequest {
  id: string;
  type: string;
  description?: string;
  user_location: any;
  status: string;
  created_at: string;
  assigned_employee_id?: string;
  price_quote?: number;
  user_id: string;
}

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);

  useEffect(() => {
    loadServiceRequests();
    loadCompletedRequests();
  }, []);

  const loadServiceRequests = async () => {
    try {
      // Get current employee ID (in real implementation, this would come from auth)
      const employeeId = 'employee';
      
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('assigned_employee_id', employeeId)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading service requests:', error);
        return;
      }

      setActiveRequests(requests || []);
      setActiveTasks(requests?.length || 0);
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const loadCompletedRequests = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: completed, error } = await supabase
        .from('service_requests')
        .select('id')
        .eq('status', 'completed')
        .gte('updated_at', today.toISOString());

      if (error) {
        console.error('Error loading completed requests:', error);
        return;
      }

      setCompletedToday(completed?.length || 0);
    } catch (error) {
      console.error('Error loading completed requests:', error);
    }
  };

  const handleViewRequest = (requestId: string) => {
    // Navigate to request details or handle request
    toast({
      title: "Request Details",
      description: `Viewing request ${requestId}`
    });
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flat tyre':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'out of fuel':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'car battery':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'tow truck':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-xl font-semibold">Employee Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-white hover:bg-blue-700"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-white hover:bg-blue-700 relative"
          >
            <Bell className="h-5 w-5" />
            {activeTasks > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 border-white">
                {activeTasks}
              </Badge>
            )}
          </Button>
          
          <ChatIcon 
            onClick={() => setShowChat(true)}
            className="ml-2"
          />
          
          <Button
            variant="outline"
            onClick={() => navigate('/employee')}
            className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeTasks}</div>
              <p className="text-xs text-muted-foreground">
                {activeTasks > 0 ? 'Tasks requiring attention' : 'No active tasks'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedToday}</div>
              <p className="text-xs text-muted-foreground">
                Great progress!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Active Requests
            </CardTitle>
            <CardDescription>
              Current service requests assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active requests at the moment</p>
                <p className="text-sm">New requests will appear here when assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {getServiceTypeIcon(request.type)}
                      <div>
                        <h4 className="font-medium">{request.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatTimeAgo(request.created_at)}
                        </p>
                        {request.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={request.status === 'accepted' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleViewRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings Menu */}
      <EmployeeSettingsMenu
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onLanguageChange={setLanguage}
        currentLanguage={language}
      />

      {/* Chat Interface */}
      <ChatInterface
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="p-4">
            {activeTasks > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span>You have {activeTasks} active task{activeTasks > 1 ? 's' : ''}</span>
                </div>
                {completedToday > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Completed {completedToday} task{completedToday > 1 ? 's' : ''} today</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
