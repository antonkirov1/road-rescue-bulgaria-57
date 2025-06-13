
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Plus } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useTranslation } from '@/utils/translations';
import { ChatRoom, castToChatRoom } from '@/types/chat';

interface ChatInterfaceProps {
  employeeId?: string;
  language: 'en' | 'bg';
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  employeeId, 
  language, 
  isOpen, 
  onClose 
}) => {
  const t = useTranslation(language);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'direct' | 'group' | 'support'>('group');

  const {
    rooms,
    messages,
    isLoading,
    fetchMessages,
    sendMessage,
    createRoom
  } = useChat(employeeId);

  if (!isOpen) return null;

  const handleRoomSelect = async (room: ChatRoom) => {
    setSelectedRoom(room);
    await fetchMessages(room.id);
  };

  const handleSendMessage = async () => {
    if (!selectedRoom || !newMessage.trim()) return;

    await sendMessage(selectedRoom.id, newMessage);
    setNewMessage('');
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    const newRoom = await createRoom(newRoomName, newRoomType);
    if (newRoom) {
      setSelectedRoom(castToChatRoom(newRoom));
      setShowNewRoomForm(false);
      setNewRoomName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('chat')}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex gap-4 p-4">
          {/* Rooms List */}
          <div className="w-1/3 border-r pr-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('chat-rooms')}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewRoomForm(!showNewRoomForm)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showNewRoomForm && (
              <div className="mb-4 p-3 border rounded">
                <Input
                  placeholder={t('room-name')}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="mb-2"
                />
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as 'direct' | 'group' | 'support')}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="group">{t('group')}</option>
                  <option value="support">{t('support')}</option>
                  <option value="direct">{t('direct')}</option>
                </select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateRoom}>
                    {t('create')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowNewRoomForm(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-64">
              {isLoading ? (
                <div className="text-center py-4">{t('loading')}</div>
              ) : (
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-3 rounded cursor-pointer ${
                        selectedRoom?.id === room.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleRoomSelect(room)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{room.name}</span>
                        <Badge variant="outline">{t(room.type)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                <div className="border-b pb-2 mb-4">
                  <h3 className="font-semibold">{selectedRoom.name}</h3>
                  <Badge variant="outline">{t(selectedRoom.type)}</Badge>
                </div>

                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {messages[selectedRoom.id]?.length ? (
                      messages[selectedRoom.id].map((message) => (
                        <div key={message.id} className="p-3 border rounded">
                          <div className="text-sm text-gray-500 mb-1">
                            {message.sender_employee_id ? 'Employee' : 'User'} • {new Date(message.created_at).toLocaleTimeString()}
                          </div>
                          <div>{message.message_text}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        {t('no-messages')}
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder={t('type-message')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                {t('select-room-to-start-chatting')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
