import { randomUUID } from 'node:crypto';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

export type Attributes = {
  id?: string;
  userId: string;
  name: string;
  type: TransactionType;
  createdAt?: Date;
};

export class Category {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly type: TransactionType;
  readonly createdAt: Date;

  constructor(attr: Attributes) {
    this.id = attr.id ?? randomUUID();
    this.userId = attr.userId;
    this.name = attr.name;
    this.type = attr.type;
    this.createdAt = attr.createdAt ?? new Date();
  }
}
