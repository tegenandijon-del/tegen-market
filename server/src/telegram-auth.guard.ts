import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header topilmadi');
    }

    // Header formati: "twa <initData>" yoki shunchaki "<initData>"
    const initData = authHeader.startsWith('twa ')
      ? authHeader.slice(4)
      : authHeader;

    if (!initData) {
      throw new UnauthorizedException('InitData mavjud emas');
    }

    const isValid = this.validateTelegramData(
      initData,
      process.env.BOT_TOKEN,
    );

    if (!isValid) {
      throw new UnauthorizedException('Telegram auth ma\'lumotlari haqiqiy emas');
    }

    // WebApp foydalanuvchisi ma'lumotlarini request.user ga biriktirish
    const urlParams = new URLSearchParams(initData);
    const userJson = urlParams.get('user');

    if (userJson) {
      request.user = JSON.parse(userJson);
    }

    return true;
  }

  private validateTelegramData(initData: string, botToken: string): boolean {
    if (!botToken) {
      throw new Error('BOT_TOKEN muhit o\'zgaruvchisi o\'rnatilmagan');
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');

    if (!hash) return false;

    urlParams.delete('hash');

    // Kalitlarni alifbo tartibida saralash
    const params: string[] = [];
    urlParams.forEach((value, key) => {
      params.push(`${key}=${value}`);
    });
    params.sort();

    const dataCheckString = params.join('\n');

    // HMAC-SHA256 orqali secret key yaratish
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Ma'lumotlarni tekshirish uchun hash hisoblash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return calculatedHash === hash;
  }
}
