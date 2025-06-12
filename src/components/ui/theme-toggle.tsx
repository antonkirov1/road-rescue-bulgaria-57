
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface ThemeToggleProps {
  showLabels?: boolean;
  size?: 'sm' | 'default';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabels = true, size = 'default' }) => {
  const { theme, setTheme } = useTheme();

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-3">
      {showLabels && (
        <div className="flex items-center space-x-2">
          <Sun className={`${iconSize} text-yellow-500`} />
          <span className="text-sm font-medium">Light</span>
        </div>
      )}
      
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
        className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-yellow-400"
      />
      
      {showLabels && (
        <div className="flex items-center space-x-2">
          <Moon className={`${iconSize} text-slate-600 dark:text-slate-300`} />
          <span className="text-sm font-medium">Dark</span>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
