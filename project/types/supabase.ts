export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          deleted_at: string | null
          description: string | null
          id: string
          new_value: Json | null
          previous_value: Json | null
          related_id: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
          related_id?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
          related_id?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          deleted_at: string | null
          feature_toggle: Json | null
          id: string
          preference_data: Json
          preference_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          deleted_at?: string | null
          feature_toggle?: Json | null
          id?: string
          preference_data: Json
          preference_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          deleted_at?: string | null
          feature_toggle?: Json | null
          id?: string
          preference_data?: Json
          preference_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          related_id: string | null
          related_table: string | null
          updated_at: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          related_id?: string | null
          related_table?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          related_id?: string | null
          related_table?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          archived_action: boolean | null
          archived_reason: string | null
          changed_data: Json | null
          created_at: string | null
          deleted_at: string | null
          error_id: string | null
          id: string
          operation: string | null
          record_id: string
          table_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived_action?: boolean | null
          archived_reason?: string | null
          changed_data?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          error_id?: string | null
          id?: string
          operation?: string | null
          record_id: string
          table_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived_action?: boolean | null
          archived_reason?: string | null
          changed_data?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          error_id?: string | null
          id?: string
          operation?: string | null
          record_id?: string
          table_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_error_id_fkey"
            columns: ["error_id"]
            isOneToOne: false
            referencedRelation: "error_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_trail: {
        Row: {
          deleted_at: string | null
          details: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: string
          record_id: string
          table_name: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          deleted_at?: string | null
          details?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          record_id: string
          table_name: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          deleted_at?: string | null
          details?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      automation_actions: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string | null
          deleted_at: string | null
          execution_order: number | null
          id: string
          is_active: boolean | null
          rule_id: string | null
          updated_at: string | null
        }
        Insert: {
          action_config: Json
          action_type: string
          created_at?: string | null
          deleted_at?: string | null
          execution_order?: number | null
          id?: string
          is_active?: boolean | null
          rule_id?: string | null
          updated_at?: string | null
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string | null
          deleted_at?: string | null
          execution_order?: number | null
          id?: string
          is_active?: boolean | null
          rule_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_actions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          action_id: string | null
          created_at: string | null
          error_message: string | null
          execution_details: Json | null
          execution_status: string
          execution_time: string | null
          id: string
          rule_id: string | null
        }
        Insert: {
          action_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_details?: Json | null
          execution_status: string
          execution_time?: string | null
          id?: string
          rule_id?: string | null
        }
        Update: {
          action_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_details?: Json | null
          execution_status?: string
          execution_time?: string | null
          id?: string
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "automation_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          trigger_conditions: Json
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          trigger_conditions: Json
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cgp_cif: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          groupement_id: string | null
          id: string
          personne_morale_id: string | null
          representant_id: string | null
          sort: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          groupement_id?: string | null
          id?: string
          personne_morale_id?: string | null
          representant_id?: string | null
          sort?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          groupement_id?: string | null
          id?: string
          personne_morale_id?: string | null
          representant_id?: string | null
          sort?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cgp_cif_groupement_id_fkey"
            columns: ["groupement_id"]
            isOneToOne: false
            referencedRelation: "regroupement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cgp_cif_personne_morale_id_fkey"
            columns: ["personne_morale_id"]
            isOneToOne: false
            referencedRelation: "personne_morale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cgp_cif_representant_id_fkey"
            columns: ["representant_id"]
            isOneToOne: false
            referencedRelation: "representant"
            referencedColumns: ["id"]
          },
        ]
      }
      cgp_clients: {
        Row: {
          cgp_id: string
          client_id: string
          deleted_at: string | null
          id: string
        }
        Insert: {
          cgp_id: string
          client_id: string
          deleted_at?: string | null
          id?: string
        }
        Update: {
          cgp_id?: string
          client_id?: string
          deleted_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cgp_clients_cgp_id_fkey"
            columns: ["cgp_id"]
            isOneToOne: false
            referencedRelation: "cgp_cif"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cgp_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cgp_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cgp_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cgp_clients_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cgp_clients_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cgp_clients_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      client_declarations: {
        Row: {
          aml_information: boolean | null
          answers_accuracy: boolean | null
          client_id: string
          created_at: string | null
          der_reception: boolean | null
          dic_reception: boolean | null
          id: string
          information_commitment: boolean | null
          risk_report_reception: boolean | null
          signature_date: string | null
          signature_place: string | null
          updated_at: string | null
        }
        Insert: {
          aml_information?: boolean | null
          answers_accuracy?: boolean | null
          client_id: string
          created_at?: string | null
          der_reception?: boolean | null
          dic_reception?: boolean | null
          id?: string
          information_commitment?: boolean | null
          risk_report_reception?: boolean | null
          signature_date?: string | null
          signature_place?: string | null
          updated_at?: string | null
        }
        Update: {
          aml_information?: boolean | null
          answers_accuracy?: boolean | null
          client_id?: string
          created_at?: string | null
          der_reception?: boolean | null
          dic_reception?: boolean | null
          id?: string
          information_commitment?: boolean | null
          risk_report_reception?: boolean | null
          signature_date?: string | null
          signature_place?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_declarations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_declarations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_declarations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          bank_details: string | null
          client_id: string
          created_at: string | null
          id: string
          identity_card: string | null
          income_declaration: string | null
          proof_of_address: string | null
          tax_notice: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          bank_details?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          identity_card?: string | null
          income_declaration?: string | null
          proof_of_address?: string | null
          tax_notice?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          bank_details?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          identity_card?: string | null
          income_declaration?: string | null
          proof_of_address?: string | null
          tax_notice?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      client_employee_links: {
        Row: {
          client_id: string
          deleted_at: string | null
          employee_id: string
          id: string
          relationship_type_id: string
        }
        Insert: {
          client_id: string
          deleted_at?: string | null
          employee_id: string
          id?: string
          relationship_type_id: string
        }
        Update: {
          client_id?: string
          deleted_at?: string | null
          employee_id?: string
          id?: string
          relationship_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_employee_links_relationship_type_id_fkey"
            columns: ["relationship_type_id"]
            isOneToOne: false
            referencedRelation: "relationship_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_employee_links_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_employee_links_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_employee_links_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      client_fees: {
        Row: {
          amount: number
          applied_on: string | null
          client_id: string | null
          fee_type: string
          id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          amount: number
          applied_on?: string | null
          client_id?: string | null
          fee_type: string
          id?: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          applied_on?: string | null
          client_id?: string | null
          fee_type?: string
          id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_fees_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_fees_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_fees_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portfolio_managers: {
        Row: {
          client_id: string
          deleted_at: string | null
          end_date: string | null
          id: string
          portfolio_manager_id: string
          start_date: string | null
        }
        Insert: {
          client_id: string
          deleted_at?: string | null
          end_date?: string | null
          id?: string
          portfolio_manager_id: string
          start_date?: string | null
        }
        Update: {
          client_id?: string
          deleted_at?: string | null
          end_date?: string | null
          id?: string
          portfolio_manager_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_portfolio_managers_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_portfolio_managers_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_portfolio_managers_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portfolios: {
        Row: {
          client_id: string
          deleted_at: string | null
          id: string
          last_updated: string | null
          total_deposits: number | null
          total_withdrawals: number | null
          valuation: number
        }
        Insert: {
          client_id: string
          deleted_at?: string | null
          id?: string
          last_updated?: string | null
          total_deposits?: number | null
          total_withdrawals?: number | null
          valuation: number
        }
        Update: {
          client_id?: string
          deleted_at?: string | null
          id?: string
          last_updated?: string | null
          total_deposits?: number | null
          total_withdrawals?: number | null
          valuation?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_portfolios_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_portfolios_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_portfolios_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          approved_at: string | null
          cgp_cif_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          onboarding_status_id: string | null
          person_type: Database["public"]["Enums"]["person_type"] | null
          personne_morale_id: string | null
          reclamations_count: number | null
          shareable_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          cgp_cif_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          onboarding_status_id?: string | null
          person_type?: Database["public"]["Enums"]["person_type"] | null
          personne_morale_id?: string | null
          reclamations_count?: number | null
          shareable_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          cgp_cif_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          onboarding_status_id?: string | null
          person_type?: Database["public"]["Enums"]["person_type"] | null
          personne_morale_id?: string | null
          reclamations_count?: number | null
          shareable_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_cgp_cif_id_fkey"
            columns: ["cgp_cif_id"]
            isOneToOne: false
            referencedRelation: "cgp_cif"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_onboarding_status_id_fkey"
            columns: ["onboarding_status_id"]
            isOneToOne: false
            referencedRelation: "onboarding_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_clients_personne_morale_id"
            columns: ["personne_morale_id"]
            isOneToOne: false
            referencedRelation: "personne_morale"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          communication_id: string
          created_at: string | null
          deleted_at: string | null
          details: Json | null
          executed_at: string | null
          failure_reason: string | null
          id: string
          log_type: string
          retry_attempt: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          communication_id: string
          created_at?: string | null
          deleted_at?: string | null
          details?: Json | null
          executed_at?: string | null
          failure_reason?: string | null
          id?: string
          log_type: string
          retry_attempt?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          communication_id?: string
          created_at?: string | null
          deleted_at?: string | null
          details?: Json | null
          executed_at?: string | null
          failure_reason?: string | null
          id?: string
          log_type?: string
          retry_attempt?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_preferences_overrides: {
        Row: {
          communication_type: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          id: string
          override_type: string
          override_value: Json
          reason: string | null
          updated_at: string | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          communication_type: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          override_type: string
          override_value: Json
          reason?: string | null
          updated_at?: string | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          communication_type?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          override_type?: string
          override_value?: Json
          reason?: string | null
          updated_at?: string | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      communication_templates: {
        Row: {
          communication_type: string
          content: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          dynamic_fields: Json | null
          id: string
          is_validated: boolean | null
          language_code: string
          placeholder_map: Json | null
          preview_data: Json | null
          subject: string
          template_name: string
          updated_at: string | null
        }
        Insert: {
          communication_type: string
          content: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          dynamic_fields?: Json | null
          id?: string
          is_validated?: boolean | null
          language_code?: string
          placeholder_map?: Json | null
          preview_data?: Json | null
          subject: string
          template_name: string
          updated_at?: string | null
        }
        Update: {
          communication_type?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          dynamic_fields?: Json | null
          id?: string
          is_validated?: boolean | null
          language_code?: string
          placeholder_map?: Json | null
          preview_data?: Json | null
          subject?: string
          template_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          communication_type: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          recipient_id: string
          related_id: string | null
          sender_id: string
          sent_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          communication_type: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          recipient_id: string
          related_id?: string | null
          sender_id: string
          sent_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          communication_type?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          recipient_id?: string
          related_id?: string | null
          sender_id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          client_id: string
          compliance_score_id: string
          id: string
          log_type: string | null
          new_risk_category: string
          new_score: number
          old_risk_category: string
          old_score: number
          related_error_id: string | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          client_id: string
          compliance_score_id: string
          id?: string
          log_type?: string | null
          new_risk_category: string
          new_score: number
          old_risk_category: string
          old_score: number
          related_error_id?: string | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          client_id?: string
          compliance_score_id?: string
          id?: string
          log_type?: string | null
          new_risk_category?: string
          new_score?: number
          old_risk_category?: string
          old_score?: number
          related_error_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_history_compliance_score_id_fkey"
            columns: ["compliance_score_id"]
            isOneToOne: false
            referencedRelation: "compliance_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_history_related_error_id_fkey"
            columns: ["related_error_id"]
            isOneToOne: false
            referencedRelation: "error_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_compliance_history_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_compliance_history_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_compliance_history_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_scores: {
        Row: {
          adjustment_reason: string | null
          client_id: string
          compliance_score: number
          deleted_at: string | null
          id: string
          last_reviewed: string | null
          manual_adjustment: boolean | null
          risk_category: string
          updated_at: string | null
        }
        Insert: {
          adjustment_reason?: string | null
          client_id: string
          compliance_score: number
          deleted_at?: string | null
          id?: string
          last_reviewed?: string | null
          manual_adjustment?: boolean | null
          risk_category: string
          updated_at?: string | null
        }
        Update: {
          adjustment_reason?: string | null
          client_id?: string
          compliance_score?: number
          deleted_at?: string | null
          id?: string
          last_reviewed?: string | null
          manual_adjustment?: boolean | null
          risk_category?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_compliance_scores_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_compliance_scores_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_compliance_scores_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          country_name: string
          created_at: string | null
          deleted_at: string | null
          id: string
          nationality: string | null
          nature_of_risk: string | null
          risk_level_id: string
          sort: number | null
          sources: string | null
          updated_at: string | null
        }
        Insert: {
          country_name: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nationality?: string | null
          nature_of_risk?: string | null
          risk_level_id: string
          sort?: number | null
          sources?: string | null
          updated_at?: string | null
        }
        Update: {
          country_name?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nationality?: string | null
          nature_of_risk?: string | null
          risk_level_id?: string
          sort?: number | null
          sources?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "countries_risk_level_id_fkey"
            columns: ["risk_level_id"]
            isOneToOne: false
            referencedRelation: "risk_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          address: Json | null
          assigned_to: string | null
          company: string | null
          contact_type: string
          created_at: string | null
          custom_fields: Json | null
          deleted_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_contact_date: string | null
          last_name: string | null
          next_follow_up: string | null
          phone: string | null
          position: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          assigned_to?: string | null
          company?: string | null
          contact_type: string
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          next_follow_up?: string | null
          phone?: string | null
          position?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          assigned_to?: string | null
          company?: string | null
          contact_type?: string
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          next_follow_up?: string | null
          phone?: string | null
          position?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      crm_interactions: {
        Row: {
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          duration: unknown | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          interaction_date: string | null
          interaction_type: string
          location: string | null
          notes: string | null
          outcome: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          duration?: unknown | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          interaction_date?: string | null
          interaction_type: string
          location?: string | null
          notes?: string | null
          outcome?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          duration?: unknown | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string
          location?: string | null
          notes?: string | null
          outcome?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_notes: {
        Row: {
          contact_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          id: string
          is_private: boolean | null
          note_type: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_reminders: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          notification_sent: boolean | null
          notification_time: string | null
          reminder_time: string
          reminder_type: string
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notification_sent?: boolean | null
          notification_time?: string | null
          reminder_time: string
          reminder_type: string
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notification_sent?: boolean | null
          notification_time?: string | null
          reminder_time?: string
          reminder_type?: string
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_reminders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reminders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_with_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_asset_metrics: {
        Row: {
          associated_risks: string | null
          co2_per_transaction: string | null
          consensus_mechanism: string | null
          consumption_data: string | null
          consumption_over_500000kwh: boolean | null
          crypto_id: string
          does_asset_promote_anonymity: string | null
          known_for: string | null
          known_team_experience: string | null
          kyc_and_lcbft: string | null
          number_of_assets: string | null
          other_information: string | null
          real_world_utility: string | null
          sensitive_information_protection: string | null
          smart_contract_or_blockchain: string | null
          total_kwh_by_transaction: string | null
          transaction_data: string | null
        }
        Insert: {
          associated_risks?: string | null
          co2_per_transaction?: string | null
          consensus_mechanism?: string | null
          consumption_data?: string | null
          consumption_over_500000kwh?: boolean | null
          crypto_id: string
          does_asset_promote_anonymity?: string | null
          known_for?: string | null
          known_team_experience?: string | null
          kyc_and_lcbft?: string | null
          number_of_assets?: string | null
          other_information?: string | null
          real_world_utility?: string | null
          sensitive_information_protection?: string | null
          smart_contract_or_blockchain?: string | null
          total_kwh_by_transaction?: string | null
          transaction_data?: string | null
        }
        Update: {
          associated_risks?: string | null
          co2_per_transaction?: string | null
          consensus_mechanism?: string | null
          consumption_data?: string | null
          consumption_over_500000kwh?: boolean | null
          crypto_id?: string
          does_asset_promote_anonymity?: string | null
          known_for?: string | null
          known_team_experience?: string | null
          kyc_and_lcbft?: string | null
          number_of_assets?: string | null
          other_information?: string | null
          real_world_utility?: string | null
          sensitive_information_protection?: string | null
          smart_contract_or_blockchain?: string | null
          total_kwh_by_transaction?: string | null
          transaction_data?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_asset_metrics_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: true
            referencedRelation: "crypto_general_info"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_esg_aspects: {
        Row: {
          clear_governance: boolean | null
          clear_governance_information: string | null
          crypto_id: string
          environmental: boolean | null
          formatted_esg: string | null
          information_on_environmental_protection: string | null
          social_action_description: string | null
          social_actions: boolean | null
        }
        Insert: {
          clear_governance?: boolean | null
          clear_governance_information?: string | null
          crypto_id: string
          environmental?: boolean | null
          formatted_esg?: string | null
          information_on_environmental_protection?: string | null
          social_action_description?: string | null
          social_actions?: boolean | null
        }
        Update: {
          clear_governance?: boolean | null
          clear_governance_information?: string | null
          crypto_id?: string
          environmental?: boolean | null
          formatted_esg?: string | null
          information_on_environmental_protection?: string | null
          social_action_description?: string | null
          social_actions?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_esg_aspects_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: true
            referencedRelation: "crypto_general_info"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_financial_performance: {
        Row: {
          crypto_id: string
          financial_informations_and_performance: string | null
          liquidity_over_200m: boolean | null
          pca_protocol: string | null
          potential_profits: number | null
          risk_evaluation: string | null
          risk_level: number | null
          total_score: number | null
        }
        Insert: {
          crypto_id: string
          financial_informations_and_performance?: string | null
          liquidity_over_200m?: boolean | null
          pca_protocol?: string | null
          potential_profits?: number | null
          risk_evaluation?: string | null
          risk_level?: number | null
          total_score?: number | null
        }
        Update: {
          crypto_id?: string
          financial_informations_and_performance?: string | null
          liquidity_over_200m?: boolean | null
          pca_protocol?: string | null
          potential_profits?: number | null
          risk_evaluation?: string | null
          risk_level?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_financial_performance_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: true
            referencedRelation: "crypto_general_info"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_general_info: {
        Row: {
          additional_informations: string | null
          asset_identification: string | null
          competitors: string | null
          date_created: string | null
          date_updated: string | null
          description_of_business_model: string | null
          icon: string | null
          id: string
          information_on_inflation_protection: string | null
          name_and_symbol: string
          older_than_two_years: string | null
          project_started_date: string | null
          protection_against_inflation: string | null
          sort: number
          user_created: string | null
          user_updated: string | null
        }
        Insert: {
          additional_informations?: string | null
          asset_identification?: string | null
          competitors?: string | null
          date_created?: string | null
          date_updated?: string | null
          description_of_business_model?: string | null
          icon?: string | null
          id?: string
          information_on_inflation_protection?: string | null
          name_and_symbol: string
          older_than_two_years?: string | null
          project_started_date?: string | null
          protection_against_inflation?: string | null
          sort: number
          user_created?: string | null
          user_updated?: string | null
        }
        Update: {
          additional_informations?: string | null
          asset_identification?: string | null
          competitors?: string | null
          date_created?: string | null
          date_updated?: string | null
          description_of_business_model?: string | null
          icon?: string | null
          id?: string
          information_on_inflation_protection?: string | null
          name_and_symbol?: string
          older_than_two_years?: string | null
          project_started_date?: string | null
          protection_against_inflation?: string | null
          sort?: number
          user_created?: string | null
          user_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_general_info_icon_fkey"
            columns: ["icon"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      email_analytics: {
        Row: {
          bounced: boolean | null
          clicked_at: string | null
          created_at: string | null
          device_type: string | null
          email_id: string | null
          id: string
          opened_at: string | null
          recipient_id: string | null
          region: string | null
        }
        Insert: {
          bounced?: boolean | null
          clicked_at?: string | null
          created_at?: string | null
          device_type?: string | null
          email_id?: string | null
          id?: string
          opened_at?: string | null
          recipient_id?: string | null
          region?: string | null
        }
        Update: {
          bounced?: boolean | null
          clicked_at?: string | null
          created_at?: string | null
          device_type?: string | null
          email_id?: string | null
          id?: string
          opened_at?: string | null
          recipient_id?: string | null
          region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_analytics_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_history: {
        Row: {
          deleted_at: string | null
          email_id: string | null
          id: string
          recipient_id: string | null
          sent_at: string | null
        }
        Insert: {
          deleted_at?: string | null
          email_id?: string | null
          id?: string
          recipient_id?: string | null
          sent_at?: string | null
        }
        Update: {
          deleted_at?: string | null
          email_id?: string | null
          id?: string
          recipient_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_history_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_metrics: {
        Row: {
          bounce_rate: number | null
          click_rate: number | null
          email_id: string | null
          id: string
          last_updated: string | null
          open_rate: number | null
          total_recipients: number | null
        }
        Insert: {
          bounce_rate?: number | null
          click_rate?: number | null
          email_id?: string | null
          id?: string
          last_updated?: string | null
          open_rate?: number | null
          total_recipients?: number | null
        }
        Update: {
          bounce_rate?: number | null
          click_rate?: number | null
          email_id?: string | null
          id?: string
          last_updated?: string | null
          open_rate?: number | null
          total_recipients?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_metrics_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          analytics_id: string | null
          content: string
          created_by: string | null
          deleted_at: string | null
          id: string
          recipient_filters: Json | null
          recipient_ids: Json
          sent_at: string | null
          subject: string
          type: string
        }
        Insert: {
          analytics_id?: string | null
          content: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          recipient_filters?: Json | null
          recipient_ids: Json
          sent_at?: string | null
          subject: string
          type: string
        }
        Update: {
          analytics_id?: string | null
          content?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          recipient_filters?: Json | null
          recipient_ids?: Json
          sent_at?: string | null
          subject?: string
          type?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          deleted_at: string | null
          description: string
          error_type: string
          id: string
          log_type: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          error_type: string
          id?: string
          log_type?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          error_type?: string
          id?: string
          log_type?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_triggers: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          event_name: string
          id: string
          quarterly_report_id: string | null
          recurring: boolean | null
          trigger_conditions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          event_name: string
          id?: string
          quarterly_report_id?: string | null
          recurring?: boolean | null
          trigger_conditions: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          event_name?: string
          id?: string
          quarterly_report_id?: string | null
          recurring?: boolean | null
          trigger_conditions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_triggers_quarterly_report_id_fkey"
            columns: ["quarterly_report_id"]
            isOneToOne: false
            referencedRelation: "quarterly_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          category: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          end_time: string | null
          event_type_id: string | null
          id: string
          location: string | null
          metadata: Json | null
          priority: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          priority?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          priority?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      family_situations: {
        Row: {
          civil_solidarity_pact_contract: string | null
          civil_solidarity_pact_date: string | null
          civil_solidarity_pact_regime: string | null
          client_id: string | null
          created_at: string | null
          dependent_children: number | null
          divorce_date: string | null
          id: string
          marital_status: string | null
          marriage_date: string | null
          number_of_children: number | null
          updated_at: string | null
        }
        Insert: {
          civil_solidarity_pact_contract?: string | null
          civil_solidarity_pact_date?: string | null
          civil_solidarity_pact_regime?: string | null
          client_id?: string | null
          created_at?: string | null
          dependent_children?: number | null
          divorce_date?: string | null
          id?: string
          marital_status?: string | null
          marriage_date?: string | null
          number_of_children?: number | null
          updated_at?: string | null
        }
        Update: {
          civil_solidarity_pact_contract?: string | null
          civil_solidarity_pact_date?: string | null
          civil_solidarity_pact_regime?: string | null
          client_id?: string | null
          created_at?: string | null
          dependent_children?: number | null
          divorce_date?: string | null
          id?: string
          marital_status?: string | null
          marriage_date?: string | null
          number_of_children?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_situations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_situations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_situations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_family_situations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_family_situations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_family_situations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_info: {
        Row: {
          annual_income: number | null
          client_id: string | null
          created_at: string | null
          debt_details: string | null
          debts_or_loans: boolean | null
          deleted_at: string | null
          detailed_assets: string | null
          estimated_assets: number | null
          id: string
          income_source_id: string | null
          updated_at: string | null
        }
        Insert: {
          annual_income?: number | null
          client_id?: string | null
          created_at?: string | null
          debt_details?: string | null
          debts_or_loans?: boolean | null
          deleted_at?: string | null
          detailed_assets?: string | null
          estimated_assets?: number | null
          id?: string
          income_source_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_income?: number | null
          client_id?: string | null
          created_at?: string | null
          debt_details?: string | null
          debts_or_loans?: boolean | null
          deleted_at?: string | null
          detailed_assets?: string | null
          estimated_assets?: number | null
          id?: string
          income_source_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_info_income_source_id_fkey"
            columns: ["income_source_id"]
            isOneToOne: false
            referencedRelation: "income_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_financial_info_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_financial_info_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_financial_info_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_content: {
        Row: {
          content: string | null
          created_at: string | null
          deleted_at: string | null
          file_url: string | null
          id: string
          language_code: string
          seo_id: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          file_url?: string | null
          id?: string
          language_code?: string
          seo_id?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          file_url?: string | null
          id?: string
          language_code?: string
          seo_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "footer_content_seo_id_fkey"
            columns: ["seo_id"]
            isOneToOne: false
            referencedRelation: "seo_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      income_sources: {
        Row: {
          deleted_at: string | null
          id: string
          name: string
          risk_level_id: string | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          name: string
          risk_level_id?: string | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          name?: string
          risk_level_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_sources_risk_level_id_fkey"
            columns: ["risk_level_id"]
            isOneToOne: false
            referencedRelation: "risk_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_profiles: {
        Row: {
          acceptable_loss: string | null
          client_id: string
          created_at: string | null
          crypto_risks_acceptance: boolean | null
          deleted_at: string | null
          desired_return: string | null
          exclusion_criteria: string | null
          id: string
          investment_horizon: string | null
          main_objective: string | null
          objective_types: Json | null
          objectives: string | null
          related_service: Database["public"]["Enums"]["service_type"] | null
          risk_appetite: string | null
          updated_at: string | null
        }
        Insert: {
          acceptable_loss?: string | null
          client_id: string
          created_at?: string | null
          crypto_risks_acceptance?: boolean | null
          deleted_at?: string | null
          desired_return?: string | null
          exclusion_criteria?: string | null
          id?: string
          investment_horizon?: string | null
          main_objective?: string | null
          objective_types?: Json | null
          objectives?: string | null
          related_service?: Database["public"]["Enums"]["service_type"] | null
          risk_appetite?: string | null
          updated_at?: string | null
        }
        Update: {
          acceptable_loss?: string | null
          client_id?: string
          created_at?: string | null
          crypto_risks_acceptance?: boolean | null
          deleted_at?: string | null
          desired_return?: string | null
          exclusion_criteria?: string | null
          id?: string
          investment_horizon?: string | null
          main_objective?: string | null
          objective_types?: Json | null
          objectives?: string | null
          related_service?: Database["public"]["Enums"]["service_type"] | null
          risk_appetite?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_investment_profiles_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_investment_profiles_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_investment_profiles_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_experience: {
        Row: {
          client_id: string
          created_at: string | null
          crypto_duration: string | null
          crypto_frequency: string | null
          crypto_holding: boolean | null
          crypto_types: string | null
          direct_management_experience: boolean | null
          id: string
          monetary_products_duration: string | null
          monetary_products_frequency: string | null
          monetary_products_holding: boolean | null
          portfolio_management_experience: boolean | null
          stablecoins_knowledge: string | null
          stocks_duration: string | null
          stocks_frequency: string | null
          stocks_holding: boolean | null
          tokens_knowledge: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          crypto_duration?: string | null
          crypto_frequency?: string | null
          crypto_holding?: boolean | null
          crypto_types?: string | null
          direct_management_experience?: boolean | null
          id?: string
          monetary_products_duration?: string | null
          monetary_products_frequency?: string | null
          monetary_products_holding?: boolean | null
          portfolio_management_experience?: boolean | null
          stablecoins_knowledge?: string | null
          stocks_duration?: string | null
          stocks_frequency?: string | null
          stocks_holding?: boolean | null
          tokens_knowledge?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          crypto_duration?: string | null
          crypto_frequency?: string | null
          crypto_holding?: boolean | null
          crypto_types?: string | null
          direct_management_experience?: boolean | null
          id?: string
          monetary_products_duration?: string | null
          monetary_products_frequency?: string | null
          monetary_products_holding?: boolean | null
          portfolio_management_experience?: boolean | null
          stablecoins_knowledge?: string | null
          stocks_duration?: string | null
          stocks_frequency?: string | null
          stocks_holding?: boolean | null
          tokens_knowledge?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_knowledge_experience_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_knowledge_experience_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_knowledge_experience_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates_categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "message_templates_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          body_content: string
          category_id: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          featured_image_url: string | null
          id: string
          language_code: string | null
          publication_status: string | null
          published_at: string | null
          seo_id: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body_content: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          featured_image_url?: string | null
          id?: string
          language_code?: string | null
          publication_status?: string | null
          published_at?: string | null
          seo_id?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body_content?: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          featured_image_url?: string | null
          id?: string
          language_code?: string | null
          publication_status?: string | null
          published_at?: string | null
          seo_id?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_seo_id_fkey"
            columns: ["seo_id"]
            isOneToOne: false
            referencedRelation: "seo_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletters: {
        Row: {
          analytics_id: string | null
          content: string
          created_by: string | null
          deleted_at: string | null
          id: string
          recipient_filter: Json
          sent_at: string | null
          subject: string
          type: string
          updated_at: string | null
        }
        Insert: {
          analytics_id?: string | null
          content: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          recipient_filter: Json
          sent_at?: string | null
          subject: string
          type: string
          updated_at?: string | null
        }
        Update: {
          analytics_id?: string | null
          content?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          recipient_filter?: Json
          sent_at?: string | null
          subject?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_analytics_id_fkey"
            columns: ["analytics_id"]
            isOneToOne: false
            referencedRelation: "email_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          priority: string | null
          related_id: string | null
          snooze_until: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          priority?: string | null
          related_id?: string | null
          snooze_until?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          priority?: string | null
          related_id?: string | null
          snooze_until?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      onboarding_status: {
        Row: {
          deleted_at: string | null
          id: string
          status_name: string
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          status_name: string
        }
        Update: {
          deleted_at?: string | null
          id?: string
          status_name?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string
          id: string
          permission_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description: string
          id?: string
          permission_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          id?: string
          permission_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          address: string | null
          city: string | null
          civility: string | null
          client_id: string
          country_id: string | null
          created_at: string | null
          date_of_birth: string | null
          deleted_at: string | null
          email: string
          first_name: string | null
          last_name: string | null
          nationality_id: string | null
          phone_number: string
          place_of_birth: string | null
          postal_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          civility?: string | null
          client_id: string
          country_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          nationality_id?: string | null
          phone_number: string
          place_of_birth?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          civility?: string | null
          client_id?: string
          country_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          nationality_id?: string | null
          phone_number?: string
          place_of_birth?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_personal_info_client_id"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_personal_info_client_id"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_personal_info_client_id"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_personal_info_country_id"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_info_nationality_id_fkey"
            columns: ["nationality_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      personne_morale: {
        Row: {
          adresse: string
          attestation_association_agree_url: string | null
          attestation_orias_url: string | null
          code_postal: string
          created_at: string | null
          deleted_at: string | null
          id: string
          kbis_url: string | null
          pays_id: string | null
          rcp_url: string | null
          regroupement_id: string
          rib_url: string | null
          statut_entreprise: string
          updated_at: string | null
          ville: string
        }
        Insert: {
          adresse: string
          attestation_association_agree_url?: string | null
          attestation_orias_url?: string | null
          code_postal: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          kbis_url?: string | null
          pays_id?: string | null
          rcp_url?: string | null
          regroupement_id: string
          rib_url?: string | null
          statut_entreprise: string
          updated_at?: string | null
          ville: string
        }
        Update: {
          adresse?: string
          attestation_association_agree_url?: string | null
          attestation_orias_url?: string | null
          code_postal?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          kbis_url?: string | null
          pays_id?: string | null
          rcp_url?: string | null
          regroupement_id?: string
          rib_url?: string | null
          statut_entreprise?: string
          updated_at?: string | null
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_personne_morale_pays_id"
            columns: ["pays_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personne_morale_regroupement_id_fkey"
            columns: ["regroupement_id"]
            isOneToOne: false
            referencedRelation: "regroupement"
            referencedColumns: ["id"]
          },
        ]
      }
      pii_access_logs: {
        Row: {
          accessed_user_id: string | null
          action: string | null
          admin_id: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          accessed_user_id?: string | null
          action?: string | null
          admin_id?: string | null
          id?: string
          timestamp?: string | null
        }
        Update: {
          accessed_user_id?: string | null
          action?: string | null
          admin_id?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      pipeline: {
        Row: {
          client_id: string | null
          created_at: string | null
          current_stage: string | null
          deleted_at: string | null
          id: string
          slug: string | null
          sort: number | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_created: string | null
          user_updated: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          current_stage?: string | null
          deleted_at?: string | null
          id?: string
          slug?: string | null
          sort?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_created?: string | null
          user_updated?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          current_stage?: string | null
          deleted_at?: string | null
          id?: string
          slug?: string | null
          sort?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_created?: string | null
          user_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pipeline_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pipeline_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pipeline_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_column_users: {
        Row: {
          pipeline_column_id: string
          user_id: string
        }
        Insert: {
          pipeline_column_id: string
          user_id: string
        }
        Update: {
          pipeline_column_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_column_users_pipeline_column_id_fkey"
            columns: ["pipeline_column_id"]
            isOneToOne: false
            referencedRelation: "pipeline_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_columns: {
        Row: {
          created_at: string | null
          event: string | null
          event_action_id: string | null
          id: string
          identifier: string | null
          name: string | null
          pipeline_id: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          event?: string | null
          event_action_id?: string | null
          id?: string
          identifier?: string | null
          name?: string | null
          pipeline_id?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          event?: string | null
          event_action_id?: string | null
          id?: string
          identifier?: string | null
          name?: string | null
          pipeline_id?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_columns_event_action_id_fkey"
            columns: ["event_action_id"]
            isOneToOne: false
            referencedRelation: "pipeline_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_columns_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipeline"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_events: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          identifier: string | null
          name: string | null
          sort: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          identifier?: string | null
          name?: string | null
          sort?: number | null
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          identifier?: string | null
          name?: string | null
          sort?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      placeholder_validation: {
        Row: {
          created_at: string | null
          expected_type: string
          id: string
          mapped_field: string
          placeholder_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expected_type: string
          id?: string
          mapped_field: string
          placeholder_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expected_type?: string
          id?: string
          mapped_field?: string
          placeholder_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_managers: {
        Row: {
          certification_level: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          max_clients: number | null
          specialization: string | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          certification_level?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          max_clients?: number | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          certification_level?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          max_clients?: number | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      professional_page: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          language_code: string | null
          seo_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          language_code?: string | null
          seo_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          language_code?: string | null
          seo_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_page_seo_id_fkey"
            columns: ["seo_id"]
            isOneToOne: false
            referencedRelation: "seo_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_situations: {
        Row: {
          activity_sector: string | null
          client_id: string
          company_name: string | null
          created_at: string | null
          finance_experience: boolean | null
          id: string
          profession_id: string | null
          situation_start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          activity_sector?: string | null
          client_id: string
          company_name?: string | null
          created_at?: string | null
          finance_experience?: boolean | null
          id?: string
          profession_id?: string | null
          situation_start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_sector?: string | null
          client_id?: string
          company_name?: string | null
          created_at?: string | null
          finance_experience?: boolean | null
          id?: string
          profession_id?: string | null
          situation_start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_professional_situations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_professional_situations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_professional_situations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_situations_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "professions"
            referencedColumns: ["id"]
          },
        ]
      }
      professions: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          risk_description: string | null
          risk_level_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          risk_description?: string | null
          risk_level_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          risk_description?: string | null
          risk_level_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professions_risk_level_id_fkey"
            columns: ["risk_level_id"]
            isOneToOne: false
            referencedRelation: "risk_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          cgp_cif_id: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          portfolio_manager_id: string | null
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cgp_cif_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          portfolio_manager_id?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cgp_cif_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          portfolio_manager_id?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_cgp_cif_id_fkey"
            columns: ["cgp_cif_id"]
            isOneToOne: false
            referencedRelation: "cgp_cif"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_portfolio_manager_id_fkey"
            columns: ["portfolio_manager_id"]
            isOneToOne: false
            referencedRelation: "portfolio_managers"
            referencedColumns: ["id"]
          },
        ]
      }
      quarterly_reports: {
        Row: {
          client_id: string
          client_profile_summary: string | null
          composition: Json | null
          created_at: string | null
          current_portfolio_value: number
          fee_information: Json | null
          file_path: string | null
          id: string
          objectives: string | null
          portfolio_evolution_percentage: number | null
          previous_portfolio_value: number | null
          report_date: string
          report_period: string
          transaction_history: Json | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          client_profile_summary?: string | null
          composition?: Json | null
          created_at?: string | null
          current_portfolio_value: number
          fee_information?: Json | null
          file_path?: string | null
          id?: string
          objectives?: string | null
          portfolio_evolution_percentage?: number | null
          previous_portfolio_value?: number | null
          report_date: string
          report_period: string
          transaction_history?: Json | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          client_profile_summary?: string | null
          composition?: Json | null
          created_at?: string | null
          current_portfolio_value?: number
          fee_information?: Json | null
          file_path?: string | null
          id?: string
          objectives?: string | null
          portfolio_evolution_percentage?: number | null
          previous_portfolio_value?: number | null
          report_date?: string
          report_period?: string
          transaction_history?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quarterly_reports_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quarterly_reports_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quarterly_reports_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaires: {
        Row: {
          client_id: string
          completed_at: string | null
          deleted_at: string | null
          id: string
          questionnaire_type: string
          responses: Json
          version: number
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          deleted_at?: string | null
          id?: string
          questionnaire_type?: string
          responses: Json
          version?: number
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          deleted_at?: string | null
          id?: string
          questionnaire_type?: string
          responses?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_questionnaires_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_questionnaires_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_questionnaires_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      recipient_filters: {
        Row: {
          created_at: string | null
          created_by: string | null
          filter_criteria: Json
          filter_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          filter_criteria: Json
          filter_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          filter_criteria?: Json
          filter_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reclamation_contact_details: {
        Row: {
          addr_city: string | null
          addr_country: string | null
          addr_floor: string | null
          addr_number: string | null
          addr_street_name: string | null
          addr_zipcode: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
        }
        Insert: {
          addr_city?: string | null
          addr_country?: string | null
          addr_floor?: string | null
          addr_number?: string | null
          addr_street_name?: string | null
          addr_zipcode?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
        }
        Update: {
          addr_city?: string | null
          addr_country?: string | null
          addr_floor?: string | null
          addr_number?: string | null
          addr_street_name?: string | null
          addr_zipcode?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reclamation_contact_details_addr_country"
            columns: ["addr_country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      reclamation_personal_details: {
        Row: {
          addr_city: string | null
          addr_country: string | null
          addr_floor: string | null
          addr_number: string | null
          addr_street_name: string | null
          addr_zipcode: string | null
          email: string | null
          first_name: string | null
          id: string
          is_astavest_client: string | null
          last_name: string | null
          phone_number: string | null
        }
        Insert: {
          addr_city?: string | null
          addr_country?: string | null
          addr_floor?: string | null
          addr_number?: string | null
          addr_street_name?: string | null
          addr_zipcode?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_astavest_client?: string | null
          last_name?: string | null
          phone_number?: string | null
        }
        Update: {
          addr_city?: string | null
          addr_country?: string | null
          addr_floor?: string | null
          addr_number?: string | null
          addr_street_name?: string | null
          addr_zipcode?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_astavest_client?: string | null
          last_name?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reclamation_personal_details_addr_country"
            columns: ["addr_country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      reclamation_status_history: {
        Row: {
          id: string
          reclamation_id: string | null
          status: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          reclamation_id?: string | null
          status: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          reclamation_id?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reclamation_status_history_reclamation_id_fkey"
            columns: ["reclamation_id"]
            isOneToOne: false
            referencedRelation: "reclamations"
            referencedColumns: ["id"]
          },
        ]
      }
      reclamations: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          comments: string | null
          contact_details_id: string | null
          created_at: string | null
          crypto_service_or_agreement: string | null
          current_situation_and_desired_solution: string | null
          date_of_the_facts_leading_to_the_claim: string | null
          deleted_at: string | null
          description: string
          description_of_damage: string | null
          description_of_the_request: string | null
          id: string
          personal_details_id: string | null
          priority: string | null
          reason_for_request: string | null
          status: string | null
          the_parties_concerned: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          comments?: string | null
          contact_details_id?: string | null
          created_at?: string | null
          crypto_service_or_agreement?: string | null
          current_situation_and_desired_solution?: string | null
          date_of_the_facts_leading_to_the_claim?: string | null
          deleted_at?: string | null
          description: string
          description_of_damage?: string | null
          description_of_the_request?: string | null
          id?: string
          personal_details_id?: string | null
          priority?: string | null
          reason_for_request?: string | null
          status?: string | null
          the_parties_concerned?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          comments?: string | null
          contact_details_id?: string | null
          created_at?: string | null
          crypto_service_or_agreement?: string | null
          current_situation_and_desired_solution?: string | null
          date_of_the_facts_leading_to_the_claim?: string | null
          deleted_at?: string | null
          description?: string
          description_of_damage?: string | null
          description_of_the_request?: string | null
          id?: string
          personal_details_id?: string | null
          priority?: string | null
          reason_for_request?: string | null
          status?: string | null
          the_parties_concerned?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reclamations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reclamations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reclamations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      regroupement: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      regroupement_aggregates: {
        Row: {
          deleted_at: string | null
          id: string
          last_updated: string | null
          regroupement_id: string
          total_clients: number | null
          total_fees_collected: number | null
          total_portfolio_value: number | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          last_updated?: string | null
          regroupement_id: string
          total_clients?: number | null
          total_fees_collected?: number | null
          total_portfolio_value?: number | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          last_updated?: string | null
          regroupement_id?: string
          total_clients?: number | null
          total_fees_collected?: number | null
          total_portfolio_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regroupement_aggregates_regroupement_id_fkey"
            columns: ["regroupement_id"]
            isOneToOne: false
            referencedRelation: "regroupement_cgp"
            referencedColumns: ["id"]
          },
        ]
      }
      regroupement_cgp: {
        Row: {
          cgp_id: string
          deleted_at: string | null
          id: string
          regroupement_id: string
        }
        Insert: {
          cgp_id: string
          deleted_at?: string | null
          id?: string
          regroupement_id: string
        }
        Update: {
          cgp_id?: string
          deleted_at?: string | null
          id?: string
          regroupement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regroupement_cgp_regroupement_id_fkey"
            columns: ["regroupement_id"]
            isOneToOne: false
            referencedRelation: "regroupement"
            referencedColumns: ["id"]
          },
        ]
      }
      regulatory_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          deleted_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          status: string | null
          updated_at: string | null
          uploaded_by: string | null
          verification_status: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          verification_status?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_regulatory_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_regulatory_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_regulatory_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_types: {
        Row: {
          deleted_at: string | null
          id: string
          type_name: string
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          type_name: string
        }
        Update: {
          deleted_at?: string | null
          id?: string
          type_name?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          id: string
          template_name: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          template_name: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          template_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json | null
          deleted_at: string | null
          file_path: string | null
          filters: Json | null
          generated_at: string | null
          generated_by: string | null
          id: string
          report_period: string | null
          report_type: string
        }
        Insert: {
          content?: Json | null
          deleted_at?: string | null
          file_path?: string | null
          filters?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          report_period?: string | null
          report_type: string
        }
        Update: {
          content?: Json | null
          deleted_at?: string | null
          file_path?: string | null
          filters?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          report_period?: string | null
          report_type?: string
        }
        Relationships: []
      }
      representant: {
        Row: {
          casier_judiciaire_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          id: string
          nom: string
          personne_morale_id: string | null
          prenom: string
          telephone: string
          updated_at: string | null
        }
        Insert: {
          casier_judiciaire_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          id?: string
          nom: string
          personne_morale_id?: string | null
          prenom: string
          telephone: string
          updated_at?: string | null
        }
        Update: {
          casier_judiciaire_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          id?: string
          nom?: string
          personne_morale_id?: string | null
          prenom?: string
          telephone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_representant_personne_morale_id"
            columns: ["personne_morale_id"]
            isOneToOne: false
            referencedRelation: "personne_morale"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_levels: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          due_diligence_level: string
          id: string
          name: string
          update_frequency: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_diligence_level: string
          id?: string
          name: string
          update_frequency: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_diligence_level?: string
          id?: string
          name?: string
          update_frequency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          permission_id: string
          role_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          permission_id: string
          role_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          language_code: string | null
          meta_description: string
          meta_keywords: string | null
          meta_title: string
          page_id: string
          page_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          language_code?: string | null
          meta_description: string
          meta_keywords?: string | null
          meta_title: string
          page_id: string
          page_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          language_code?: string | null
          meta_description?: string
          meta_keywords?: string | null
          meta_title?: string
          page_id?: string
          page_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      signed_documents: {
        Row: {
          client_id: string
          deleted_at: string | null
          document_type: string
          file_path: string
          id: string
          signed_at: string | null
        }
        Insert: {
          client_id: string
          deleted_at?: string | null
          document_type: string
          file_path: string
          id?: string
          signed_at?: string | null
        }
        Update: {
          client_id?: string
          deleted_at?: string | null
          document_type?: string
          file_path?: string
          id?: string
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_signed_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_signed_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_signed_documents_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      static_content: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          key_name: string
          language_code: string
          seo_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          key_name: string
          language_code?: string
          seo_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          key_name?: string
          language_code?: string
          seo_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "static_content_seo_id_fkey"
            columns: ["seo_id"]
            isOneToOne: false
            referencedRelation: "seo_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      sustainable_preferences: {
        Row: {
          client_id: string
          created_at: string | null
          esg_preference: Json | null
          extra_financial_priority: boolean | null
          id: string
          impact_details: string | null
          impact_selection: boolean | null
          sustainability_integration: boolean | null
          taxonomy_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          esg_preference?: Json | null
          extra_financial_priority?: boolean | null
          id?: string
          impact_details?: string | null
          impact_selection?: boolean | null
          sustainability_integration?: boolean | null
          taxonomy_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          esg_preference?: Json | null
          extra_financial_priority?: boolean | null
          id?: string
          impact_details?: string | null
          impact_selection?: boolean | null
          sustainability_integration?: boolean | null
          taxonomy_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sustainable_preferences_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sustainable_preferences_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sustainable_preferences_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          component: string
          created_at: string | null
          created_by: string | null
          details: Json | null
          id: string
          log_level: string
          message: string
        }
        Insert: {
          component: string
          created_at?: string | null
          created_by?: string | null
          details?: Json | null
          id?: string
          log_level: string
          message: string
        }
        Update: {
          component?: string
          created_at?: string | null
          created_by?: string | null
          details?: Json | null
          id?: string
          log_level?: string
          message?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          due_date: string | null
          finished_date: string | null
          id: string
          priority: string | null
          progress_percentage: number | null
          recurrence_pattern: string | null
          related_error_id: string | null
          start_date: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          finished_date?: string | null
          id?: string
          priority?: string | null
          progress_percentage?: number | null
          recurrence_pattern?: string | null
          related_error_id?: string | null
          start_date?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          finished_date?: string | null
          id?: string
          priority?: string | null
          progress_percentage?: number | null
          recurrence_pattern?: string | null
          related_error_id?: string | null
          start_date?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_related_error_id_fkey"
            columns: ["related_error_id"]
            isOneToOne: false
            referencedRelation: "error_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_info: {
        Row: {
          client_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_ifi_subject: boolean | null
          tax_identification_number: string | null
          tax_residence_id: string | null
          updated_at: string | null
          us_tax_links: boolean | null
          us_tin: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_ifi_subject?: boolean | null
          tax_identification_number?: string | null
          tax_residence_id?: string | null
          updated_at?: string | null
          us_tax_links?: boolean | null
          us_tin?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_ifi_subject?: boolean | null
          tax_identification_number?: string | null
          tax_residence_id?: string | null
          updated_at?: string | null
          us_tax_links?: boolean | null
          us_tin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tax_info_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tax_info_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tax_info_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_info_tax_residence_id_fkey"
            columns: ["tax_residence_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          added_at: string | null
          deleted_at: string | null
          id: string
          role: string | null
          role_description: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          deleted_at?: string | null
          id?: string
          role?: string | null
          role_description?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          deleted_at?: string | null
          id?: string
          role?: string | null
          role_description?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          team_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          team_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          team_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      terms_and_conditions: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
        }
        Relationships: []
      }
      terms_responses: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          deleted_at: string | null
          id: string
          terms_id: string
          user_id: string
        }
        Insert: {
          accepted: boolean
          accepted_at?: string | null
          deleted_at?: string | null
          id?: string
          terms_id: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          deleted_at?: string | null
          id?: string
          terms_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_responses_terms_id_fkey"
            columns: ["terms_id"]
            isOneToOne: false
            referencedRelation: "terms_and_conditions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          deleted_at: string | null
          fee_type: string | null
          id: string
          related_client_id: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          fee_type?: string | null
          id?: string
          related_client_id?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          fee_type?: string | null
          id?: string
          related_client_id?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_all_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_access_logs: {
        Row: {
          access_time: string | null
          device_type: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          access_time?: string | null
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          access_time?: string | null
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_group_members: {
        Row: {
          added_at: string | null
          deleted_at: string | null
          group_id: string
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          deleted_at?: string | null
          group_id: string
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          deleted_at?: string | null
          group_id?: string
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "user_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          group_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          group_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          group_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          communication_preferences: Json
          deleted_at: string | null
          email_types: Json
          id: string
          language_preference: string | null
          notification_frequency: string | null
          notification_preferences: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          communication_preferences?: Json
          deleted_at?: string | null
          email_types?: Json
          id?: string
          language_preference?: string | null
          notification_frequency?: string | null
          notification_preferences?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          communication_preferences?: Json
          deleted_at?: string | null
          email_types?: Json
          id?: string
          language_preference?: string | null
          notification_frequency?: string | null
          notification_preferences?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      users_archive: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          archived_reason: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          archived_reason?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          archived_reason?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      website_policies: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          policy_name: string
          updated_at: string | null
          version: number
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          policy_name: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          policy_name?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      website_team: {
        Row: {
          bio: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          display_order: number | null
          id: string
          name: string
          photo_url: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number | null
          id?: string
          name: string
          photo_url: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number | null
          id?: string
          name?: string
          photo_url?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workflow_logs: {
        Row: {
          executed_at: string | null
          id: string
          log_details: string | null
          status: string | null
          workflow_id: string | null
        }
        Insert: {
          executed_at?: string | null
          id?: string
          log_details?: string | null
          status?: string | null
          workflow_id?: string | null
        }
        Update: {
          executed_at?: string | null
          id?: string
          log_details?: string | null
          status?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_logs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          actions: Json
          created_at: string | null
          deleted_at: string | null
          description: string | null
          dynamic_content: Json | null
          id: string
          name: string
          parent_workflow_id: string | null
          recurring_details: Json | null
          trigger_id: string | null
          updated_at: string | null
        }
        Insert: {
          actions: Json
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          dynamic_content?: Json | null
          id?: string
          name: string
          parent_workflow_id?: string | null
          recurring_details?: Json | null
          trigger_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          dynamic_content?: Json | null
          id?: string
          name?: string
          parent_workflow_id?: string | null
          recurring_details?: Json | null
          trigger_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_parent_workflow_id_fkey"
            columns: ["parent_workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "event_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      clients_with_all_tables: {
        Row: {
          approved_at: string | null
          cgp_adresse: string | null
          cgp_cif_id: string | null
          cgp_code_postal: string | null
          cgp_statut_entreprise: string | null
          cgp_ville: string | null
          country_id: string | null
          country_name: string | null
          created_at: string | null
          deleted_at: string | null
          direct_adresse: string | null
          direct_code_postal: string | null
          direct_statut_entreprise: string | null
          direct_ville: string | null
          email: string | null
          full_name: string | null
          id: string | null
          individual_address: string | null
          individual_city: string | null
          individual_first_name: string | null
          individual_last_name: string | null
          individual_phone: string | null
          individual_postal_code: string | null
          is_ifi_subject: boolean | null
          latest_reclamation_status: string | null
          onboarding_status_id: string | null
          person_type: Database["public"]["Enums"]["person_type"] | null
          personne_morale_id: string | null
          reclamations_count: number | null
          representant_id: string | null
          shareable_id: string | null
          tax_identification_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cgp_cif_representant_id_fkey"
            columns: ["representant_id"]
            isOneToOne: false
            referencedRelation: "representant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_cgp_cif_id_fkey"
            columns: ["cgp_cif_id"]
            isOneToOne: false
            referencedRelation: "cgp_cif"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_onboarding_status_id_fkey"
            columns: ["onboarding_status_id"]
            isOneToOne: false
            referencedRelation: "onboarding_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_clients_personne_morale_id"
            columns: ["personne_morale_id"]
            isOneToOne: false
            referencedRelation: "personne_morale"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_with_user: {
        Row: {
          approved_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          onboarding_status_id: string | null
          person_type: Database["public"]["Enums"]["person_type"] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_onboarding_status_id_fkey"
            columns: ["onboarding_status_id"]
            isOneToOne: false
            referencedRelation: "onboarding_status"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_with_users: {
        Row: {
          assigned_to: string | null
          assigned_to_email: string | null
          assigned_to_name: string | null
          created_at: string | null
          created_by: string | null
          created_by_email: string | null
          created_by_name: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          id: string | null
          priority: string | null
          progress_percentage: number | null
          recurrence_pattern: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      user_roles_with_roles: {
        Row: {
          role_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_admin_role: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
      create_admin_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
      create_task: {
        Args: {
          p_title: string
          p_description: string
          p_priority: string
          p_status: string
          p_due_date: string
          p_assigned_to: string
          p_recurrence_pattern: string
          p_progress_percentage: number
          p_created_by: string
        }
        Returns: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          due_date: string | null
          finished_date: string | null
          id: string
          priority: string | null
          progress_percentage: number | null
          recurrence_pattern: string | null
          related_error_id: string | null
          start_date: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string | null
        }[]
      }
      get_all_seo_data: {
        Args: {
          p_language_code: string
        }
        Returns: {
          id: string
          page_id: string
          page_type: string
          meta_title: string
          meta_description: string
          meta_keywords: string
          language_code: string
          content_title: string
          content_type: string
          translation_status: string
        }[]
      }
      get_client_data: {
        Args: {
          p_client_id: string
        }
        Returns: {
          id: string
          user_id: string
          shareable_id: string
          person_type: string
          cgp_cif_id: string
          onboarding_status_id: string
          status: string
          approved_at: string
          created_at: string
          updated_at: string
        }[]
      }
      get_footer_content: {
        Args: {
          p_language_code: string
        }
        Returns: {
          id: string
          type: string
          title: string
          content: string
          file_url: string
          language_code: string
          meta_title: string
          meta_description: string
        }[]
      }
      get_static_content: {
        Args: {
          p_language_code: string
        }
        Returns: {
          id: string
          key_name: string
          content: string
          content_type: string
          language_code: string
          meta_title: string
          meta_description: string
          meta_keywords: string
        }[]
      }
      get_task_data: {
        Args: {
          p_task_id: string
        }
        Returns: {
          id: string
          title: string
          description: string
          status: string
          assigned_to: string
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_tasks_with_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          task_id: string
          title: string
          description: string
          priority: string
          status: string
          due_date: string
          assigned_to: string
          created_by: string
          recurrence_pattern: string
          progress_percentage: number
          start_date: string
          finished_date: string
          created_at: string
          updated_at: string
          assigned_to_email: string
          assigned_to_name: string
          created_by_email: string
          created_by_name: string
        }[]
      }
      get_team_members: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          photo_url: string
          role: string
          bio: string
          display_order: number
          created_at: string
          updated_at: string
        }[]
      }
      get_total_clients: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_translation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          content_type: string
          total_items: number
          translated_items: number
          needs_review: number
          completion_percentage: number
        }[]
      }
      get_user_data: {
        Args: {
          user_id: string
        }
        Returns: {
          email: string
          full_name: string
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      update_client_data: {
        Args: {
          p_client_id: string
          p_full_name: string
          p_email: string
          p_person_type: Database["public"]["Enums"]["person_type"]
        }
        Returns: undefined
      }
    }
    Enums: {
      activity_type:
        | "login"
        | "logout"
        | "profile_update"
        | "communication_sent"
        | "task_update"
        | "compliance_score_change"
        | "portfolio_update"
        | "transaction_recorded"
        | "error_logged"
        | "document_uploaded"
        | "client_onboarding"
      communication_type: "email" | "message" | "notification" | "sms"
      document_type: "kyc" | "aml" | "tax" | "contract" | "mandate" | "other"
      error_type:
        | "api_failure"
        | "email_failure"
        | "database_issue"
        | "validation_error"
        | "authentication_error"
        | "authorization_error"
      fee_type:
        | "entry"
        | "management"
        | "editique"
        | "custody"
        | "exit"
        | "performance"
      investment_horizon: "short_term" | "medium_term" | "long_term"
      log_type: "error" | "compliance" | "security" | "audit" | "system"
      marital_status:
        | "single"
        | "married"
        | "divorced"
        | "widowed"
        | "civil_partnership"
      notification_category:
        | "tasks"
        | "errors"
        | "compliance"
        | "system"
        | "communications"
        | "portfolio"
        | "client"
      notification_frequency: "immediate" | "daily" | "weekly" | "monthly"
      person_type: "physique" | "morale"
      pipeline_stage:
        | "signup"
        | "questionnaire"
        | "standby"
        | "approved"
        | "rejected"
      priority_level: "low" | "medium" | "high" | "urgent"
      publication_status: "draft" | "published" | "archived"
      risk_appetite: "conservative" | "moderate" | "aggressive"
      risk_category: "low" | "medium" | "high" | "interdit"
      service_type: "mandat_de_gestion"
      status_type:
        | "pending"
        | "in_progress"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "fee"
        | "transfer"
        | "adjustment"
      user_status: "active" | "inactive" | "suspended" | "pending_approval"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
