
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useChat } from '@/hooks/useChat';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { ChatRoom } from '@/types/chat';

interface ChatInterfaceProps {
  employeeId?: string;
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bg';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ employeeId, isOpen, onClose }) => {
  const { rooms, isLoading } = useChat(employeeId);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  // Select the first room by default when the component opens
  React.useEffect(() => {
    if (isOpen && !selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    }
  }, [isOpen, rooms, selectedRoom]);

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setSelectedRoom(null); // Reset selected room on close
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0">
        <div className="flex h-full">
          <ChatSidebar
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={handleSelectRoom}
            isLoading={isLoading}
          />
          <ChatWindow
            room={selectedRoom}
            employeeId={employeeId}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatInterface;
