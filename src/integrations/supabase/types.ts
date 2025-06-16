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
          certificate_url: string | null
          course_id: string | null
          id: string
          issued_at: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          current_students: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_students: number | null
          name: string
          subscription_plan: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_students?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_students?: number | null
          name: string
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_students?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_students?: number | null
          name?: string
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          order_index: number
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          order_index: number
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_hours: number | null
          id: string
          instructor_id: string | null
          is_published: boolean | null
          price: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean | null
          price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean | null
          price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          likes_count: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          likes_count?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          likes_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          last_watched_at: string | null
          lesson_id: string | null
          user_id: string | null
          watch_time_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          last_watched_at?: string | null
          lesson_id?: string | null
          user_id?: string | null
          watch_time_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          last_watched_at?: string | null
          lesson_id?: string | null
          user_id?: string | null
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          module_id: string | null
          order_index: number
          resources: Json | null
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          module_id?: string | null
          order_index: number
          resources?: Json | null
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          module_id?: string | null
          order_index?: number
          resources?: Json | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number | null
          completed_at: string | null
          id: string
          passed: boolean | null
          quiz_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          attempt_number?: number | null
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          quiz_id?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          attempt_number?: number | null
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          quiz_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lesson_id: string | null
          max_attempts: number | null
          passing_score: number | null
          questions: Json
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          questions: Json
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          questions?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
