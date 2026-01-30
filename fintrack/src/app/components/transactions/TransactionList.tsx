'use client';

import { useState } from 'react';
import TransactionItem from './TransactionItem';

// Define transaction type
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

// Sample data for demonstration
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salary',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    date: '2023-06-01',
    recurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '2',
    description: 'Rent',
    amount: 1200,
    type: 'expense',
    category: 'Housing',
    date: '2023-06-02',
    recurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '3',
    description: 'Groceries',
    amount: 150,
    type: 'expense',
    category: 'Food',
    date: '2023-06-05'
  },
  {
    id: '4',
    description: 'Freelance Work',
    amount: 500,
    type: 'income',
    category: 'Freelance',
    date: '2023-06-10'
  },
  {
    id: '5',
    description: 'Dining Out',
    amount: 75,
    type: 'expense',
    category: 'Food',
    date: '2023-06-15'
  }
];

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter transactions based on type
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  // Sort transactions based on sortBy and sortOrder
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  // Handle delete transaction
  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">Transactions</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="flex space-x-2">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
          <button
            onClick={toggleSortOrder}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              {sortOrder === 'asc' ? (
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h12M1 5h12M1 9h12"/>
              ) : (
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 9h12M1 5h12M1 1h12"/>
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {sortedTransactions.length > 0 ? (
          <div className="space-y-4 p-4">
            {sortedTransactions.map(transaction => (
              <div key={transaction.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-base">{transaction.description}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{transaction.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ml-3 ${transaction.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{transaction.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</p>
                    <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                {transaction.recurring && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recurring</p>
                    <p className="text-sm text-gray-900 dark:text-white">{transaction.recurringFrequency}</p>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-300 hover:border-red-500 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No transactions found. Add a new transaction to get started.</p>
          </div>
        )}
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 xl:px-6 py-3">Date</th>
              <th scope="col" className="px-4 xl:px-6 py-3">Description</th>
              <th scope="col" className="px-4 xl:px-6 py-3">Category</th>
              <th scope="col" className="px-4 xl:px-6 py-3">Type</th>
              <th scope="col" className="px-4 xl:px-6 py-3">Amount</th>
              <th scope="col" className="px-4 xl:px-6 py-3">Recurring</th>
              <th scope="col" className="px-4 xl:px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  onDelete={handleDelete} 
                />
              ))
            ) : (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td colSpan={7} className="px-4 xl:px-6 py-4 text-center">
                  No transactions found. Add a new transaction to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;