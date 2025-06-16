
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-600/10 to-background px-3 py-4 sm:px-4 sm:py-8 font-clash relative">
      
      {/* Back to Home button */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
          size="sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Back</span>
          <span className="hidden sm:inline">to Home</span>
        </Button>
      </div>

      {/* Top right controls with theme toggle and language switcher */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center gap-1 sm:gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            aria-label={t(language === 'en' ? 'switch-to-bulgarian' : 'switch-to-english')}
            className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-600 text-white hover:bg-purple-700 p-1 sm:p-2"
          >
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 text-[10px] sm:text-xs bg-white text-purple-600 px-0.5 sm:px-1 rounded leading-none">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="w-full max-w-xs sm:max-w-md mt-16 sm:mt-0">
        <div className="mb-4 sm:mb-6 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">RoadSaver</h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-3 sm:mb-4">Account Manager Panel</p>
          <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <p className="font-medium text-xs sm:text-sm mb-1">Admin Credentials:</p>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[10px] sm:text-xs break-all leading-tight">
                <span className="font-medium">Username:</span> account_admin
              </p>
              <p className="text-[10px] sm:text-xs break-all leading-tight">
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
  );
};

export default AdminAuth;
