import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL || "https://tegenmini-app-production.up.railway.app";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN muhit o'zgaruvchisi topilmadi!");
}

const bot = new Bot(BOT_TOKEN);

// Start komandasi
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard().webApp("Do'konga kirish 🛒", MINI_APP_URL);

  await ctx.reply(
    `Xush kelibsiz, ${ctx.from?.first_name || "mijoz"}!\n\n` +
      "Tegen Market do'konidan xarid qilish uchun pastdagi tugmani bosing:",
    {
      reply_markup: keyboard,
    }
  );
});

// Xatoliklarni ushlash
bot.catch((err) => {
  console.error("Botda xatolik yuz berdi:", err);
});

// Botni ishga tushirish
bot.start({
  onStart: (botInfo) => {
    console.log(`Bot muvaffaqiyatli ishga tushdi: @${botInfo.username}`);
  },
});
