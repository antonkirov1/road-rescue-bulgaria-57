
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Globe, LogOut } from 'lucide-react';
import { useTranslation } from '@/utils/translations';
import ChatIcon from '@/components/chat/ChatIcon';
import ChatInterface from '@/components/chat/ChatInterface';

interface EmployeeHeaderProps {
  language: 'en' | 'bg';
  onLanguageChange: (language: 'en' | 'bg') => void;
  onLogout: () => void;
  onSettingsOpen: () => void;
  employeeId?: string;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  language,
  onLanguageChange,
  onLogout,
  onSettingsOpen,
  employeeId
}) => {
  const t = useTranslation(language);
  const [showChat, setShowChat] = useState(false);
  
  return (
    <>
      <header className="bg-blue-600 text-white p-3 sm:p-4 flex justify-between items-center sticky top-0 z-10 font-clash">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">RoadSaver</h1>
          <ChatIcon 
            employeeId={employeeId}
            onClick={() => setShowChat(true)}
          />
        </div>
        <div className="flex gap-1 sm:gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onLanguageChange(language === 'en' ? 'bg' : 'en')}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              title={t('change-language')}
            >
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 animate-globe-pulse" />
            </Button>
            <span className="absolute -bottom-1 -right-1 text-xs bg-white text-blue-600 px-1 rounded">
              {language.toUpperCase()}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsOpen}
            className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
            title={t('settings')}
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 animate-settings-gear-turn" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/20 h-8 sm:h-10 px-2 sm:px-3 flex items-center"
            title={t('logout')}
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </Button>
        </div>
      </header>

      <ChatInterface
        employeeId={employeeId}
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </>
  );
};

export default EmployeeHeader;
