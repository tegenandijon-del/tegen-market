# TEGEN — GitHub + Railway'da ishga tushirish

## 1. GitHub'ga yuklash
```bash
cd tegen-main
git init
git add .
git commit -m "Admin panel, buyurtma oqimi va bot yangilandi"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## 2. Railway'da 3 ta alohida servis yarating (bitta repodan)
Railway'da "New Project" → "Deploy from GitHub repo" → shu repo. Har bir servis uchun **Root Directory**ni sozlang:

### a) PostgreSQL
Railway'da "New" → "Database" → "PostgreSQL" qo'shing. `DATABASE_URL` avtomatik yaratiladi.

### b) Server (backend)
- Root Directory: `server`
- Build command: `npm install && npx prisma generate && npx prisma db push && npm run build`
- Start command: `npm run start:prod`
- Environment variables:
  - `DATABASE_URL` — Postgres servisidan Reference qiling
  - `BOT_TOKEN` — @BotFather tokeni
  - `ADMIN_TELEGRAM_IDS` — adminlaringizning Telegram ID(lari), vergul bilan
  - `ADMIN_PANEL_TOKEN` — o'zingiz o'ylab topgan maxfiy parol
  - `PORT` — Railway avtomatik beradi

### c) Mini-app (frontend)
- Root Directory: `apps/mini-app`
- Build command: `npm install && npm run build`
- Start command: `npm run preview`
- Environment variable: `VITE_API_URL` — server servisining Railway domeni (masalan `https://tegenserver-production.up.railway.app`)

### d) Bot
- Root Directory: `apps/bot`
- Build command: `npm install`
- Start command: `npx tsx index.ts`
- Environment variables:
  - `BOT_TOKEN`
  - `API_URL` — server servisining domeni
  - `MINI_APP_URL` — mini-app servisining domeni
  - `ADMIN_PANEL_TOKEN` — server bilan bir xil qiymat
  - `ADMIN_TELEGRAM_IDS`

## 3. Admin panelni ochish
`apps/admin/index.html` faylini istalgan statik hosting'ga (Railway'da alohida "Static" servis, yoki oddiy Netlify/Vercel) joylang, yoki hozircha shunchaki faylni brauzerda oching. Kirishda:
- **Server API manzili**: server servisining Railway domeni
- **Admin token**: `.env`dagi `ADMIN_PANEL_TOKEN` bilan bir xil

## 4. @BotFather'da mini-app tugmasini ulash
`/mybots` → botingiz → `Bot Settings` → `Menu Button` → mini-app domenini kiriting (ixtiyoriy, chunki bot kodi buni avtomatik ham sozlaydi).

## Eslatma
- Mahsulot rasmlari **URL** sifatida kiritiladi (admin panelda "Rasm URL" maydoni) — fayl yuklash emas, chunki Railway serverning fayl tizimi doimiy emas. Rasmni avval biror joyga (Imgur, Telegram, va h.k.) joylab, linkini kiritasiz.


## TEGEN 2.0 sozlamalari

Server env: `OWNER_TELEGRAM_ID`, `ADMIN_TELEGRAM_IDS`, `ADMIN_PANEL_TOKEN`, `BOT_TOKEN`, `DATABASE_URL`.
Database yangilangach `npm --prefix server run prisma:db-push` ni bir marta ishga tushiring. Admin panelga kirishda token bilan birga aynan o‘sha Ega/Admin Telegram ID sini kiriting.
