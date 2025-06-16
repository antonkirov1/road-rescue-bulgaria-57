import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, Settings, ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';

const SimulationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, language } = useApp();
  const t = useTranslation(language);
  const [activeRequests] = useState([
    {
      id: 1,
      type: 'Road Repair',
      location: 'Main Street & 5th Ave',
      priority: 'High',
      status: 'In Progress',
      submittedAt: '2024-01-15 10:30'
    },
    {
      id: 2,
      type: 'Pothole',
      location: 'Oak Road near Park',
      priority: 'Medium',
      status: 'Pending',
      submittedAt: '2024-01-15 09:15'
    }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/user/simulation-auth');
    toast({
      title: t('logged-out'),
      description: t('logged-out-msg')
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-semibold">RoadSaver - Simulation Mode</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.username}</span>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white"
          >
            Logout
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">2</div>
                <p className="text-sm text-gray-600">Currently being processed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">5</div>
                <p className="text-sm text-gray-600">Successfully resolved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">7</div>
                <p className="text-sm text-gray-600">All time submissions</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Your latest service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{request.type}</p>
                        <p className="text-sm text-gray-600">{request.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={request.priority === 'High' ? 'destructive' : 'secondary'}>
                        {request.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{request.submittedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Submit a new service request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Report Road Issue
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Track Existing Request
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimulationDashboard;
