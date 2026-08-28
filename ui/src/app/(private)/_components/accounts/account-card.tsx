import { BankAccount } from "@/entities/bank-account";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn, currencyFormatter } from "@/lib/utils";
import { BankAccountTypeIcon } from "../icons/BankAccountTypeIcon";
import { useState } from "react";
import { EditAccountDialog } from "../dialogs/edit-account-dialog";

interface AccountCardProps {
  account: BankAccount;
}

export function AccountCard({ account }: AccountCardProps) {
  const [editAccountDialogOpen, setEditAccountDialogOpen] = useState(false);

  const { valuesVisible: areValuesVisible } = useDashboard();

  const formattedBalance = currencyFormatter.format(
    account.currentBalanceInCents / 100,
  );

  return (
    <>
      <div
        role="button"
        onClick={() => setEditAccountDialogOpen(true)}
        onKeyDown={() => {}}
        tabIndex={0}
        className="flex cursor-pointer h-[200px] flex-col justify-between rounded-2xl border-b-4 border-teal-950 bg-white p-4"
        style={{
          borderColor: account.color,
        }}
      >
        <div className="font-medium tracking-[-0.5px] text-gray-800">
          <BankAccountTypeIcon type={account.type} />

          <span className="mt-4 block">{account.name}</span>
        </div>

        <div>
          <span className={cn("block", !areValuesVisible && "blur-md")}>
            {formattedBalance}
          </span>
          <small className="text-sm font-normal text-gray-600">
            Saldo atual
          </small>
        </div>
      </div>

      {editAccountDialogOpen && (
        <EditAccountDialog
          account={account}
          open={editAccountDialogOpen}
          onOpenChange={setEditAccountDialogOpen}
        />
      )}
    </>
  );
}
