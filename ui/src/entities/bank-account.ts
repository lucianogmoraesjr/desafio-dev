export type BankAccount = {
  id: string;
  name: string;
  initialBalanceInCents: number;
  type: "CHECKING" | "INVESTMENT" | "CASH";
  color: string;
  currentBalanceInCents: number;
};
