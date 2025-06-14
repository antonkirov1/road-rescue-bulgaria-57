
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  roomName: string;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomName, onClose }) => {
  return (
    <header className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-white dark:bg-black sticky top-0">
      <h3 className="text-lg font-semibold">{roomName}</h3>
      <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
        <X className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default ChatHeader;
