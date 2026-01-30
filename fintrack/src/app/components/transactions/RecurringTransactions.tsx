"use client";

import { useState } from "react";

interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  nextDate: string;
  active: boolean;
}

const RecurringTransactions = () => {
  // Sample data for demonstration
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([
    {
      id: "1",
      description: "Salary",
      amount: 3000,
      type: "income",
      category: "Salary",
      frequency: "monthly",
      startDate: "2023-01-01",
      nextDate: "2023-07-01",
      active: true,
    },
    {
      id: "2",
      description: "Rent",
      amount: 1200,
      type: "expense",
      category: "Housing",
      frequency: "monthly",
      startDate: "2023-01-05",
      nextDate: "2023-07-05",
      active: true,
    },
    {
      id: "3",
      description: "Netflix Subscription",
      amount: 15.99,
      type: "expense",
      category: "Entertainment",
      frequency: "monthly",
      startDate: "2023-01-15",
      nextDate: "2023-07-15",
      active: true,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<
    Omit<RecurringTransaction, "id" | "nextDate">
  >({
    description: "",
    amount: 0,
    type: "expense",
    category: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    active: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setNewTransaction((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
      // Handle checkbox separately
      ...(name === "active" && type === "checkbox"
        ? { [name]: (e.target as HTMLInputElement).checked }
        : {}),
    }));
  };

  const calculateNextDate = (startDate: string, frequency: string): string => {
    const date = new Date(startDate);
    const now = new Date();

    // Ensure the next date is in the future
    while (date <= now) {
      switch (frequency) {
        case "daily":
          date.setDate(date.getDate() + 1);
          break;
        case "weekly":
          date.setDate(date.getDate() + 7);
          break;
        case "monthly":
          date.setMonth(date.getMonth() + 1);
          break;
        case "yearly":
          date.setFullYear(date.getFullYear() + 1);
          break;
      }
    }

    return date.toISOString().split("T")[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !newTransaction.description ||
      !newTransaction.amount ||
      !newTransaction.category ||
      !newTransaction.startDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new transaction with ID and next date
    const nextDate = calculateNextDate(
      newTransaction.startDate,
      newTransaction.frequency
    );

    const transaction: RecurringTransaction = {
      ...newTransaction,
      id: Date.now().toString(),
      nextDate,
    };

    // Add transaction
    setTransactions((prev) => [transaction, ...prev]);

    // Reset form
    setNewTransaction({
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      active: true,
    });

    // Close form
    setIsFormOpen(false);
  };

  const toggleActive = (id: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, active: !transaction.active }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  };

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return frequency;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recurring Transactions
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isFormOpen ? "Cancel" : "Add Recurring"}
        </button>
      </div>

      {isFormOpen && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                  value={newTransaction.description}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Rent, Salary, Subscription"
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
                  value={
                    isNaN(newTransaction.amount) ? "" : newTransaction.amount
                  }
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
                  value={newTransaction.type}
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
                  value={newTransaction.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Food, Housing, Transportation"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="frequency"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={newTransaction.frequency}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newTransaction.startDate}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={newTransaction.active}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="active"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Active
              </label>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Recurring Transaction
            </button>
          </form>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>No recurring transactions found. Add one to get started.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-base">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {getFrequencyLabel(transaction.frequency)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {transaction.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Amount
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        ${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Category
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Next Date
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {transaction.nextDate}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => toggleActive(transaction.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-300 hover:border-blue-500 rounded transition-colors"
                    >
                      {transaction.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-300 hover:border-red-500 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Frequency
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Next Date
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 xl:px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-4 xl:px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td
                      className={`px-4 xl:px-6 py-4 font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      {transaction.category}
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      {getFrequencyLabel(transaction.frequency)}
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      {transaction.nextDate}
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(transaction.id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                      >
                        {transaction.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RecurringTransactions;
