
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Shield } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to RoadSaver
          </h1>
          <p className="text-xl text-gray-600">
            Choose your access portal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* User Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Customer Portal</CardTitle>
              <CardDescription>
                Request roadside assistance and track your service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/user/auth')}
                className="w-full"
              >
                Access Customer Portal
              </Button>
            </CardContent>
          </Card>

          {/* Employee Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Employee Portal</CardTitle>
              <CardDescription>
                Manage service requests and assist customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/employee/auth')}
                className="w-full"
                variant="outline"
              >
                Access Employee Portal
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>
                Manage users, employees and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin/auth')}
                className="w-full"
                variant="destructive"
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            RoadSaver - Your trusted roadside assistance platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
