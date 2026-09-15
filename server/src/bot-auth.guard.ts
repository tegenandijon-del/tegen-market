import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const botSecretHeader = request.headers['x-bot-secret'];

    // Muhit o'zgaruvchilaridan maxfiy kalitni olish
    const expectedSecret =
      this.configService.get<string>('BOT_SECRET') || 'bot_secret_key';

    if (!botSecretHeader || botSecretHeader !== expectedSecret) {
      throw new UnauthorizedException(
        'Bot autentifikatsiyasidan o\'tishda xatolik: Maxfiy kalit mos kelmadi',
      );
    }

    return true;
  }
}
