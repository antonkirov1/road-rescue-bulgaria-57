
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Shield, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import ThemeToggle from '@/components/ui/theme-toggle';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const t = useTranslation(language);

  const handleCustomerPortalClick = () => {
    console.log('Customer portal button clicked, navigating to /user/portal-selection');
    navigate('/user/portal-selection');
  };

  const handleEmployeeClick = () => {
    console.log('Employee button clicked, navigating to /employee');
    navigate('/employee');
  };

  const handleAdminClick = () => {
    console.log('Admin button clicked, navigating to /admin-selection');
    navigate('/admin-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
            title={t('change-language')}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="absolute -bottom-1 -right-1 text-xs bg-white text-primary px-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('welcome-to-roadsaver')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('choose-access-portal')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Customer Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>{t('customer-portal')}</CardTitle>
              <CardDescription>
                {t('customer-portal-description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCustomerPortalClick}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t('access-customer-portal')}
              </Button>
            </CardContent>
          </Card>

          {/* Employee Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>{t('employee-portal')}</CardTitle>
              <CardDescription>
                {t('employee-portal-description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleEmployeeClick}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {t('employee-login')}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>{t('admin-portal')}</CardTitle>
              <CardDescription>
                {t('admin-portal-description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAdminClick}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {t('admin-panel')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('roadsaver-footer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
