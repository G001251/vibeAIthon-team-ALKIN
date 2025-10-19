export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ats_config: {
        Row: {
          created_at: string | null
          default_threshold: number | null
          id: string
          skills_keywords: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_threshold?: number | null
          id?: string
          skills_keywords?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_threshold?: number | null
          id?: string
          skills_keywords?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      candidates: {
        Row: {
          applied_date: string | null
          ats_score: number | null
          created_at: string | null
          current_ctc: number | null
          domain: string | null
          education: string | null
          education_score: number | null
          email: string
          expected_ctc: number | null
          experience_score: number | null
          experience_years: number | null
          graduation_year: number | null
          id: string
          institution: string | null
          location: string | null
          name: string
          overall_score: number | null
          phone: string | null
          positions: Json | null
          project_domains: string[] | null
          projects_score: number | null
          resume_text: string | null
          resume_url: string | null
          skills: string[] | null
          skills_score: number | null
          status: Database["public"]["Enums"]["candidate_status"] | null
        }
        Insert: {
          applied_date?: string | null
          ats_score?: number | null
          created_at?: string | null
          current_ctc?: number | null
          domain?: string | null
          education?: string | null
          education_score?: number | null
          email: string
          expected_ctc?: number | null
          experience_score?: number | null
          experience_years?: number | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          location?: string | null
          name: string
          overall_score?: number | null
          phone?: string | null
          positions?: Json | null
          project_domains?: string[] | null
          projects_score?: number | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: string[] | null
          skills_score?: number | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
        }
        Update: {
          applied_date?: string | null
          ats_score?: number | null
          created_at?: string | null
          current_ctc?: number | null
          domain?: string | null
          education?: string | null
          education_score?: number | null
          email?: string
          expected_ctc?: number | null
          experience_score?: number | null
          experience_years?: number | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          location?: string | null
          name?: string
          overall_score?: number | null
          phone?: string | null
          positions?: Json | null
          project_domains?: string[] | null
          projects_score?: number | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: string[] | null
          skills_score?: number | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_name: string
          created_at: string | null
          id: string
          locations: string[] | null
          logo_url: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string
          created_at?: string | null
          id?: string
          locations?: string[] | null
          logo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          id?: string
          locations?: string[] | null
          logo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          availability:
            | Database["public"]["Enums"]["employee_availability"]
            | null
          candidate_id: string | null
          created_at: string | null
          ctc: number
          current_project_id: string | null
          domain: string | null
          education: string | null
          email: string
          experience_years: number | null
          id: string
          joining_date: string | null
          location: string | null
          name: string
          performance_rating: number | null
          phone: string | null
          projects_completed: number | null
          skills: string[] | null
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["employee_availability"]
            | null
          candidate_id?: string | null
          created_at?: string | null
          ctc: number
          current_project_id?: string | null
          domain?: string | null
          education?: string | null
          email: string
          experience_years?: number | null
          id?: string
          joining_date?: string | null
          location?: string | null
          name: string
          performance_rating?: number | null
          phone?: string | null
          projects_completed?: number | null
          skills?: string[] | null
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["employee_availability"]
            | null
          candidate_id?: string | null
          created_at?: string | null
          ctc?: number
          current_project_id?: string | null
          domain?: string | null
          education?: string | null
          email?: string
          experience_years?: number | null
          id?: string
          joining_date?: string | null
          location?: string | null
          name?: string
          performance_rating?: number | null
          phone?: string | null
          projects_completed?: number | null
          skills?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_current_project"
            columns: ["current_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      project_assignments: {
        Row: {
          assigned_date: string | null
          employee_id: string
          id: string
          performance_notes: string | null
          project_id: string
          tasks_completed: number | null
        }
        Insert: {
          assigned_date?: string | null
          employee_id: string
          id?: string
          performance_notes?: string | null
          project_id: string
          tasks_completed?: number | null
        }
        Update: {
          assigned_date?: string | null
          employee_id?: string
          id?: string
          performance_notes?: string | null
          project_id?: string
          tasks_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_matches: {
        Row: {
          assigned_at: string | null
          availability_score: number | null
          candidate_id: string
          created_at: string | null
          domain_score: number | null
          education_score: number | null
          experience_score: number | null
          id: string
          match_score: number
          project_id: string
          skills_score: number | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          availability_score?: number | null
          candidate_id: string
          created_at?: string | null
          domain_score?: number | null
          education_score?: number | null
          experience_score?: number | null
          id?: string
          match_score?: number
          project_id: string
          skills_score?: number | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          availability_score?: number | null
          candidate_id?: string
          created_at?: string | null
          domain_score?: number | null
          education_score?: number | null
          experience_score?: number | null
          id?: string
          match_score?: number
          project_id?: string
          skills_score?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_matches_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          additional_notes: string | null
          budget_range: string | null
          client_name: string | null
          created_at: string | null
          description: string | null
          employees_assigned: number | null
          employees_needed: number | null
          end_date: string | null
          experience_level: string | null
          id: string
          location: string | null
          priority: string | null
          progress_percentage: number | null
          remote_type: string | null
          required_experience: number | null
          required_skills: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          team_size: number | null
          timeline: string | null
          title: string
          type: string | null
        }
        Insert: {
          additional_notes?: string | null
          budget_range?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          employees_assigned?: number | null
          employees_needed?: number | null
          end_date?: string | null
          experience_level?: string | null
          id?: string
          location?: string | null
          priority?: string | null
          progress_percentage?: number | null
          remote_type?: string | null
          required_experience?: number | null
          required_skills?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          team_size?: number | null
          timeline?: string | null
          title: string
          type?: string | null
        }
        Update: {
          additional_notes?: string | null
          budget_range?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          employees_assigned?: number | null
          employees_needed?: number | null
          end_date?: string | null
          experience_level?: string | null
          id?: string
          location?: string | null
          priority?: string | null
          progress_percentage?: number | null
          remote_type?: string | null
          required_experience?: number | null
          required_skills?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          team_size?: number | null
          timeline?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      salary_predictions: {
        Row: {
          company_size: string | null
          confidence: number | null
          created_at: string | null
          education: string | null
          experience_years: number | null
          id: string
          industry: string | null
          location: string | null
          predicted_ideal: number
          predicted_max: number
          predicted_min: number
          role: string
          skills: string[] | null
        }
        Insert: {
          company_size?: string | null
          confidence?: number | null
          created_at?: string | null
          education?: string | null
          experience_years?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          predicted_ideal: number
          predicted_max: number
          predicted_min: number
          role: string
          skills?: string[] | null
        }
        Update: {
          company_size?: string | null
          confidence?: number | null
          created_at?: string | null
          education?: string | null
          experience_years?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          predicted_ideal?: number
          predicted_max?: number
          predicted_min?: number
          role?: string
          skills?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr" | "team_lead" | "ceo" | "investor"
      candidate_status:
        | "new"
        | "shortlisted"
        | "interviewed"
        | "rejected"
        | "hired"
      employee_availability: "available" | "assigned" | "busy"
      project_status: "active" | "completed" | "on-hold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "hr", "team_lead", "ceo", "investor"],
      candidate_status: [
        "new",
        "shortlisted",
        "interviewed",
        "rejected",
        "hired",
      ],
      employee_availability: ["available", "assigned", "busy"],
      project_status: ["active", "completed", "on-hold"],
    },
  },
} as const
