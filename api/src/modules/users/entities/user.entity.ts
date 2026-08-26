import { randomUUID } from 'node:crypto';

export type Attributes = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;

  constructor(attr: Attributes) {
    this.id = attr.id ?? randomUUID();
    this.name = attr.name;
    this.email = attr.email;
    this.password = attr.password;
    this.createdAt = attr.createdAt ?? new Date();
  }
}
