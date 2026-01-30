'use client';

import Layout from '../components/Layout';
import RecurringTransactions from '../components/transactions/RecurringTransactions';

const RecurringTransactionsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recurring Transactions</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Manage your recurring income and expenses. Set up automatic transactions that occur on a regular schedule.
        </p>
        
        <RecurringTransactions />
      </div>
    </Layout>
  );
};

export default RecurringTransactionsPage;