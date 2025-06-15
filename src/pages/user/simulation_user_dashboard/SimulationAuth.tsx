
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Play } from 'lucide-react';

const SimulationAuth: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterSimulation = () => {
    navigate('/user/simulation-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/user/portal-selection')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-green-600">RoadSaver</h1>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Monitor className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Simulation Mode</CardTitle>
              <CardDescription>
                Experience our roadside assistance service in a simulated environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Request different types of roadside assistance</li>
                  <li>• Experience the full service flow</li>
                  <li>• See how technician matching works</li>
                  <li>• Test the tracking and communication features</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleEnterSimulation}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Simulation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimulationAuth;
