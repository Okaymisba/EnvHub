export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      subscriptions: {
        Row: {
          card_brand: string | null
          card_last_four: string | null
          created_at: string | null
          email: string
          ends_at: string | null
          id: string
          is_paused: boolean | null
          is_usage_based: boolean | null
          lemon_squeezy_id: string
          name: string
          order_id: number | null
          price: string
          product_id: number
          product_name: string
          renews_at: string | null
          setup_fee: string | null
          status: string
          status_formatted: string
          subscription_item_id: number | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
          variant_id: number
          variant_name: string
        }
        Insert: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string | null
          email: string
          ends_at?: string | null
          id?: string
          is_paused?: boolean | null
          is_usage_based?: boolean | null
          lemon_squeezy_id: string
          name: string
          order_id?: number | null
          price: string
          product_id: number
          product_name: string
          renews_at?: string | null
          setup_fee?: string | null
          status: string
          status_formatted: string
          subscription_item_id?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
          variant_id: number
          variant_name: string
        }
        Update: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string | null
          email?: string
          ends_at?: string | null
          id?: string
          is_paused?: boolean | null
          is_usage_based?: boolean | null
          lemon_squeezy_id?: string
          name?: string
          order_id?: number | null
          price?: string
          product_id?: number
          product_name?: string
          renews_at?: string | null
          setup_fee?: string | null
          status?: string
          status_formatted?: string
          subscription_item_id?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
          variant_id?: number
          variant_name?: string
        }
        Relationships: []
      }
      contact: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          email: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          email: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_add_env_vars: {
        Args: {
          user_uuid: string
          project_uuid: string
          new_var_count?: number
        }
        Returns: boolean
      }
      can_user_create_project: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      can_user_invite: {
        Args: { user_uuid: string; project_uuid: string }
        Returns: boolean
      }
      get_project_version_count: {
        Args: { project_uuid: string }
        Returns: number
      }
      get_user_email: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_subscription_limits: {
        Args: { user_uuid: string }
        Returns: {
          plan: string
          max_projects: number
          max_env_vars_per_project: number
          max_team_members: number
          has_cli_access: boolean
        }[]
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
      project_role: ["owner", "admin", "user"],
    },
  },
} as const
