
export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'support';
  created_by: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string | null;
  employee_id: string | null;
  joined_at: string;
  left_at: string | null;
  role: 'admin' | 'moderator' | 'member';
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string | null;
  sender_employee_id: string | null;
  message_text: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  reply_to_message_id: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatNotification {
  id: string;
  room_id: string;
  user_id: string | null;
  employee_id: string | null;
  message_id: string;
  is_read: boolean;
  created_at: string;
}

// Type casting functions to ensure proper types from database
export const castToChatRoom = (data: any): ChatRoom => ({
  ...data,
  type: data.type as 'direct' | 'group' | 'support',
  is_active: Boolean(data.is_active),
});

export const castToChatMessage = (data: any): ChatMessage => ({
  ...data,
  message_type: (data.message_type || 'text') as 'text' | 'image' | 'file' | 'system',
  is_edited: Boolean(data.is_edited),
  is_deleted: Boolean(data.is_deleted),
});

export const castToChatParticipant = (data: any): ChatParticipant => ({
  ...data,
  role: (data.role || 'member') as 'admin' | 'moderator' | 'member',
});
