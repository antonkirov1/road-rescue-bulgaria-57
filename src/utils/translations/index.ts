
import { translations } from './consolidated';

export const useTranslation = (language: 'en' | 'bg') => {
  return (key: string): string => {
    const translationEntry = translations[key as keyof typeof translations];
    
    if (!translationEntry) {
      console.warn(`Translation key "${key}" not found`);
      // Convert kebab-case to proper text format as fallback
      return key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    const translation = translationEntry[language];
    if (!translation) {
      console.warn(`Translation for key "${key}" not found for language "${language}"`);
      // Return English as fallback if Bulgarian is not available
      return translationEntry['en'] || key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    return translation;
  };
};
