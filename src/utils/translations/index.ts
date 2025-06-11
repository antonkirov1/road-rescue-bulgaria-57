
import { allTranslations } from './consolidated';

export const useTranslation = (language: 'en' | 'bg') => {
  return (key: string): string => {
    const translation = allTranslations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      // Convert kebab-case to proper text format
      return key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    return language === 'bg' ? translation.bg : translation.en;
  };
};
