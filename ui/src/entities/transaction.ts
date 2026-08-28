export interface Transaction {
  id: string;
  name: string;
  valueInCents: number;
  date: string;
  type: "EXPENSE" | "INCOME";
  bankAccountId: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
}
