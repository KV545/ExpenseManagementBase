import { supabase } from '../lib/supabase';
import { Expense, Attachment, ExtractedData, AbbyyRequest, AbbyyResponse } from '../types/expense';

class ApiService {
  // Expense management
  async getExpenses(): Promise<Expense[]> {
    const { data: expensesData, error } = await supabase
      .from('expenses')
      .select(`
        *,
        submitted_user:users!expenses_submitted_by_fkey(name),
        approved_user:users!expenses_approved_by_fkey(name),
        rejected_user:users!expenses_rejected_by_fkey(name),
        attachments(*),
        extracted_data(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return expensesData.map(expense => ({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      date: expense.date,
      description: expense.description || '',
      status: expense.status,
      submittedBy: expense.submitted_user?.name || 'Unknown',
      submittedAt: expense.submitted_at,
      approvedBy: expense.approved_user?.name,
      approvedAt: expense.approved_at,
      rejectedBy: expense.rejected_user?.name,
      rejectedAt: expense.rejected_at,
      rejectionReason: expense.rejection_reason,
      processingStatus: expense.processing_status,
      attachments: expense.attachments.map((att: any) => ({
        id: att.id,
        name: att.name,
        size: att.size,
        type: att.type,
        url: att.url,
        uploadedAt: att.uploaded_at,
        abbyySentAt: att.abbyy_sent_at,
        abbyyProcessedAt: att.abbyy_processed_at
      })),
      extractedData: expense.extracted_data[0] ? {
        vendor: expense.extracted_data[0].vendor,
        amount: expense.extracted_data[0].amount,
        currency: expense.extracted_data[0].currency,
        date: expense.extracted_data[0].date,
        invoiceNumber: expense.extracted_data[0].invoice_number,
        category: expense.extracted_data[0].category,
        confidence: expense.extracted_data[0].confidence,
        extractedAt: expense.extracted_data[0].extracted_at
      } : undefined
    }));
  }

  async createExpense(expense: Omit<Expense, 'id' | 'submittedAt'>): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        title: expense.title,
        amount: expense.amount,
        currency: expense.currency,
        category: expense.category,
        date: expense.date,
        description: expense.description,
        status: expense.status,
        submitted_by: user.id,
        submitted_at: new Date().toISOString(),
        processing_status: expense.processingStatus
      })
      .select()
      .single();

    if (expenseError || !expenseData) {
      throw new Error(expenseError?.message || 'Failed to create expense');
    }

    // Insert attachments if any
    if (expense.attachments.length > 0) {
      const attachmentsToInsert = expense.attachments.map(att => ({
        expense_id: expenseData.id,
        name: att.name,
        size: att.size,
        type: att.type,
        url: att.url,
        uploaded_at: att.uploadedAt,
        abbyy_sent_at: att.abbyySentAt,
        abbyy_processed_at: att.abbyyProcessedAt
      }));

      const { error: attachmentError } = await supabase
        .from('attachments')
        .insert(attachmentsToInsert);

      if (attachmentError) {
        console.error('Failed to insert attachments:', attachmentError);
      }
    }

    // Insert extracted data if any
    if (expense.extractedData) {
      const { error: extractedError } = await supabase
        .from('extracted_data')
        .insert({
          expense_id: expenseData.id,
          vendor: expense.extractedData.vendor,
          amount: expense.extractedData.amount,
          currency: expense.extractedData.currency,
          date: expense.extractedData.date,
          invoice_number: expense.extractedData.invoiceNumber,
          category: expense.extractedData.category,
          confidence: expense.extractedData.confidence,
          extracted_at: expense.extractedData.extractedAt
        });

      if (extractedError) {
        console.error('Failed to insert extracted data:', extractedError);
      }
    }

    // Return the created expense with all related data
    const expenses = await this.getExpenses();
    const createdExpense = expenses.find(e => e.id === expenseData.id);
    if (!createdExpense) {
      throw new Error('Failed to retrieve created expense');
    }

    return createdExpense;
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.approvedBy !== undefined) updateData.approved_by = user.id;
    if (updates.approvedAt !== undefined) updateData.approved_at = updates.approvedAt;
    if (updates.rejectedBy !== undefined) updateData.rejected_by = user.id;
    if (updates.rejectedAt !== undefined) updateData.rejected_at = updates.rejectedAt;
    if (updates.rejectionReason !== undefined) updateData.rejection_reason = updates.rejectionReason;
    if (updates.processingStatus !== undefined) updateData.processing_status = updates.processingStatus;

    const { error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    // Return updated expense
    const expenses = await this.getExpenses();
    const updatedExpense = expenses.find(e => e.id === id);
    if (!updatedExpense) {
      throw new Error('Failed to retrieve updated expense');
    }

    return updatedExpense;
  }

  async approveExpense(id: string, approverId: string): Promise<Expense> {
    return this.updateExpense(id, {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date().toISOString()
    });
  }

  async rejectExpense(id: string, rejectedBy: string, reason: string): Promise<Expense> {
    return this.updateExpense(id, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });
  }

  // File upload (placeholder - in production you'd upload to Supabase Storage)
  async uploadFile(file: File, expenseId: string): Promise<{ url: string; attachmentId: string }> {
    // For demo purposes, create a blob URL
    const url = URL.createObjectURL(file);
    const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { url, attachmentId };
  }

  // ABBYY Vantage integration (placeholder)
  async sendToAbbyy(request: AbbyyRequest): Promise<boolean> {
    try {
      // In production, this would send to your ABBYY Vantage endpoint
      console.log('Sending to ABBYY:', request);
      
      // Update attachment with sent timestamp
      await supabase
        .from('attachments')
        .update({ abbyy_sent_at: new Date().toISOString() })
        .eq('id', request.attachmentId);
      
      return true;
    } catch (error) {
      console.error('Error sending to ABBYY:', error);
      return false;
    }
  }

  // Handle ABBYY callback (placeholder)
  async handleAbbyyCallback(data: AbbyyResponse): Promise<void> {
    try {
      if (data.success && data.extractedData) {
        // Insert extracted data
        await supabase
          .from('extracted_data')
          .insert({
            expense_id: data.expenseId,
            vendor: data.extractedData.vendor,
            amount: data.extractedData.amount,
            currency: data.extractedData.currency,
            date: data.extractedData.date,
            invoice_number: data.extractedData.invoiceNumber,
            category: data.extractedData.category,
            confidence: data.extractedData.confidence,
            extracted_at: data.extractedData.extractedAt
          });

        // Update attachment with processed timestamp
        await supabase
          .from('attachments')
          .update({ abbyy_processed_at: new Date().toISOString() })
          .eq('id', data.attachmentId);

        // Update expense processing status
        await supabase
          .from('expenses')
          .update({ processing_status: 'completed' })
          .eq('id', data.expenseId);
      } else {
        // Update expense processing status to failed
        await supabase
          .from('expenses')
          .update({ processing_status: 'failed' })
          .eq('id', data.expenseId);
      }
    } catch (error) {
      console.error('Error handling ABBYY callback:', error);
    }
  }
}

export const apiService = new ApiService();