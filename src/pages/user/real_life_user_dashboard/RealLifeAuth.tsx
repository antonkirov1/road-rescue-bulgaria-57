
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, LogIn } from 'lucide-react';

const RealLifeAuth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Add authentication logic here
    navigate('/user/real-life-dashboard');
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
              <Smartphone className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Access your RoadSaver account for real assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Button variant="link" size="sm">
                  Sign up here
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealLifeAuth;
