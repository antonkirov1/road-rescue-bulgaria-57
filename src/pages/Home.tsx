
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Users, Settings } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Car className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RoadSaver</h1>
          <p className="text-xl text-gray-600">Emergency Roadside Assistance Platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Car className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Users</h3>
            <p className="text-gray-600 mb-4">Get quick roadside assistance when you need it most</p>
            <Link to="/user">
              <Button className="w-full">Access User Portal</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Employees</h3>
            <p className="text-gray-600 mb-4">Manage service requests and help customers</p>
            <Link to="/employee">
              <Button variant="outline" className="w-full">Employee Login</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Administration</h3>
            <p className="text-gray-600 mb-4">System management and oversight</p>
            <Link to="/admin">
              <Button variant="outline" className="w-full">Admin Panel</Button>
            </Link>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>© 2024 RoadSaver. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
