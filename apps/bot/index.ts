import { Bot, InlineKeyboard, Keyboard } from 'grammy';

const BOT_TOKEN=process.env.BOT_TOKEN!; const API_URL=(process.env.API_URL||'https://tegenserver-production.up.railway.app').replace(/\/$/,''); const MINI_APP_URL=process.env.MINI_APP_URL||'https://tegenmini-app-production.up.railway.app'; const TOKEN=process.env.ADMIN_PANEL_TOKEN||'';
const OWNER_ID=String(process.env.OWNER_TELEGRAM_ID||'');
const STATIC_ADMINS=String(process.env.ADMIN_TELEGRAM_IDS||process.env.ADMIN_TELEGRAM_ID||'').split(',').map(x=>x.trim()).filter(Boolean);
if(!BOT_TOKEN) throw new Error('BOT_TOKEN .env da topilmadi');
const bot=new Bot(BOT_TOKEN); const awaitingReject=new Map<number,string>(); const awaitingNak=new Map<number,string>();
const pendingLanguage=new Set<number>();
const tr:any={
 uz:{hello:'Assalomu alaykum',phone:'Avval telefon raqamingizni yuboring.',phoneBtn:'📱 Raqamni yuborish',saved:'✅ Raqamingiz saqlandi.',choose:'🌐 Tilni tanlang:',uz:'🇺🇿 O‘zbekcha',ru:'🇷🇺 Русский',shop:'🛍️ TEGEN do‘kon',open:'Do‘konni ochish',menu:'Asosiy menyu',orders:'📦 Buyurtmalarim',saving:'💳 TEGEN Nakopitel',support:'💬 Yordam',language:'🌐 Tilni almashtirish',home:'🏠 Bosh sahifa',langSaved:'✅ Til saqlandi: O‘zbekcha',langSavedRu:'✅ Язык сохранён: Русский',staffOnly:'Bu bo‘lim faqat xodimlar uchun.',owner:'👑 TEGEN EGA',admin:'👨‍💼 TEGEN ADMIN',select:'Boshqaruvni tanlang:'},
 ru:{hello:'Здравствуйте',phone:'Сначала отправьте свой номер телефона.',phoneBtn:'📱 Отправить номер',saved:'✅ Номер сохранён.',choose:'🌐 Выберите язык:',uz:'🇺🇿 O‘zbekcha',ru:'🇷🇺 Русский',shop:'🛍️ Магазин TEGEN',open:'Открыть магазин',menu:'Главное меню',orders:'📦 Мои заказы',saving:'💳 TEGEN Накопитель',support:'💬 Поддержка',language:'🌐 Сменить язык',home:'🏠 Главная',langSaved:'✅ Язык saqlandi: O‘zbekcha',langSavedRu:'✅ Язык сохранён: Русский',staffOnly:'Этот раздел только для сотрудников.',owner:'👑 TEGEN ВЛАДЕЛЕЦ',admin:'👨‍💼 TEGEN АДМИН',select:'Выберите раздел:'}
};
function L(lang:string){return lang==='ru'?'ru':'uz'}
async function langOf(id:number|string){const u=await dbUser(id);return L(u?.language)}
function customerKeyboard(lang:string){const x=tr[L(lang)];return new Keyboard().text(x.shop).row().text(x.orders).text(x.saving).row().text(x.support).text(x.language).row().resized()}
async function showCustomerMenu(ctx:any,lang?:string){const l=lang||await langOf(ctx.from.id);const x=tr[l];await ctx.reply(x.menu,{reply_markup:customerKeyboard(l)});}
async function askLanguage(ctx:any){await ctx.reply(tr.uz.choose,{reply_markup:new InlineKeyboard().text(tr.uz.uz,'lang_uz').text(tr.uz.ru,'lang_ru')});}

async function api(path:string,options:RequestInit={},actorId?:number|string){const r=await fetch(API_URL+path,{...options,headers:{'Content-Type':'application/json','x-admin-token':TOKEN,'x-admin-telegram-id':String(actorId||'panel'),'x-bot-token':BOT_TOKEN,...(options.headers||{})}});if(!r.ok)throw new Error(`${r.status}: ${await r.text().catch(()=> '')}`);return r.json().catch(()=>({}));}
async function dbUser(id:number|string){try{return await fetch(`${API_URL}/users/${id}`,{headers:{'x-admin-token':TOKEN,'x-admin-telegram-id':'panel'}}).then(r=>r.ok?r.json():null)}catch{return null}}
async function role(id:number|string){const u=await dbUser(id);if(String(id)===OWNER_ID)return 'OWNER';if(u?.role==='OWNER'||u?.role==='ADMIN')return u.role;if(STATIC_ADMINS.includes(String(id)))return 'ADMIN';return u?.role||'USER'}
const isStaff=async(id:number|string)=>['OWNER','ADMIN'].includes(await role(id)); const isOwner=async(id:number|string)=>String(id)===OWNER_ID||(await role(id))==='OWNER';

bot.command('start',async ctx=>{const id=String(ctx.from.id);const u=await dbUser(id);if(u?.phone){if(!u.language){pendingLanguage.add(ctx.from.id);return askLanguage(ctx);}await ctx.reply(`${tr[L(u.language)].hello}, ${ctx.from.first_name||''}! 👋`,{reply_markup:customerKeyboard(L(u.language))});await ctx.reply(tr[L(u.language)].shop,{reply_markup:{inline_keyboard:[[{text:tr[L(u.language)].open,web_app:{url:MINI_APP_URL}}]]}});return}const kb=new Keyboard().requestContact(tr.uz.phoneBtn).resized().oneTime();await ctx.reply(`${tr.uz.hello}! 👋\n\n${tr.uz.phone}`,{reply_markup:kb});});

bot.on('message:contact',async ctx=>{const c=ctx.message.contact;if(c.user_id&&c.user_id!==ctx.from.id)return ctx.reply('Iltimos, o‘zingizning raqamingizni yuboring.');await api('/users/sync',{method:'POST',body:JSON.stringify({telegramId:String(ctx.from.id),firstName:ctx.from.first_name,lastName:ctx.from.last_name,username:ctx.from.username,phone:c.phone_number,language:'uz'})});pendingLanguage.add(ctx.from.id);await ctx.reply(tr.uz.saved,{reply_markup:{remove_keyboard:true}});return askLanguage(ctx);});

bot.callbackQuery(/^lang_(uz|ru)$/,async ctx=>{const language=ctx.match[1];await api('/users/language',{method:'POST',body:JSON.stringify({telegramId:String(ctx.from.id),language})},ctx.from.id);pendingLanguage.delete(ctx.from.id);await ctx.answerCallbackQuery({text:language==='ru'?'Русский':'O‘zbekcha'});await ctx.editMessageReplyMarkup({reply_markup:undefined}).catch(()=>{});const l=L(language);const x=tr[l];await ctx.reply(language==='ru'?x.langSavedRu:x.langSaved,{reply_markup:customerKeyboard(l)});await ctx.reply(x.shop,{reply_markup:{inline_keyboard:[[{text:x.open,web_app:{url:MINI_APP_URL}}]]}});});

bot.hears(/^(🛍️ TEGEN do‘kon|🛍️ Магазин TEGEN)$/,async ctx=>{const l=await langOf(ctx.from.id);const x=tr[l];await ctx.reply(x.shop,{reply_markup:{inline_keyboard:[[{text:x.open,web_app:{url:MINI_APP_URL}}]]}});});
bot.hears(/^(📦 Buyurtmalarim|📦 Мои заказы)$/,async ctx=>{const l=await langOf(ctx.from.id);await ctx.reply(l==='ru'?'📦 Заказы можно посмотреть в приложении TEGEN.':'📦 Buyurtmalarni TEGEN ilovasida ko‘rishingiz mumkin.',{reply_markup:{inline_keyboard:[[{text:tr[l].open,web_app:{url:MINI_APP_URL}}]]}});});
bot.hears(/^(💳 TEGEN Nakopitel|💳 TEGEN Накопитель)$/,async ctx=>{const l=await langOf(ctx.from.id);await ctx.reply(l==='ru'?'💳 Накопитель и кэшбэк доступны в профиле приложения TEGEN.':'💳 Nakopitel va cashback TEGEN ilovasidagi profilingizda mavjud.',{reply_markup:{inline_keyboard:[[{text:tr[l].open,web_app:{url:MINI_APP_URL}}]]}});});
bot.hears(/^(💬 Yordam|💬 Поддержка)$/,async ctx=>{const l=await langOf(ctx.from.id);await ctx.reply(l==='ru'?'💬 Напишите свой вопрос следующим сообщением — он будет отправлен администратору.':'💬 Savolingizni keyingi xabarda yozing — u adminga yuboriladi.');});
bot.hears(/^(🌐 Tilni almashtirish|🌐 Сменить язык)$/,async ctx=>askLanguage(ctx));

async function ownerMenu(ctx:any){const l=await langOf(ctx.from.id);const x=tr[l];await ctx.reply(`${x.owner}\n\n${x.select}`,{reply_markup:new InlineKeyboard().text(l==='ru'?'👨‍💼 Админы':'👨‍💼 Adminlar','staff_admins').text(l==='ru'?'👷 Работники':'👷 Ishchilar').row().text(l==='ru'?'📝 Заявки':'📝 Takliflar','proposals').text('💳 Nakopitel','nak_apps').row().text('📜 Audit','audit').text(l==='ru'?'🛍️ Товары':'🛍 Mahsulotlar','open_shop').row().text('🌐 '+(l==='ru'?'Язык':'Til'),'owner_lang')});}
async function adminMenu(ctx:any){const l=await langOf(ctx.from.id);const x=tr[l];await ctx.reply(`${x.admin}\n\n${x.select}`,{reply_markup:new InlineKeyboard().text(l==='ru'?'📦 Заказы':'📦 Buyurtmalar','orders').text(l==='ru'?'📝 Заявки':'📝 Takliflar','proposals').row().text('💳 Nakopitel','nak_apps').text(l==='ru'?'🛍️ Товары':'🛍 Mahsulotlar','open_shop').row().text('🌐 '+(l==='ru'?'Язык':'Til'),'owner_lang')});}
bot.command('admin',async ctx=>{if(await isOwner(ctx.from.id))return ownerMenu(ctx);if(await isStaff(ctx.from.id))return adminMenu(ctx);const l=await langOf(ctx.from.id);await ctx.reply(tr[l].staffOnly);});
bot.callbackQuery('owner_lang
