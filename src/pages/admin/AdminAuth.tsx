
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from '@/utils/translations';
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';
import { AdminAccountService } from '@/services/adminAccountService';

const AdminAuth: React.FC = () => {
  const navigate = useNavigate();
  const { login, language, setLanguage } = useApp();
  const t = useTranslation(language);
  
  const handleLogin = async (credentials: { username: string; password: string }) => {
    console.log('Admin login attempt:', { username: credentials.username });
    
    try {
      const admin = await AdminAccountService.authenticateAdmin(credentials.username, credentials.password);
      
      if (admin) {
        console.log('Admin credentials valid, logging in...');
        login({ username: admin.username, email: admin.email });
        navigate('/admin/dashboard');
        toast({
          title: "Admin Login Successful",
          description: "Welcome to RoadSaver Account Manager"
        });
      } else {
        console.log('Invalid admin credentials provided');
        toast({
          title: t("auth-error"),
          description: "Invalid admin credentials. Use username: account_admin and password: AdminAcc93",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin authentication error:', error);
      toast({
        title: t("auth-error"),
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-600/10 to-background px-3 py-4 sm:px-4 sm:py-8 font-clash relative">
      
      {/* Header with controls - fixed positioning to prevent overlap */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-purple-600/10 to-transparent pb-2">
        {/* Back to Home button */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs p-1.5 h-8 min-w-0"
            size="sm"
          >
            <ArrowLeft className="h-3 w-3 flex-shrink-0" />
            <span className="hidden xs:inline text-xs">Back</span>
          </Button>
        </div>

        {/* Top right controls */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1">
          <ThemeToggle showLabels={false} size="sm" />
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
              aria-label={t(language === 'en' ? 'switch-to-bulgarian' : 'switch-to-english')}
              className="h-8 w-8 bg-purple-600 text-white hover:bg-purple-700 p-1 min-w-0"
            >
              <Globe className="h-3 w-3" />
            </Button>
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] bg-white text-purple-600 px-0.5 rounded leading-none font-medium">
              {language.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main content with proper top margin to avoid header overlap */}
      <div className="flex-1 flex flex-col justify-center items-center mt-16 sm:mt-0">
        <div className="w-full max-w-xs sm:max-w-md">
          <div className="mb-4 sm:mb-6 text-center px-2">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-tight">RoadSaver</h1>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-tight">Account Manager Panel</p>
            <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
              <p className="font-medium text-xs sm:text-sm mb-1">Admin Credentials:</p>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs leading-tight">
                  <span className="font-medium">Username:</span> account_admin
                </p>
                <p className="text-[10px] sm:text-xs leading-tight">
                  <span className="font-medium">Password:</span> AdminAcc93
                </p>
              </div>
            </div>
          </div>
          
          <LoginForm 
            onLogin={handleLogin}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
