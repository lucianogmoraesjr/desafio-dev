import { Accounts } from "./_components/accounts";
import { Fab } from "./_components/fab";
import { Transactions } from "./_components/transactions/transactions";

export default function DashboardPage() {
  return (
    <>
      <Accounts />
      <Transactions />
      <Fab />
    </>
  );
}
