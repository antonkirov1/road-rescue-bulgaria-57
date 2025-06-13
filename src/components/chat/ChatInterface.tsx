
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Plus, MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatRoom, ChatMessage } from '@/types/chat';
import { useTranslation } from '@/utils/translations';

interface ChatInterfaceProps {
  employeeId?: string;
  language: 'en' | 'bg';
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ employeeId, language, isOpen, onClose }) => {
  const t = useTranslation(language);
  const { rooms, messages, sendMessage, createRoom, fetchMessages, isLoading } = useChat(employeeId);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedRoom]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom, fetchMessages]);

  const handleSendMessage = async () => {
    if (!selectedRoom || !newMessage.trim()) return;

    await sendMessage(selectedRoom.id, newMessage.trim());
    setNewMessage('');
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    const room = await createRoom(newRoomName.trim(), 'group');
    if (room) {
      setSelectedRoom(room);
      setNewRoomName('');
      setShowNewRoomForm(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'bg' ? 'bg-BG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('chat')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex gap-4 overflow-hidden">
          {/* Rooms List */}
          <div className="w-1/3 border-r pr-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('chat-rooms')}</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowNewRoomForm(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {showNewRoomForm && (
              <div className="mb-4 space-y-2">
                <Input
                  placeholder={t('room-name')}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateRoom}>
                    {t('create')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowNewRoomForm(false)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <p className="text-muted-foreground text-sm">{t('loading')}...</p>
              ) : (
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom?.id === room.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate">{room.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {room.type}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                <div className="border-b pb-2 mb-4">
                  <h3 className="font-semibold">{selectedRoom.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoom.type === 'support' ? t('support-chat') : t('group-chat')}
                  </p>
                </div>

                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3 pr-4">
                    {(messages[selectedRoom.id] || []).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_employee_id === employeeId || (!employeeId && message.sender_id)
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_employee_id === employeeId || (!employeeId && message.sender_id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message_text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder={t('type-message')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>{t('select-room-to-start-chatting')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
