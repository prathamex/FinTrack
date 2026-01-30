'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetList from '../components/budgets/BudgetList';

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
  alertThreshold: number;
  spent: number;
  remaining: number;
  status: 'good' | 'warning' | 'exceeded';
}

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const handleAddBudget = (budget: Budget) => {
    setBudgets(prev => [budget, ...prev]);
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Budget Management</h1>
        <div className="mb-6">
          <BudgetForm onAddBudget={handleAddBudget} />
        </div>
        <BudgetList budgets={budgets} />
      </div>
    </Layout>
  );
};

export default BudgetsPage;