"use client";

import { SignupForm } from "@/components/signup-form";
import { Wallet } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex h-6 items-center gap-1 font-medium text-xl text-primary"
          >
            <Wallet className="size-5 text-primary mt-0.5" />
            psa.finance
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-end p-10 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Gestão inteligente para o seu dinheiro.
          </h2>
          <p className="text-emerald-100/80 text-lg">
            Acompanhe suas receitas, controle suas despesas e alcance seus
            objetivos financeiros em um só lugar.
          </p>
        </div>
      </div>
    </div>
  );
}
