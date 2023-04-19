import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../user.model/user.model';

type TypeData = keyof UserDocument;

export const User = createParamDecorator(
  (data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request);
    const user = request.user;
    return data ? user[data] : user;
  },
);
