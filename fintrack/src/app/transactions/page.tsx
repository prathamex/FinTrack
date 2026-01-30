'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';

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

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manage Transactions</h1>
        <TransactionForm onAddTransaction={handleAddTransaction} />
        <TransactionList />
      </div>
    </Layout>
  );
};

export default TransactionsPage;