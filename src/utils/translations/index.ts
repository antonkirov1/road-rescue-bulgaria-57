
import { translations } from './consolidated';

export const useTranslation = (language: 'en' | 'bg') => {
  return (key: string): string => {
    const translation = translations[language];
    if (!translation || !translation[key]) {
      console.warn(`Translation key "${key}" not found`);
      // Convert kebab-case to proper text format
      return key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    return translation[key];
  };
};
