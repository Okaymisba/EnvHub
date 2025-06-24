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
      env_variables: {
        Row: {
          created_at: string
          env_name: string
          env_value_encrypted: string
          id: string
          nonce: string
          project_id: string
          salt: string
          tag: string
          version_id: string
        }
        Insert: {
          created_at?: string
          env_name: string
          env_value_encrypted: string
          id?: string
          nonce: string
          project_id: string
          salt: string
          tag: string
          version_id: string
        }
        Update: {
          created_at?: string
          env_name?: string
          env_value_encrypted?: string
          id?: string
          nonce?: string
          project_id?: string
          salt?: string
          tag?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "env_variables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "env_variables_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "env_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      env_versions: {
        Row: {
          created_at: string
          env_name: string | null
          env_value_encrypted: string | null
          id: string
          nonce: string
          project_id: string
          salt: string
          tag: string
          variable_count: number | null
          version_number: number
        }
        Insert: {
          created_at?: string
          env_name?: string | null
          env_value_encrypted?: string | null
          id?: string
          nonce: string
          project_id: string
          salt: string
          tag: string
          variable_count?: number | null
          version_number: number
        }
        Update: {
          created_at?: string
          env_name?: string | null
          env_value_encrypted?: string | null
          id?: string
          nonce?: string
          project_id?: string
          salt?: string
          tag?: string
          variable_count?: number | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "env_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_invitations: {
        Row: {
          accepted_at: string | null
          access_password_hash: string
          created_at: string
          encrypted_project_password: string
          expires_at: string
          id: string
          invited_email: string
          inviter_id: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
        }
        Insert: {
          accepted_at?: string | null
          access_password_hash: string
          created_at?: string
          encrypted_project_password: string
          expires_at?: string
          id?: string
          invited_email: string
          inviter_id: string
          project_id: string
          role?: Database["public"]["Enums"]["project_role"]
        }
        Update: {
          accepted_at?: string | null
          access_password_hash?: string
          created_at?: string
          encrypted_project_password?: string
          expires_at?: string
          id?: string
          invited_email?: string
          inviter_id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
        }
        Relationships: [
          {
            foreignKeyName: "project_invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          accepted_at: string | null
          access_password_hash: string | null
          created_at: string
          encrypted_project_password: string | null
          id: string
          invited_at: string
          invited_by: string | null
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          access_password_hash?: string | null
          created_at?: string
          encrypted_project_password?: string | null
          id?: string
          invited_at?: string
          invited_by?: string | null
          project_id: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          access_password_hash?: string | null
          created_at?: string
          encrypted_project_password?: string | null
          id?: string
          invited_at?: string
          invited_by?: string | null
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          password_hash: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          password_hash?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          password_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_project_version_count: {
        Args: { project_uuid: string }
        Returns: number
      }
      get_user_email: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_member_of_project: {
        Args: { _user_id: string; _project_id: string }
        Returns: boolean
      }
    }
    Enums: {
      project_role: "owner" | "admin" | "user"
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
    Enums: {
      project_role: ["owner", "admin", "user"],
    },
  },
} as const
