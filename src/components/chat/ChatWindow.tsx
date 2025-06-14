
import React, { useEffect, useRef } from 'react';
import { ChatRoom, ChatMessage as ChatMessageType } from '@/types/chat';
import { useChat } from '@/hooks/useChat';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';

interface ChatWindowProps {
  room: ChatRoom | null;
  employeeId?: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ room, employeeId, onClose }) => {
  const { messages, fetchMessages, sendMessage } = useChat(employeeId);
  const currentRoomMessages = room ? messages[room.id] || [] : [];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (room?.id) {
      fetchMessages(room.id);
    }
  }, [room?.id, fetchMessages]);
  
  useEffect(() => {
    // A small delay to allow images and other content to load
    setTimeout(() => scrollToBottom(), 100);
  }, [currentRoomMessages]);

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 p-8 text-center">
        <MessageCircle className="h-16 w-16 mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold">Select a conversation</h3>
        <p className="text-sm text-gray-400">Choose a chat from the sidebar to start messaging.</p>
      </div>
    );
  }

  const handleSendMessage = (text: string) => {
    sendMessage(room.id, text);
  };
  
  return (
    <section className="flex-1 flex flex-col bg-white dark:bg-black">
      <ChatHeader roomName={room.name} onClose={onClose} />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {currentRoomMessages.length > 0 ? (
            currentRoomMessages.map(msg => {
                const isOwnMessage = employeeId ? msg.sender_employee_id === employeeId : !msg.sender_employee_id && !!msg.sender_id;
                const senderName = isOwnMessage ? "You" : (msg.sender_employee_id ? "Employee" : "Customer");

                return (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        isOwnMessage={isOwnMessage}
                        senderName={senderName}
                    />
                )
            })
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <MessageInput onSendMessage={handleSendMessage} />
    </section>
  );
};

export default ChatWindow;
