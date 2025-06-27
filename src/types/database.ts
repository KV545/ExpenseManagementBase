export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'employee' | 'manager' | 'admin'
          department: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: 'employee' | 'manager' | 'admin'
          department?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'employee' | 'manager' | 'admin'
          department?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          title: string
          amount: number
          currency: string
          category: string
          date: string
          description: string | null
          status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
          submitted_by: string | null
          submitted_at: string | null
          approved_by: string | null
          approved_at: string | null
          rejected_by: string | null
          rejected_at: string | null
          rejection_reason: string | null
          processing_status: 'pending' | 'extracting' | 'completed' | 'failed' | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          amount: number
          currency?: string
          category: string
          date: string
          description?: string | null
          status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
          submitted_by?: string | null
          submitted_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          rejected_by?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          processing_status?: 'pending' | 'extracting' | 'completed' | 'failed' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          currency?: string
          category?: string
          date?: string
          description?: string | null
          status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
          submitted_by?: string | null
          submitted_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          rejected_by?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          processing_status?: 'pending' | 'extracting' | 'completed' | 'failed' | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      attachments: {
        Row: {
          id: string
          expense_id: string | null
          name: string
          size: number
          type: string
          url: string
          uploaded_at: string | null
          abbyy_sent_at: string | null
          abbyy_processed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          expense_id?: string | null
          name: string
          size: number
          type: string
          url: string
          uploaded_at?: string | null
          abbyy_sent_at?: string | null
          abbyy_processed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          expense_id?: string | null
          name?: string
          size?: number
          type?: string
          url?: string
          uploaded_at?: string | null
          abbyy_sent_at?: string | null
          abbyy_processed_at?: string | null
          created_at?: string | null
        }
      }
      extracted_data: {
        Row: {
          id: string
          expense_id: string | null
          vendor: string | null
          amount: number | null
          currency: string | null
          date: string | null
          invoice_number: string | null
          category: string | null
          confidence: number | null
          extracted_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          expense_id?: string | null
          vendor?: string | null
          amount?: number | null
          currency?: string | null
          date?: string | null
          invoice_number?: string | null
          category?: string | null
          confidence?: number | null
          extracted_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          expense_id?: string | null
          vendor?: string | null
          amount?: number | null
          currency?: string | null
          date?: string | null
          invoice_number?: string | null
          category?: string | null
          confidence?: number | null
          extracted_at?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: 'employee' | 'manager' | 'admin'
      }
    }
    Enums: {
      user_role: 'employee' | 'manager' | 'admin'
      expense_status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
      processing_status: 'pending' | 'extracting' | 'completed' | 'failed'
    }
  }
}