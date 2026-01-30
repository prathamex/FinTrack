'use client';

import { useState } from 'react';

interface SavingsGoalFormProps {
  onAddGoal: (goal: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    progress: number;
    status: 'in_progress' | 'completed' | 'failed';
  }) => void;
}

const SavingsGoalForm = ({ onAddGoal }: SavingsGoalFormProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [goal, setGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'general',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setGoal(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!goal.name || !goal.targetAmount || !goal.targetDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new goal with ID
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      targetAmount: parseFloat(goal.targetAmount as string),
      currentAmount: parseFloat(goal.currentAmount as string) || 0,
      progress: ((parseFloat(goal.currentAmount as string) || 0) / parseFloat(goal.targetAmount as string)) * 100,
      status: 'in_progress', // 'in_progress', 'completed', 'failed'
    };

    // Add goal
    onAddGoal({
      ...newGoal,
      status: 'in_progress' as 'in_progress' | 'completed' | 'failed'
    });

    // Reset form
    setGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'general',
    });

    // Close form
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Savings Goal</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isFormOpen ? 'Cancel' : 'Add Goal'}
        </button>
      </div>
      
      {isFormOpen && (
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Goal Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={goal.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., New Car, Vacation, Emergency Fund"
                  required
                />
              </div>
              <div>
                <label htmlFor="targetAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target Amount</label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={goal.targetAmount}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="currentAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Amount (optional)</label>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  value={goal.currentAmount}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="targetDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target Date</label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={goal.targetDate}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select
                  id="category"
                  name="category"
                  value={goal.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="general">General</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="retirement">Retirement</option>
                  <option value="education">Education</option>
                  <option value="travel">Travel</option>
                  <option value="home">Home</option>
                  <option value="car">Car</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Goal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalForm;