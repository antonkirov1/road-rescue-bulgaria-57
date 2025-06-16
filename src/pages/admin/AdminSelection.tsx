
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Headphones, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import ThemeToggle from '@/components/ui/theme-toggle';

const AdminSelection: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const t = useTranslation(language);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleAdminLogin = () => {
    navigate('/admin');
  };

  const handleSupportLogin = () => {
    navigate('/support');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      
      {/* Top right controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            className="h-10 w-10 bg-purple-600 text-white hover:bg-purple-700"
            title={t('change-language')}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="absolute -bottom-1 -right-1 text-xs bg-white text-purple-600 px-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="outline" 
          onClick={handleBackToHome}
          className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
        >
          ← Back to Home
        </Button>
      </div>

      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">RoadSaver</h1>
          <p className="text-muted-foreground">Administration Portal Selection</p>
        </div>

        <div className="space-y-4">
          {/* Support Button */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Headphones className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Support</CardTitle>
              <p className="text-sm text-muted-foreground">Access support management portal</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSupportLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Support Login
              </Button>
            </CardContent>
          </Card>

          {/* Admin Button */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Admin</CardTitle>
              <p className="text-sm text-muted-foreground">System management and oversight</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAdminLogin}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSelection;
