
import React from 'react';
import { ChatRoom } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
  isLoading: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ rooms, selectedRoom, onSelectRoom, isLoading }) => {
  return (
    <aside className="w-1/3 min-w-[250px] bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
      <header className="p-4 border-b dark:border-gray-800">
        <h2 className="text-xl font-bold font-clash">Chats</h2>
      </header>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-2 space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : rooms.length > 0 ? (
          <div className="p-2">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-colors mb-1',
                  selectedRoom?.id === room.id
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <p className="font-semibold truncate">{room.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  Click to view conversation
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No conversations yet.
          </div>
        )}
      </ScrollArea>
      <footer className="p-2 border-t dark:border-gray-800">
          <Button variant="ghost" className="w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
      </footer>
    </aside>
  );
};

export default ChatSidebar;
