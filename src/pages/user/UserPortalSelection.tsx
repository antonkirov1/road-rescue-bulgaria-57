
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';

const UserPortalSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-green-600">RoadSaver</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Portal</h1>
            <p className="text-gray-600">Select the type of user experience you prefer</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/user/simulation-auth')}>
              <CardHeader className="text-center">
                <Monitor className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Simulation Portal</CardTitle>
                <CardDescription>
                  Try our service with a simulated experience - perfect for testing and demonstrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/user/simulation-auth')}>
                  Enter Simulation
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/user/real-life-auth')}>
              <CardHeader className="text-center">
                <Smartphone className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Real-Life Portal</CardTitle>
                <CardDescription>
                  Access the full service for real roadside assistance requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/user/real-life-auth')}>
                  Get Real Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPortalSelection;
