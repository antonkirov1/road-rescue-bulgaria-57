
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface ChatIconProps {
  employeeId?: string;
  onClick: () => void;
  className?: string;
}

const ChatIcon: React.FC<ChatIconProps> = ({ employeeId, onClick, className = "" }) => {
  const { unreadCount } = useChat(employeeId);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className="text-white dark:text-black hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
        title="Chat"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </div>
  );
};

export default ChatIcon;
