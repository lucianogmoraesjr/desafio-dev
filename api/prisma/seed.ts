import 'dotenv/config';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

import { Prisma, PrismaClient } from '@/generated/prisma/client';

async function main() {
  console.log('Starting database seed...');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is missing');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await bcrypt.hash('forte123', 10);

    const user = await prisma.user.upsert({
      where: { email: 'john@mail.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@mail.com',
        password: passwordHash,
      },
    });

    console.log(`👤 User created: ${user.email}`);

    const bankAccounts = [
      {
        id: '2b0fd12e-0b68-44d1-9c8e-b81b3139dca6',
        userId: user.id,
        name: 'Nubank',
        initialBalanceInCents: 150_000,
        type: 'CHECKING',
        color: '#BE4BDB',
      },
      {
        id: 'd67e4c4d-9fb5-4ce0-b8ab-3133bdf0c7a4',
        userId: user.id,
        name: 'Carteira',
        initialBalanceInCents: 25_000,
        type: 'CASH',
        color: '#40C057',
      },
    ] satisfies Prisma.BankAccountUncheckedCreateInput[];

    await prisma.bankAccount.createMany({
      skipDuplicates: true,
      data: bankAccounts,
    });

    console.log('✅ Bank Accounts created!');

    const incomeCategories = [
      {
        id: '7ee55441-d9ca-4ef5-9e0c-564fb9b1bde8',
        userId: user.id,
        name: 'Salário',
        type: 'INCOME',
      },
    ] satisfies Prisma.CategoryUncheckedCreateInput[];

    const expenseCategories = [
      {
        id: 'dfcc5304-49a6-4286-86fc-3f2f0b6182ed',
        userId: user.id,
        name: 'Alimentação',
        type: 'EXPENSE',
      },
      {
        id: 'e1cc5dad-f750-4e65-92e3-8e1b3096439b',
        userId: user.id,
        name: 'Outros',
        type: 'EXPENSE',
      },
    ] satisfies Prisma.CategoryUncheckedCreateInput[];

    await prisma.category.createMany({
      skipDuplicates: true,
      data: [...incomeCategories, ...expenseCategories],
    });

    console.log('✅ Categories created!');

    await prisma.transaction.deleteMany({
      where: { userId: user.id },
    });

    const transactions: Prisma.TransactionCreateManyInput[] = [];
    const bankAccountIds = bankAccounts.map((ba) => ba.id);

    for (let i = 0; i < 50; i++) {
      const type = faker.helpers.arrayElement(['INCOME', 'EXPENSE'] as const);

      const category =
        type === 'INCOME'
          ? faker.helpers.arrayElement(incomeCategories)
          : faker.helpers.arrayElement(expenseCategories);

      const name =
        type === 'INCOME'
          ? faker.helpers.arrayElement([
              'Salário Mensal',
              'Bônus',
              'Rendimento CDI',
              'Freelance',
            ])
          : faker.commerce.productName();

      transactions.push({
        userId: user.id,
        bankAccountId: faker.helpers.arrayElement(bankAccountIds),
        categoryId: category.id,
        name,
        valueInCents: faker.number.int({ min: 1_000, max: 500_000 }),
        date: faker.date.recent({ days: 90 }),
        type,
      });
    }

    await prisma.transaction.createMany({
      data: transactions,
    });

    console.log(`💸 ${transactions.length} Transactions generated with Faker!`);
  } catch (error) {
    console.error('❌ Failed to seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main();
