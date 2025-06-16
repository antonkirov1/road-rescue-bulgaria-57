
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/ui/theme-toggle';

const SimulationAuth: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { login, language, setLanguage } = useApp();
  const t = useTranslation(language);
  const isMobile = useIsMobile();
  
  const handleLogin = (credentials: { username: string; password: string }) => {
    // Demo credentials for simulation
    if (credentials.username === 'demo' && credentials.password === 'demo123') {
      login({ username: 'demo', email: 'demo@simulation.com' });
      navigate('/user/simulation-dashboard');
      toast({
        title: t("login-successful"),
        description: t("welcome-to-roadsaver")
      });
    } else {
      toast({
        title: t("auth-error"),
        description: t("invalid-username-password"),
        variant: "destructive",
      });
    }
  };
  
  const handleRegister = (userData: { username: string; email: string; password: string; gender?: string; phoneNumber?: string }) => {
    // Simulate successful registration
    login({ username: userData.username, email: userData.email });
    navigate('/user/simulation-dashboard');
    toast({
      title: t("registration-successful"),
      description: t("account-created-welcome")
    });
  };
  
  if (showRegister) {
    return (
      <RegisterForm 
        onRegister={handleRegister} 
        onCancel={() => setShowRegister(false)} 
      />
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-600/10 to-background px-4 py-8 font-clash relative">
      
      {/* Back to Home button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            aria-label={t(language === 'en' ? 'switch-to-bulgarian' : 'switch-to-english')}
            className="h-10 w-10 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="absolute -bottom-1 -right-1 text-xs bg-white text-blue-600 px-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md mb-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">RoadSaver</h1>
          <p className="text-muted-foreground">{t('auth-subtitle')} - Simulation Mode</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-medium">Demo Credentials:</p>
            <p>Username: demo</p>
            <p>Password: demo123</p>
          </div>
        </div>
        
        <LoginForm 
          onLogin={handleLogin} 
          onCreateAccount={() => setShowRegister(true)} 
        />
      </div>
    </div>
  );
};

export default SimulationAuth;
