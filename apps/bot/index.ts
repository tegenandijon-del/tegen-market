import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(async (ctx) => {
  const telegramId = BigInt(ctx.from.id);
  let user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId,
        firstName: ctx.from.first_name,
      },
    });
  }

  // 1. Telefon raqami yo'q bo'lsa, birinchi bo'lib raqam so'raladi
  if (!user.phone) {
    return ctx.reply(
      "Assalomu alaykum! Tegen do'koniga xush kelibsiz.\n\n" +
      "Davom etish uchun telefon raqamingizni yuboring:",
      Markup.keyboard([
        [Markup.button.contactRequest("📱 Telefon raqamni yuborish")]
      ]).resize().oneTime()
    );
  }

  // 2. Telefon raqami bo'lsa, Mini App menyusi chiqadi
  showMainMenu(ctx);
});

bot.on('contact', async (ctx) => {
  const telegramId = BigInt(ctx.from.id);
  const phone = ctx.message.contact.phone_number;

  await prisma.user.update({
    where: { telegramId },
    data: { phone },
  });

  await ctx.reply("Raqamingiz qabul qilindi!", Markup.removeKeyboard());
  showMainMenu(ctx);
});

function showMainMenu(ctx: any) {
  ctx.reply(
    "Xarid qilish uchun quyidagi tugmani bosing:",
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛍 Do'konni ochish", process.env.MINI_APP_URL!)]
    ])
  );
}

bot.launch();
