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
      certificates: {
        Row: {
          course_id: number
          id: number
          issued_at: string | null
          user_id: number
          verification_code: string
        }
        Insert: {
          course_id: number
          id?: number
          issued_at?: string | null
          user_id: number
          verification_code: string
        }
        Update: {
          course_id?: number
          id?: number
          issued_at?: string | null
          user_id?: number
          verification_code?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          content: string
          course_id: number | null
          created_at: string | null
          id: number
          likes: number | null
          title: string
          user_id: number
        }
        Insert: {
          content: string
          course_id?: number | null
          created_at?: string | null
          id?: number
          likes?: number | null
          title: string
          user_id: number
        }
        Update: {
          content?: string
          course_id?: number | null
          created_at?: string | null
          id?: number
          likes?: number | null
          title?: string
          user_id?: number
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          max_seats: number
          name: string
          plan_id: number | null
          updated_at: string | null
          used_seats: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          max_seats?: number
          name: string
          plan_id?: number | null
          updated_at?: string | null
          used_seats?: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          max_seats?: number
          name?: string
          plan_id?: number | null
          updated_at?: string | null
          used_seats?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          id: number
          instructor: string | null
          is_published: boolean | null
          modules: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: number
          instructor?: string | null
          is_published?: boolean | null
          modules?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: number
          instructor?: string | null
          is_published?: boolean | null
          modules?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mentoring_sessions: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string | null
          duration: number | null
          id: number
          max_participants: number | null
          meeting_link: string | null
          mentor_id: number
          scheduled_at: string
          title: string
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration?: number | null
          id?: number
          max_participants?: number | null
          meeting_link?: string | null
          mentor_id: number
          scheduled_at: string
          title: string
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration?: number | null
          id?: number
          max_participants?: number | null
          meeting_link?: string | null
          mentor_id?: number
          scheduled_at?: string
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: number
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          answers: Json | null
          course_id: number
          created_at: string | null
          id: number
          lesson_index: number
          module_index: number
          score: number
          total_questions: number
          user_id: number
        }
        Insert: {
          answers?: Json | null
          course_id: number
          created_at?: string | null
          id?: number
          lesson_index: number
          module_index: number
          score: number
          total_questions: number
          user_id: number
        }
        Update: {
          answers?: Json | null
          course_id?: number
          created_at?: string | null
          id?: number
          lesson_index?: number
          module_index?: number
          score?: number
          total_questions?: number
          user_id?: number
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          description: string
          id: number
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          course_id: number
          created_at: string | null
          id: number
          last_watched_at: string | null
          lesson_id: number | null
          lesson_index: number | null
          module_index: number | null
          progress: number | null
          user_id: number
          watch_time: number | null
        }
        Insert: {
          completed?: boolean | null
          course_id: number
          created_at?: string | null
          id?: number
          last_watched_at?: string | null
          lesson_id?: number | null
          lesson_index?: number | null
          module_index?: number | null
          progress?: number | null
          user_id: number
          watch_time?: number | null
        }
        Update: {
          completed?: boolean | null
          course_id?: number
          created_at?: string | null
          id?: number
          last_watched_at?: string | null
          lesson_id?: number | null
          lesson_index?: number | null
          module_index?: number | null
          progress?: number | null
          user_id?: number
          watch_time?: number | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          badges: string[] | null
          id: number
          last_activity_at: string | null
          level: number | null
          streak: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          badges?: string[] | null
          id?: number
          last_activity_at?: string | null
          level?: number | null
          streak?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          badges?: string[] | null
          id?: number
          last_activity_at?: string | null
          level?: number | null
          streak?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          company_id: number | null
          created_at: string | null
          email: string
          id: number
          is_active: boolean | null
          name: string
          password: string
          role: string
          updated_at: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          name: string
          password: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          name?: string
          password?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
