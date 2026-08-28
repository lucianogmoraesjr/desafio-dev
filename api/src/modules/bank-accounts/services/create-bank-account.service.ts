import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '@/modules/users/repositories/user.repository';

import { CreateBankAccountResponseDto } from '../dtos/create-bank-account-response.dto';
import { CreateBankAccountDto } from '../dtos/create-bank-account.dto';
import { BankAccount } from '../entities/bank-account.entity';
import { BankAccountRepository } from '../repositories/bank-account.repository';

type Input = CreateBankAccountDto & {
  userId: string;
};

type Output = CreateBankAccountResponseDto;

@Injectable()
export class CreateBankAccountService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bankAccountRepository: BankAccountRepository,
  ) {}

  async execute({
    userId,
    color,
    initialBalanceInCents,
    name,
    type,
  }: Input): Promise<Output> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const bankAccount = new BankAccount({
      userId,
      color,
      initialBalanceInCents,
      name,
      type,
    });

    await this.bankAccountRepository.create(bankAccount);

    return {
      id: bankAccount.id,
    };
  }
}
