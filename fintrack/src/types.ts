export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  recurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
}
