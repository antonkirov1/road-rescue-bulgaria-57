export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_accounts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_builtin: boolean | null
          password_hash: string
          real_name: string | null
          status: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_builtin?: boolean | null
          password_hash: string
          real_name?: string | null
          status?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_builtin?: boolean | null
          password_hash?: string
          real_name?: string | null
          status?: string | null
          username?: string
        }
        Relationships: []
      }
      chat_message_reactions: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          message_id: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          message_id: string
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_reactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          message_text: string
          message_type: string | null
          reply_to_message_id: string | null
          room_id: string
          sender_employee_id: string | null
          sender_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_text: string
          message_type?: string | null
          reply_to_message_id?: string | null
          room_id: string
          sender_employee_id?: string | null
          sender_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_text?: string
          message_type?: string | null
          reply_to_message_id?: string | null
          room_id?: string
          sender_employee_id?: string | null
          sender_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_employee_id_fkey"
            columns: ["sender_employee_id"]
            isOneToOne: false
            referencedRelation: "employee_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_notifications: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          is_read: boolean | null
          message_id: string
          room_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          is_read?: boolean | null
          message_id: string
          room_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string
          room_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_notifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_notifications_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          employee_id: string | null
          id: string
          joined_at: string
          left_at: string | null
          role: string | null
          room_id: string
          user_id: string | null
        }
        Insert: {
          employee_id?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          role?: string | null
          room_id: string
          user_id?: string | null
        }
        Update: {
          employee_id?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          role?: string | null
          room_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_accounts: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          employee_role: string | null
          id: string
          is_available: boolean | null
          is_builtin: boolean | null
          is_simulated: boolean | null
          location: unknown | null
          password_hash: string | null
          phone_number: string | null
          real_name: string | null
          status: string | null
          username: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          employee_role?: string | null
          id?: string
          is_available?: boolean | null
          is_builtin?: boolean | null
          is_simulated?: boolean | null
          location?: unknown | null
          password_hash?: string | null
          phone_number?: string | null
          real_name?: string | null
          status?: string | null
          username: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          employee_role?: string | null
          id?: string
          is_available?: boolean | null
          is_builtin?: boolean | null
          is_simulated?: boolean | null
          location?: unknown | null
          password_hash?: string | null
          phone_number?: string | null
          real_name?: string | null
          status?: string | null
          username?: string
        }
        Relationships: []
      }
      employee_finished_requests: {
        Row: {
          created_at: string | null
          employee_id: string
          employee_username: string
          id: string
          request_id: string
          snapshot_id: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          employee_username: string
          id?: string
          request_id: string
          snapshot_id?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          employee_username?: string
          id?: string
          request_id?: string
          snapshot_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_finished_requests_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "price_quote_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_simulation: {
        Row: {
          created_at: string
          employee_number: number
          full_name: string
          id: number
        }
        Insert: {
          created_at?: string
          employee_number: number
          full_name: string
          id?: number
        }
        Update: {
          created_at?: string
          employee_number?: number
          full_name?: string
          id?: number
        }
        Relationships: []
      }
      price_quote_snapshots: {
        Row: {
          created_at: string | null
          employee_id: string | null
          employee_name: string
          id: string
          price_quote: number
          request_id: string
          service_fee: number
          service_type: string
          snapshot_data: Json
          status: string | null
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          employee_name: string
          id?: string
          price_quote: number
          request_id: string
          service_fee: number
          service_type: string
          snapshot_data: Json
          status?: string | null
          total_price: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          employee_name?: string
          id?: string
          price_quote?: number
          request_id?: string
          service_fee?: number
          service_type?: string
          snapshot_data?: Json
          status?: string | null
          total_price?: number
          user_id?: string
        }
        Relationships: []
      }
      price_ranges: {
        Row: {
          created_at: string | null
          id: string
          max_price: number
          min_price: number
          service_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_price: number
          min_price: number
          service_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_price?: number
          min_price?: number
          service_type?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          assigned_employee_id: string | null
          created_at: string | null
          decline_count: number | null
          description: string | null
          id: string
          price_quote: number | null
          revised_price_quote: number | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
          user_location: unknown | null
        }
        Insert: {
          assigned_employee_id?: string | null
          created_at?: string | null
          decline_count?: number | null
          description?: string | null
          id?: string
          price_quote?: number | null
          revised_price_quote?: number | null
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
          user_location?: unknown | null
        }
        Update: {
          assigned_employee_id?: string | null
          created_at?: string | null
          decline_count?: number | null
          description?: string | null
          id?: string
          price_quote?: number | null
          revised_price_quote?: number | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          user_location?: unknown | null
        }
        Relationships: []
      }
      simulated_employee_history: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      simulated_employees_blacklist: {
        Row: {
          created_at: string | null
          employee_name: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          employee_name: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          employee_name?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          bulgarian_text: string
          category: string | null
          context: string | null
          created_at: string
          english_text: string
          id: string
          key: string
          updated_at: string
        }
        Insert: {
          bulgarian_text: string
          category?: string | null
          context?: string | null
          created_at?: string
          english_text: string
          id?: string
          key: string
          updated_at?: string
        }
        Update: {
          bulgarian_text?: string
          category?: string | null
          context?: string | null
          created_at?: string
          english_text?: string
          id?: string
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          auth_user_id: string | null
          created_at: string
          created_by_admin: boolean | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          is_builtin: boolean | null
          migrated_from_new_accounts: string | null
          password_hash: string | null
          phone_number: string | null
          secret_answer_1: string | null
          secret_answer_2: string | null
          secret_question_1: string | null
          secret_question_2: string | null
          status: string | null
          username: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          created_by_admin?: boolean | null
          email: string
          full_name?: string | null
          gender?: string | null
          id?: string
          is_builtin?: boolean | null
          migrated_from_new_accounts?: string | null
          password_hash?: string | null
          phone_number?: string | null
          secret_answer_1?: string | null
          secret_answer_2?: string | null
          secret_question_1?: string | null
          secret_question_2?: string | null
          status?: string | null
          username: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          created_by_admin?: boolean | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          is_builtin?: boolean | null
          migrated_from_new_accounts?: string | null
          password_hash?: string | null
          phone_number?: string | null
          secret_answer_1?: string | null
          secret_answer_2?: string | null
          secret_question_1?: string | null
          secret_question_2?: string | null
          status?: string | null
          username?: string
        }
        Relationships: []
      }
      user_finished_requests: {
        Row: {
          created_at: string | null
          id: string
          request_id: string
          snapshot_id: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_id: string
          snapshot_id?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          request_id?: string
          snapshot_id?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_finished_requests_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "price_quote_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_history: {
        Row: {
          address_coordinates: unknown | null
          address_street: string | null
          completion_date: string
          created_at: string
          decline_reason: string | null
          employee_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          price_paid: number | null
          request_date: string
          service_fee: number | null
          service_type: string
          status: string
          total_price: number | null
          user_id: string
          username: string
        }
        Insert: {
          address_coordinates?: unknown | null
          address_street?: string | null
          completion_date?: string
          created_at?: string
          decline_reason?: string | null
          employee_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          price_paid?: number | null
          request_date: string
          service_fee?: number | null
          service_type: string
          status: string
          total_price?: number | null
          user_id: string
          username: string
        }
        Update: {
          address_coordinates?: unknown | null
          address_street?: string | null
          completion_date?: string
          created_at?: string
          decline_reason?: string | null
          employee_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          price_paid?: number | null
          request_date?: string
          service_fee?: number | null
          service_type?: string
          status?: string
          total_price?: number | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          id: string
          logout_timer_active: boolean | null
          session_start: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logout_timer_active?: boolean | null
          session_start?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logout_timer_active?: boolean | null
          session_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          ban_count: number | null
          banned_until: string | null
          created_at: string | null
          email: string | null
          id: string
          location: unknown | null
          name: string | null
          username: string
        }
        Insert: {
          ban_count?: number | null
          banned_until?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: unknown | null
          name?: string | null
          username: string
        }
        Update: {
          ban_count?: number | null
          banned_until?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: unknown | null
          name?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_employee_account: {
        Args: {
          p_username: string
          p_email: string
          p_phone_number?: string
          p_employee_role?: string
          p_real_name?: string
        }
        Returns: string
      }
      generate_price_quote: {
        Args: { service_type: string }
        Returns: number
      }
      is_valid_price: {
        Args: { service_type: string; price: number }
        Returns: boolean
      }
      migrate_new_user_to_existing: {
        Args: { user_record_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
