import { randomUUID } from 'node:crypto';

export enum BankAccountType {
  CHECKING = 'CHECKING',
  INVESTMENT = 'INVESTMENT',
  CASH = 'CASH',
}

export type Attributes = {
  id?: string;
  userId: string;
  name: string;
  initialBalanceInCents: number;
  type: BankAccountType;
  color: string;
  createdAt?: Date;
};

export class BankAccount {
  readonly id: string;
  readonly userId: string;
  name: string;
  initialBalanceInCents: number;
  type: BankAccountType;
  color: string;
  readonly createdAt: Date;

  constructor(attr: Attributes) {
    this.id = attr.id ?? randomUUID();
    this.userId = attr.userId;
    this.name = attr.name;
    this.initialBalanceInCents = attr.initialBalanceInCents;
    this.type = attr.type;
    this.color = attr.color;
    this.createdAt = attr.createdAt ?? new Date();
  }

  public update(attr: Omit<Attributes, 'id' | 'userId' | 'createdAt'>) {
    this.name = attr.name;
    this.initialBalanceInCents = attr.initialBalanceInCents;
    this.type = attr.type;
    this.color = attr.color;
  }
}
