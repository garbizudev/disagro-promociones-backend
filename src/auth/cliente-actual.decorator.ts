import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ClienteActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.clienteId;
  },
);
