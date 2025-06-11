
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Users, Settings } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          onClick={handleBackToHome}
          className="bg-white/90 backdrop-blur-sm"
        >
          ← Back to Home
        </Button>
      </div>
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Dashboard
          </h1>
          <p className="text-gray-600">
            Manage service requests and assist customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Active Requests
              </CardTitle>
              <CardDescription>Current service requests assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600 mt-1">Pending completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Completed Today
              </CardTitle>
              <CardDescription>Successfully completed services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">7</div>
              <p className="text-sm text-gray-600 mt-1">Services completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Service Area
              </CardTitle>
              <CardDescription>Your current service coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-purple-600">Sofia Center</div>
              <p className="text-sm text-gray-600 mt-1">5km radius</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="outline" className="mr-4">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            View Service Requests
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
