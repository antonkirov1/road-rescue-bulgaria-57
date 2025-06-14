
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/ui/theme-toggle';
import { UserAccountService } from '@/services/userAccountService';

const Auth: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { login, language, setLanguage } = useApp();
  const t = useTranslation(language);
  const isMobile = useIsMobile();
  
  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      // Check for demo credentials first
      if (credentials.username === 'user' && credentials.password === 'user123') {
        login({ username: 'user', email: 'user@demo.com' });
        navigate('/user/portal-selection');
        toast({
          title: t("login-successful"),
          description: t("welcome-to-roadsaver")
        });
        return;
      }

      // Try database authentication
      const user = await UserAccountService.authenticateUser(credentials.username, credentials.password);
      
      if (user) {
        login({ username: user.username, email: user.email });
        navigate('/user/portal-selection');
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
    } catch (error) {
      console.error('User authentication error:', error);
      toast({
        title: t("auth-error"),
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRegister = async (userData: { username: string; email: string; password: string; gender?: string; phoneNumber?: string }) => {
    try {
      await UserAccountService.createUserAccount({
        username: userData.username,
        email: userData.email,
        password_hash: userData.password,
        phone_number: userData.phoneNumber,
        gender: userData.gender,
        full_name: userData.username // Default to username if no full name provided
      });

      login({ username: userData.username, email: userData.email });
      navigate('/user/portal-selection');
      toast({
        title: t("registration-successful"),
        description: t("account-created-welcome")
      });
    } catch (error) {
      console.error('User registration error:', error);
      toast({
        title: t("auth-error"),
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-600/10 to-background px-4 py-8 font-clash relative">
      
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            aria-label={t(language === 'en' ? 'switch-to-bulgarian' : 'switch-to-english')}
            className="h-10 w-10 bg-green-600 text-white hover:bg-green-700"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="absolute -bottom-1 -right-1 text-xs bg-white text-green-600 px-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md mb-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">RoadSaver</h1>
          <p className="text-muted-foreground">{t('auth-subtitle')}</p>
        </div>
        
        <LoginForm 
          onLogin={handleLogin} 
          onCreateAccount={() => setShowRegister(true)} 
        />
      </div>
    </div>
  );
};

export default Auth;
