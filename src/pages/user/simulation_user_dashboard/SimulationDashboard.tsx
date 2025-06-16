
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ArrowLeft, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';
import ThemeToggle from '@/components/ui/theme-toggle';

const SimulationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, language, setLanguage } = useApp();
  const t = useTranslation(language);

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

  const services = [
    {
      title: 'Flat Tyre',
      description: 'flat-tyre-desc',
      icon: '🛞'
    },
    {
      title: 'Out of Fuel',
      description: 'out-of-fuel-desc',
      icon: '⛽'
    },
    {
      title: 'Car Battery',
      description: 'car-battery-desc',
      icon: '🔋'
    },
    {
      title: 'Other Car Problems',
      description: 'other-car-problems-desc',
      icon: '🔧'
    },
    {
      title: 'Tow Truck',
      description: 'tow-truck-desc',
      icon: '🚛'
    },
    {
      title: 'Support',
      description: 'support-desc',
      icon: '📞'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-semibold">RoadSaver</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle showLabels={false} size="sm" />
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
              className="h-10 w-10 bg-white/10 text-white hover:bg-white/20"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <span className="absolute -bottom-1 -right-1 text-xs bg-white text-green-600 px-1 rounded">
              {language.toUpperCase()}
            </span>
          </div>
          <span className="text-sm">Welcome, {user?.username}</span>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white"
          >
            Logout
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <CardDescription className="text-sm text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationDashboard;
