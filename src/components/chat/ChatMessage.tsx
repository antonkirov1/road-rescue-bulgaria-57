
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  senderName: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, senderName }) => {
  const senderInitial = senderName.charAt(0).toUpperCase();

  return (
    <div className={cn('flex items-end gap-2', isOwnMessage ? 'justify-end' : 'justify-start')}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${senderName}`} alt={senderName} />
          <AvatarFallback>{senderInitial}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        {!isOwnMessage && <p className="text-xs text-gray-500 dark:text-gray-400 ml-3 mb-1">{senderName}</p>}
        <div
          className={cn(
            'max-w-md p-3 rounded-2xl',
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
          )}
        >
          <p className="text-sm">{message.message_text}</p>
        </div>
        <p className={cn(
            'text-xs mt-1', 
            isOwnMessage ? 'text-gray-500 text-right mr-3' : 'text-gray-500 ml-3'
          )}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
      </div>
      {isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${senderName}`} alt={senderName} />
          <AvatarFallback>{senderInitial}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
