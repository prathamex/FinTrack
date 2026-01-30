'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for demonstration
const sampleTransactions = [
  { id: '1', description: 'Salary', amount: 3000, type: 'income', category: 'Salary', date: '2023-06-01' },
  { id: '2', description: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2023-06-02' },
  { id: '3', description: 'Groceries', amount: 150, type: 'expense', category: 'Food', date: '2023-06-03' },
  { id: '4', description: 'Freelance Work', amount: 500, type: 'income', category: 'Freelance', date: '2023-06-05' },
  { id: '5', description: 'Dining Out', amount: 75, type: 'expense', category: 'Food', date: '2023-06-07' },
  { id: '6', description: 'Utilities', amount: 120, type: 'expense', category: 'Utilities', date: '2023-06-10' },
  { id: '7', description: 'Transportation', amount: 80, type: 'expense', category: 'Transportation', date: '2023-06-12' },
  { id: '8', description: 'Bonus', amount: 1000, type: 'income', category: 'Bonus', date: '2023-06-15' },
];

const Dashboard = () => {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  // Calculate totals
  useEffect(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);
  }, [transactions]);

  // Prepare data for income vs expense chart
  const incomeVsExpenseData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [totalIncome, totalExpense],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for expense by category chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const expenseByCategoryData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: 'Expense by Category',
        data: Object.values(expenseByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for monthly trend chart
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7); // Get YYYY-MM format
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  const months = Object.keys(monthlyData).sort();
  const monthlyTrendData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(month => monthlyData[month].income),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Expense',
        data: months.map(month => monthlyData[month].expense),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Income</h2>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Expenses</h2>
            <p className="text-3xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Balance</h2>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">Income vs Expense</h2>
            <div className="h-64 sm:h-80">
              <Bar 
                data={incomeVsExpenseData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                          size: 12
                        }
                      }
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    },
                    y: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">Expense by Category</h2>
            <div className="h-64 sm:h-80">
              <Doughnut 
                data={expenseByCategoryData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: window.innerWidth < 640 ? 'bottom' : 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 8,
                        font: {
                          size: 11
                        }
                      }
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">Monthly Trend</h2>
          <div className="h-64 sm:h-80">
            <Line 
              data={monthlyTrendData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      boxWidth: 12,
                      padding: 10,
                      font: {
                        size: 12
                      }
                    }
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: {
                        size: 10
                      }
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      font: {
                        size: 10
                      }
                    }
                  },
                },
              }}
            />
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h2>
          
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{transaction.category}</span>
                  <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 lg:px-6 py-3">Date</th>
                  <th scope="col" className="px-4 lg:px-6 py-3">Description</th>
                  <th scope="col" className="px-4 lg:px-6 py-3">Category</th>
                  <th scope="col" className="px-4 lg:px-6 py-3">Type</th>
                  <th scope="col" className="px-4 lg:px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm">{transaction.date}</td>
                    <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm">{transaction.description}</td>
                    <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm">{transaction.category}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-4 lg:px-6 py-4 font-medium text-xs lg:text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;