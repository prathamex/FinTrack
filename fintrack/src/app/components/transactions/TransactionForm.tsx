"use client";

import { useState } from "react";
import type { Transaction } from "../../../types";

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  type TransactionFormState = Omit<Transaction, "id" | "amount"> & {
    amount: string | number;
  };

  const [transaction, setTransaction] = useState<TransactionFormState>({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    recurring: false,
    recurringFrequency: "monthly",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setTransaction((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
      // Handle checkbox separately
      ...(name === "recurring" && type === "checkbox"
        ? { [name]: (e.target as HTMLInputElement).checked }
        : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !transaction.description ||
      !transaction.amount ||
      !transaction.category ||
      !transaction.date
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new transaction with ID
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      amount: parseFloat(transaction.amount as string),
    };

    // Add transaction
    onAddTransaction(newTransaction);

    // Reset form
    setTransaction({
      description: "",
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      recurring: false,
      recurringFrequency: "monthly",
    });

    // Close form
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Add New Transaction
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isFormOpen ? "Cancel" : "Add Transaction"}
        </button>
      </div>

      {isFormOpen && (
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={transaction.description}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Grocery shopping"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={transaction.type}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={transaction.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Food, Housing, Transportation"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={transaction.date}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    name="recurring"
                    checked={transaction.recurring}
                    onChange={(e) =>
                      setTransaction((prev) => ({
                        ...prev,
                        recurring: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="recurring"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Recurring Transaction
                  </label>
                </div>
                {transaction.recurring && (
                  <select
                    id="recurringFrequency"
                    name="recurringFrequency"
                    value={transaction.recurringFrequency}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Transaction
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
