import { randomUUID } from 'node:crypto';

export type Attributes = {
  id?: string;
  userId: string;
  name: string;
  createdAt?: Date;
};

export class Category {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly createdAt: Date;

  constructor(attr: Attributes) {
    this.id = attr.id ?? randomUUID();
    this.userId = attr.userId;
    this.name = attr.name;
    this.createdAt = attr.createdAt ?? new Date();
  }
}
