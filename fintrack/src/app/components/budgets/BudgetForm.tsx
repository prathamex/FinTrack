'use client';

import { useState } from 'react';

interface BudgetFormProps {
  onAddBudget: (budget: {
    id: string;
    category: string;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    alertThreshold: number;
    spent: number;
    remaining: number;
    status: 'good' | 'warning' | 'exceeded';
  }) => void;
}

const BudgetForm = ({ onAddBudget }: BudgetFormProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [budget, setBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    alertThreshold: 80, // Alert when 80% of budget is used
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBudget(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!budget.category || !budget.amount || !budget.period) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new budget with ID
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      amount: parseFloat(budget.amount as string),
      alertThreshold: parseInt(budget.alertThreshold as unknown as string),
      spent: 0, // Initialize with 0 spent
      remaining: parseFloat(budget.amount as string), // Initialize remaining as full amount
      status: 'good', // 'good', 'warning', 'exceeded'
    };

    // Add budget
    onAddBudget({
      ...newBudget,
      period: newBudget.period as 'weekly' | 'monthly' | 'yearly',
      status: newBudget.status as 'good' | 'warning' | 'exceeded'
    });

    // Reset form
    setBudget({
      category: '',
      amount: '',
      period: 'monthly',
      alertThreshold: 80,
    });

    // Close form
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Budget</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isFormOpen ? 'Cancel' : 'Add Budget'}
        </button>
      </div>
      
      {isFormOpen && (
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={budget.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Food, Housing, Transportation"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={budget.amount}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="period" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget Period</label>
                <select
                  id="period"
                  name="period"
                  value={budget.period}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label htmlFor="alertThreshold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Alert Threshold (%) - Alert when this percentage of budget is used
                </label>
                <input
                  type="range"
                  id="alertThreshold"
                  name="alertThreshold"
                  value={budget.alertThreshold}
                  onChange={handleChange}
                  min="50"
                  max="100"
                  step="5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>50%</span>
                  <span>{budget.alertThreshold}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Budget
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BudgetForm;