import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrUserId = createParamDecorator(
    (data: undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user['sub'];
    }
); 