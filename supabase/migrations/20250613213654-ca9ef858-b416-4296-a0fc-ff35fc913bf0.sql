
-- Create chat_rooms table for organizing conversations
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'support')),
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create chat_participants table for managing room membership
CREATE TABLE public.chat_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  employee_id UUID REFERENCES public.employee_accounts(id),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  UNIQUE(room_id, user_id),
  UNIQUE(room_id, employee_id)
);

-- Create chat_messages table for storing messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users,
  sender_employee_id UUID REFERENCES public.employee_accounts(id),
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  reply_to_message_id UUID REFERENCES public.chat_messages(id),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_message_reactions table for message reactions
CREATE TABLE public.chat_message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  employee_id UUID REFERENCES public.employee_accounts(id),
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type),
  UNIQUE(message_id, employee_id, reaction_type)
);

-- Create chat_notifications table for managing notifications
CREATE TABLE public.chat_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  employee_id UUID REFERENCES public.employee_accounts(id),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_rooms
CREATE POLICY "Users can view rooms they participate in" 
  ON public.chat_rooms FOR SELECT 
  USING (
    id IN (
      SELECT room_id FROM public.chat_participants 
      WHERE user_id = auth.uid() OR employee_id IN (
        SELECT id FROM public.employee_accounts WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create rooms" 
  ON public.chat_rooms FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- Create RLS policies for chat_participants
CREATE POLICY "Users can view participants in their rooms" 
  ON public.chat_participants FOR SELECT 
  USING (
    room_id IN (
      SELECT room_id FROM public.chat_participants 
      WHERE user_id = auth.uid() OR employee_id IN (
        SELECT id FROM public.employee_accounts WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages in their rooms" 
  ON public.chat_messages FOR SELECT 
  USING (
    room_id IN (
      SELECT room_id FROM public.chat_participants 
      WHERE user_id = auth.uid() OR employee_id IN (
        SELECT id FROM public.employee_accounts WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can send messages to their rooms" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM public.chat_participants 
      WHERE user_id = auth.uid() OR employee_id IN (
        SELECT id FROM public.employee_accounts WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Create RLS policies for reactions
CREATE POLICY "Users can view reactions on messages they can see" 
  ON public.chat_message_reactions FOR SELECT 
  USING (
    message_id IN (
      SELECT id FROM public.chat_messages 
      WHERE room_id IN (
        SELECT room_id FROM public.chat_participants 
        WHERE user_id = auth.uid() OR employee_id IN (
          SELECT id FROM public.employee_accounts WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.chat_notifications FOR SELECT 
  USING (
    user_id = auth.uid() OR employee_id IN (
      SELECT id FROM public.employee_accounts WHERE auth_user_id = auth.uid()
    )
  );

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_rooms_updated_at 
  BEFORE UPDATE ON public.chat_rooms 
  FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON public.chat_messages 
  FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at_column();

-- Enable realtime for chat tables
ALTER TABLE public.chat_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;
ALTER TABLE public.chat_notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_notifications;
