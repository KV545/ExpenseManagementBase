import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { ExpenseForm } from './components/ExpenseForm/ExpenseForm';
import { ExpenseList } from './components/ExpenseList/ExpenseList';
import { ExpenseDetail } from './components/ExpenseDetail/ExpenseDetail';
import { Analytics } from './components/Analytics/Analytics';
import { ProcessingStatus } from './components/ProcessingStatus/ProcessingStatus';
import { useExpenses } from './hooks/useExpenses';
import { Expense } from './types/expense';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('expenses');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  console.log('AppContent render:', { user: !!user, isAuthenticated, authLoading });

  // Show loading while auth is initializing
  if (authLoading) {
    console.log('Showing auth loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    console.log('Showing auth page...');
    return <AuthPage />;
  }

  console.log('Showing main app...');
  return <MainApp user={user!} activeTab={activeTab} setActiveTab={setActiveTab} selectedExpense={selectedExpense} setSelectedExpense={setSelectedExpense} />;
};

const MainApp: React.FC<{
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedExpense: Expense | null;
  setSelectedExpense: (expense: Expense | null) => void;
}> = ({ user, activeTab, setActiveTab, selectedExpense, setSelectedExpense }) => {
  const { 
    expenses, 
    loading: expensesLoading, 
    error, 
    createExpense, 
    approveExpense, 
    rejectExpense 
  } = useExpenses();

  const handleCreateExpense = async (expenseData: Omit<Expense, 'id' | 'submittedAt'>) => {
    try {
      await createExpense(expenseData);
      setActiveTab('expenses');
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  const handleApprove = async (id: string) => {
    if (!user) return;
    try {
      await approveExpense(id, user.id);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Failed to approve expense:', error);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    if (!user) return;
    try {
      await rejectExpense(id, user.id, reason);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Failed to reject expense:', error);
    }
  };

  const pendingApprovals = expenses.filter(e => e.status === 'submitted').length;

  if (expensesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={user.role}
        pendingApprovals={pendingApprovals}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'create' && (
          <ExpenseForm 
            onSubmit={handleCreateExpense}
            loading={expensesLoading}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={expenses}
            onExpenseClick={handleExpenseClick}
            userRole={user.role}
          />
        )}

        {activeTab === 'approvals' && (
          <ExpenseList
            expenses={expenses.filter(e => e.status === 'submitted')}
            onExpenseClick={handleExpenseClick}
            userRole={user.role}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics expenses={expenses} />
        )}

        {activeTab === 'processing' && (
          <ProcessingStatus expenses={expenses} />
        )}
      </main>

      {selectedExpense && (
        <ExpenseDetail
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          userRole={user.role}
          canApprove={user.role === 'manager' || user.role === 'admin'}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;