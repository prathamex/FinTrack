'use client';

import { useState } from 'react';

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

const BudgetList = ({ budgets = [] }: { budgets?: Budget[] }) => {
  // Sample data for demonstration
  const [budgetList, setBudgetList] = useState<Budget[]>(budgets.length > 0 ? budgets : [
    {
      id: '1',
      category: 'Food',
      amount: 500,
      period: 'monthly',
      alertThreshold: 80,
      spent: 350,
      remaining: 150,
      status: 'warning'
    },
    {
      id: '2',
      category: 'Transportation',
      amount: 200,
      period: 'monthly',
      alertThreshold: 80,
      spent: 120,
      remaining: 80,
      status: 'good'
    },
    {
      id: '3',
      category: 'Entertainment',
      amount: 150,
      period: 'monthly',
      alertThreshold: 80,
      spent: 160,
      remaining: -10,
      status: 'exceeded'
    }
  ]);

  const handleDeleteBudget = (id: string) => {
    setBudgetList(prev => prev.filter(budget => budget.id !== id));
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'exceeded':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  const getProgressPercentage = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    return percentage > 100 ? 100 : percentage; // Cap at 100%
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Budgets</h2>
      </div>
      
      {budgetList.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>No budgets found. Create a budget to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {budgetList.map((budget) => (
            <div key={budget.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{budget.category}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{budget.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium ${budget.status === 'exceeded' ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {budget.status === 'exceeded' 
                      ? `Exceeded by $${Math.abs(budget.remaining).toFixed(2)}` 
                      : `$${budget.remaining.toFixed(2)} remaining`}
                  </p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                <div 
                  className={`h-2.5 rounded-full ${getProgressColor(budget.status)}`} 
                  style={{ width: `${getProgressPercentage(budget.spent, budget.amount)}%` }}
                ></div>
              </div>
              
              {/* Alert message */}
              {budget.status === 'warning' && (
                <div className="p-2 mt-2 bg-yellow-100 text-yellow-800 text-sm rounded-lg dark:bg-yellow-200 dark:text-yellow-900">
                  <p>Warning: You have used {((budget.spent / budget.amount) * 100).toFixed(0)}% of your budget</p>
                </div>
              )}
              
              {budget.status === 'exceeded' && (
                <div className="p-2 mt-2 bg-red-100 text-red-800 text-sm rounded-lg dark:bg-red-200 dark:text-red-900">
                  <p>Alert: You have exceeded your budget by ${Math.abs(budget.remaining).toFixed(2)}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-3 flex justify-end space-x-2">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => alert('Edit functionality would go here')}
                >
                  Edit
                </button>
                <button 
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => handleDeleteBudget(budget.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetList;