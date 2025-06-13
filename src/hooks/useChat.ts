
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom, ChatMessage, ChatNotification, castToChatRoom, castToChatMessage } from '@/types/chat';

export const useChat = (employeeId?: string) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<{ [roomId: string]: ChatMessage[] }>({});
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use refs to track channel instances and prevent multiple subscriptions
  const channelsRef = useRef<{
    rooms?: any;
    messages?: any;
    notifications?: any;
  }>({});
  const isSubscribedRef = useRef(false);

  // Fetch chat rooms
  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setRooms((data || []).map(castToChatRoom));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Fetch messages for a specific room
  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(prev => ({ 
        ...prev, 
        [roomId]: (data || []).map(castToChatMessage)
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (roomId: string, messageText: string) => {
    try {
      const messageData = {
        room_id: roomId,
        message_text: messageText,
        message_type: 'text' as const,
        ...(employeeId ? { sender_employee_id: employeeId } : { sender_id: (await supabase.auth.getUser()).data.user?.id })
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Create a new room
  const createRoom = async (name: string, type: 'direct' | 'group' | 'support') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert([{
          name,
          type,
          created_by: user.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Add creator as participant
      if (data) {
        await supabase
          .from('chat_participants')
          .insert([{
            room_id: data.id,
            ...(employeeId ? { employee_id: employeeId } : { user_id: user.user?.id }),
            role: 'admin'
          }]);
      }

      return data ? castToChatRoom(data) : null;
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    // Prevent multiple subscriptions
    if (isSubscribedRef.current) {
      return;
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchRooms();
      await fetchNotifications();
      setIsLoading(false);
    };

    loadInitialData();

    // Create unique channel names to avoid conflicts
    const roomChannelName = `chat-rooms-${employeeId || 'anonymous'}-${Date.now()}`;
    const messageChannelName = `chat-messages-${employeeId || 'anonymous'}-${Date.now()}`;
    const notificationChannelName = `chat-notifications-${employeeId || 'anonymous'}-${Date.now()}`;

    // Set up real-time subscriptions with unique channel names
    const roomsChannel = supabase
      .channel(roomChannelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, fetchRooms)
      .subscribe();

    const messagesChannel = supabase
      .channel(messageChannelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMessage = castToChatMessage(payload.new);
          setMessages(prev => ({
            ...prev,
            [newMessage.room_id]: [...(prev[newMessage.room_id] || []), newMessage]
          }));
        }
      })
      .subscribe();

    const notificationsChannel = supabase
      .channel(notificationChannelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_notifications' }, fetchNotifications)
      .subscribe();

    // Store channel references
    channelsRef.current = {
      rooms: roomsChannel,
      messages: messagesChannel,
      notifications: notificationsChannel
    };

    isSubscribedRef.current = true;

    return () => {
      // Clean up channels
      if (channelsRef.current.rooms) {
        supabase.removeChannel(channelsRef.current.rooms);
      }
      if (channelsRef.current.messages) {
        supabase.removeChannel(channelsRef.current.messages);
      }
      if (channelsRef.current.notifications) {
        supabase.removeChannel(channelsRef.current.notifications);
      }
      
      // Reset refs
      channelsRef.current = {};
      isSubscribedRef.current = false;
    };
  }, [employeeId]);

  return {
    rooms,
    messages,
    notifications,
    isLoading,
    fetchMessages,
    sendMessage,
    createRoom,
    markAsRead,
    unreadCount: notifications.length
  };
};
