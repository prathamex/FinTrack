'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<Transaction>(transaction);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically call an API to update the transaction
    // For now, we'll just update the local state
    console.log('Saving transaction:', editedTransaction);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTransaction(transaction);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setEditedTransaction(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
      // Handle checkbox separately
      ...(name === 'recurring' && type === 'checkbox' ? { [name]: (e.target as HTMLInputElement).checked } : {})
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isEditing) {
    return (
      <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
        <td className="px-6 py-4">
          <input
            type="date"
            name="date"
            value={editedTransaction.date}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            name="description"
            value={editedTransaction.description}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            name="category"
            value={editedTransaction.category}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <select
            name="type"
            value={editedTransaction.type}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            name="amount"
            value={editedTransaction.amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="recurring"
              checked={editedTransaction.recurring || false}
              onChange={(e) => setEditedTransaction(prev => ({ ...prev, recurring: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            {editedTransaction.recurring && (
              <select
                name="recurringFrequency"
                value={editedTransaction.recurringFrequency}
                onChange={handleChange}
                className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="font-medium text-gray-600 dark:text-gray-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="px-6 py-4">{formatDate(transaction.date)}</td>
      <td className="px-6 py-4">{transaction.description}</td>
      <td className="px-6 py-4">{transaction.category}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </span>
      </td>
      <td className={`px-6 py-4 font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {formatCurrency(transaction.amount)}
      </td>
      <td className="px-6 py-4">
        {transaction.recurring ? (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
              {transaction.recurringFrequency?.charAt(0).toUpperCase() + transaction.recurringFrequency?.slice(1)}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="font-medium text-red-600 dark:text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionItem;