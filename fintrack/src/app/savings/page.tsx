'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import SavingsGoalForm from '../components/savings/SavingsGoalForm';
import SavingsGoalList from '../components/savings/SavingsGoalList';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'failed';
}

const SavingsPage = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  const handleAddGoal = (goal: SavingsGoal) => {
    setGoals(prev => [goal, ...prev]);
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Savings Tracker</h1>
        <div className="mb-6">
          <SavingsGoalForm onAddGoal={handleAddGoal} />
        </div>
        <SavingsGoalList goals={goals} />
      </div>
    </Layout>
  );
};

export default SavingsPage;