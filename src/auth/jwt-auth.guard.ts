import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers?.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token no proporcionado");
    }

    const token = authHeader.slice(7);

    try {
      const payload = this.jwtService.verify(token);
      request.clienteId = payload.clienteId;
      return true;
    } catch {
      throw new UnauthorizedException("Token invalido o expirado");
    }
  }
}
