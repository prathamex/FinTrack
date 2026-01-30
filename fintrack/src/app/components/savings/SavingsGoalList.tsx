'use client';

import { useState } from 'react';

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

interface EditFormData {
  goalId: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  category: string;
}

const SavingsGoalList = ({ goals = [] }: { goals?: SavingsGoal[] }) => {
  // Sample data for demonstration
  const [goalList, setGoalList] = useState<SavingsGoal[]>(goals.length > 0 ? goals : [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5000,
      targetDate: '2023-12-31',
      category: 'emergency',
      progress: 50,
      status: 'in_progress'
    },
    {
      id: '2',
      name: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 3500,
      targetDate: '2023-09-15',
      category: 'travel',
      progress: 70,
      status: 'in_progress'
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 1500,
      currentAmount: 1500,
      targetDate: '2023-05-01',
      category: 'general',
      progress: 100,
      status: 'completed'
    }
  ]);

  // State for edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    goalId: '',
    name: '',
    targetAmount: 0,
    targetDate: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleDeleteGoal = (id: string) => {
    setGoalList(prev => prev.filter(goal => goal.id !== id));
  };

  const handleAddContribution = (id: string, amount: number) => {
    setGoalList(prev => prev.map(goal => {
      if (goal.id === id) {
        const newCurrentAmount = goal.currentAmount + amount;
        const newProgress = (newCurrentAmount / goal.targetAmount) * 100;
        const newStatus = newProgress >= 100 ? 'completed' : 'in_progress';
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          progress: newProgress,
          status: newStatus
        };
      }
      return goal;
    }));
  };

  const openEditForm = (goal: SavingsGoal) => {
    setEditFormData({
      goalId: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      category: goal.category
    });
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setFormErrors({});
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'targetAmount' ? parseFloat(value) || 0 : value
    }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!editFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (editFormData.targetAmount <= 0) {
      errors.targetAmount = 'Target amount must be greater than 0';
    }
    
    if (!editFormData.targetDate) {
      errors.targetDate = 'Target date is required';
    }
    
    if (!editFormData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setGoalList(prev => prev.map(goal => {
      if (goal.id === editFormData.goalId) {
        // Recalculate progress based on new target amount
        const newProgress = (goal.currentAmount / editFormData.targetAmount) * 100;
        const newStatus = newProgress >= 100 ? 'completed' : 'in_progress';
        
        return {
          ...goal,
          name: editFormData.name,
          targetAmount: editFormData.targetAmount,
          targetDate: editFormData.targetDate,
          category: editFormData.category,
          progress: newProgress,
          status: newStatus
        };
      }
      return goal;
    }));
    
    closeEditForm();
  };

  const getTimeRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Past due';
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Savings Goals</h2>
      </div>
      
      {goalList.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>No savings goals found. Create a goal to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {goalList.map((goal) => (
            <div key={goal.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTimeRemaining(goal.targetDate)}
                  </p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                <div 
                  className={`h-2.5 rounded-full ${getProgressColor(goal.progress)}`} 
                  style={{ width: `${goal.progress > 100 ? 100 : goal.progress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {goal.progress.toFixed(0)}% complete
              </p>
              
              {/* Status badge */}
              <div className="mb-3">
                {goal.status === 'in_progress' && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    In Progress
                  </span>
                )}
                {goal.status === 'completed' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Completed
                  </span>
                )}
                {goal.status === 'failed' && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    Failed
                  </span>
                )}
              </div>
              
              {/* Add contribution form */}
              {goal.status === 'in_progress' && (
                <div className="mt-3 mb-3">
                  <div className="flex space-x-2">
                    <input 
                      type="number" 
                      id={`contribution-${goal.id}`}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                    <button 
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => {
                        const input = document.getElementById(`contribution-${goal.id}`) as HTMLInputElement;
                        const amount = parseFloat(input.value);
                        if (!isNaN(amount) && amount > 0) {
                          handleAddContribution(goal.id, amount);
                          input.value = '';
                        } else {
                          alert('Please enter a valid amount');
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-3 flex justify-end space-x-2">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => openEditForm(goal)}
                >
                  Edit
                </button>
                <button 
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Goal Modal */}
      {isEditFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Savings Goal</h3>
            
            <form onSubmit={handleEditFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Goal Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="targetAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target Amount ($)</label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={editFormData.targetAmount}
                  onChange={handleEditFormChange}
                  min="0.01"
                  step="0.01"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                {formErrors.targetAmount && <p className="mt-1 text-sm text-red-600">{formErrors.targetAmount}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="targetDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target Date</label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={editFormData.targetDate}
                  onChange={handleEditFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                {formErrors.targetDate && <p className="mt-1 text-sm text-red-600">{formErrors.targetDate}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select
                  id="category"
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Select a category</option>
                  <option value="emergency">Emergency</option>
                  <option value="travel">Travel</option>
                  <option value="education">Education</option>
                  <option value="home">Home</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="general">General</option>
                </select>
                {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditForm}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default SavingsGoalList;