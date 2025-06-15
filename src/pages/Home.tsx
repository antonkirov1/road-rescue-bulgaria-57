
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Car, Users, Shield, Headphones, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">RoadSaver</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/user/portal-selection')}
            >
              User Portal
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/employee')}
            >
              Employee
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin-selection')}
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/support')}
            >
              Support
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-green-600">RoadSaver</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted partner for roadside assistance. Get help when you need it most, 
            wherever you are on the road.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Car className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">User Services</h3>
            <p className="text-gray-600 mb-4">Request roadside assistance and track your service</p>
            <Button 
              onClick={() => navigate('/user/portal-selection')}
              className="w-full"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Employee Portal</h3>
            <p className="text-gray-600 mb-4">Manage service requests and customer assistance</p>
            <Button 
              onClick={() => navigate('/employee')}
              variant="outline"
              className="w-full"
            >
              Employee Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
            <p className="text-gray-600 mb-4">Oversee operations and manage the platform</p>
            <Button 
              onClick={() => navigate('/admin-selection')}
              variant="outline"
              className="w-full"
            >
              Admin Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Headphones className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Support Center</h3>
            <p className="text-gray-600 mb-4">Customer support and assistance management</p>
            <Button 
              onClick={() => navigate('/support')}
              variant="outline"
              className="w-full"
            >
              Support Portal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
