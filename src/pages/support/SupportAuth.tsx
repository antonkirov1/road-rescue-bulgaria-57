
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from '@/utils/translations';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';

const SupportAuth: React.FC = () => {
  const navigate = useNavigate();
  const { login, language, setLanguage } = useApp();
  const t = useTranslation(language);
  
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Support login attempt:', { username: credentials.username });
    
    // Check for Support credentials - you can customize these
    if (credentials.username.trim() === 'support_admin' && credentials.password === 'SupportAcc93') {
      console.log('Support credentials valid, logging in...');
      login({ username: credentials.username });
      navigate('/support/dashboard');
      toast({
        title: "Support Login Successful",
        description: "Welcome to RoadSaver Support Portal"
      });
    } else {
      console.log('Invalid support credentials provided');
      toast({
        title: t("auth-error"),
        description: "Invalid support credentials. Use username: support_admin and password: SupportAcc93",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-600/10 to-background p-4 font-clash relative">
      
      {/* Top right controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            className="h-10 w-10 bg-green-600 text-white hover:bg-green-700"
            title={t('change-language')}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="absolute -bottom-1 -right-1 text-xs bg-white text-green-600 px-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin-selection')}
          className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
        >
          ← Back to Selection
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">RoadSaver</h1>
          <p className="text-muted-foreground">Support Portal</p>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            <p className="font-medium">Support Credentials:</p>
            <p>Username: support_admin</p>
            <p>Password: SupportAcc93</p>
          </div>
        </div>
        
        <LoginForm 
          onLogin={handleLogin}
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default SupportAuth;
