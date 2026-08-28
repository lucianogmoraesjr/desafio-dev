import { Wallet } from "lucide-react";
import Link from "next/link";

import { getUser } from "@/lib/dal";
import { AvatarDropdown } from "@/components/avatar-dropdown";
import { AppProviders } from "./_components/app-providers";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppProviders>
      <div className="flex h-screen w-full flex-col gap-4 p-4 lg:px-8 lg:pb-8 lg:pt-6">
        <header className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex h-6 items-center gap-1 font-medium text-xl text-primary"
          >
            <Wallet className="size-5 text-primary mt-0.5" />
            psa.finance
          </Link>

          <AvatarDropdown initials={getInitials(user?.name ?? "")} />
        </header>

        <main className="flex max-h-full flex-1 flex-col gap-4 lg:flex-row">
          {children}
        </main>
      </div>
    </AppProviders>
  );
}
