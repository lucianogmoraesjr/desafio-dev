import { randomUUID } from 'node:crypto';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export type Attributes = {
  id?: string;
  userId: string;
  bankAccountId: string;
  categoryId?: string;
  name: string;
  valueInCents: number;
  date: Date;
  type: TransactionType;
};

export class Transaction {
  readonly id: string;
  readonly userId: string;
  bankAccountId: string;
  categoryId?: string;
  name: string;
  valueInCents: number;
  date: Date;
  type: TransactionType;

  constructor(attr: Attributes) {
    this.id = attr.id ?? randomUUID();
    this.userId = attr.userId;
    this.bankAccountId = attr.bankAccountId;
    this.categoryId = attr.categoryId;
    this.name = attr.name;
    this.valueInCents = attr.valueInCents;
    this.date = attr.date;
    this.type = attr.type;
  }

  public update(attr: Omit<Attributes, 'id' | 'userId'>) {
    this.bankAccountId = attr.bankAccountId;
    this.categoryId = attr.categoryId;
    this.name = attr.name;
    this.valueInCents = attr.valueInCents;
    this.date = attr.date;
    this.type = attr.type;
  }
}
