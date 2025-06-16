
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ArrowLeft, Globe, Bell, MapPin, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';
import { getServiceIconAndTitle } from '@/components/service/serviceIcons';

const RealLifeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, language, setLanguage } = useApp();
  const t = useTranslation(language);

  const handleLogout = () => {
    logout();
    navigate('/user/real-life-auth');
    toast({
      title: t('logged-out'),
      description: t('logged-out-msg')
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const services = [
    'flat-tyre',
    'out-of-fuel',
    'car-battery',
    'other-car-problems',
    'tow-truck',
    'support'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Green Header */}
      <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">RoadSaver</h1>
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5" />
          <MapPin className="h-5 w-5" />
          <Settings className="h-5 w-5" />
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
              className="h-8 w-8 bg-white/20 text-white hover:bg-white/30"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <span className="absolute -bottom-1 -right-1 text-xs bg-yellow-400 text-black px-1 rounded text-[10px] font-medium">
              {language.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-gray-600 border-gray-300"
          >
            <Clock className="h-4 w-4" />
            Active Request
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {services.map((serviceType, index) => {
            const serviceData = getServiceIconAndTitle(serviceType as any, t, null, 'w-8 h-8');
            
            return (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-white">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    {serviceData.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{serviceData.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-sm text-gray-500">
                    {serviceData.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealLifeDashboard;
