# TEGEN — marketplace

TEGEN is a Telegram Mini App marketplace with a NestJS/Prisma backend, Telegram bot and admin panel.

## Roles
- OWNER — Ega/Boss. Full control, including adding/removing admins and workers.
- ADMIN — full store management except changing OWNER/admin staff.
- WORKER — works in an assigned department and submits product proposals for admin approval.
- USER — customer.

## Main features
- Server-side order totals: database price × quantity.
- Order status history and audit log: who accepted/changed what and when.
- Product/category management.
- Worker proposals: create/update/delete proposals require admin approval.
- Telegram customer support with text and photos.
- CMS-style banners managed from the admin panel.
- TEGEN Nakopitel: application, admin approval/rejection and 2% cashback on completed orders.
- Red TEGEN marketplace UI.

## Required server environment
`DATABASE_URL`, `BOT_TOKEN`, `API_URL`, `MINI_APP_URL`, `ADMIN_PANEL_TOKEN`, `OWNER_TELEGRAM_ID`, `ADMIN_TELEGRAM_IDS`.

`ADMIN_TELEGRAM_IDS` is comma-separated.

## Deployment
The server build runs Prisma generate + db push + Nest build. On a fresh database this creates the new schema automatically.
