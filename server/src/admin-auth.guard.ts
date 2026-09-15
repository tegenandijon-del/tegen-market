import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header topilmadi');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const adminSecret = this.configService.get<string>('ADMIN_SECRET') || 'admin_secret_key';

    if (token !== adminSecret) {
      throw new UnauthorizedException('Admin huquqi tasdiqlanmadi');
    }

    return true;
  }
}
