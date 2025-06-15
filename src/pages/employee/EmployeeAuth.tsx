
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, LogIn } from 'lucide-react';

const EmployeeAuth: React.FC = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Add authentication logic here
    navigate('/employee/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
            <h1 className="text-2xl font-bold text-blue-600">RoadSaver</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Employee Login</CardTitle>
              <CardDescription>
                Access your employee dashboard to manage service requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleLogin}
                className="w-full"
                size="lg"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Button>
              
              <div className="text-center">
                <Button variant="link" size="sm">
                  Forgot your password?
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAuth;
