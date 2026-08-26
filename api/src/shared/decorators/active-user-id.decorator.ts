import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const ActiveUserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const { userId } = context.switchToHttp().getRequest();

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException();
    }

    return userId;
  },
);
