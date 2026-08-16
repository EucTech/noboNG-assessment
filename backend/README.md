# NoboNG API

NestJS + Prisma + PostgreSQL API for the NoboNG cross-border commerce journey.

Full documentation — architecture, database design, idempotency approach, security notes and
trade-offs — lives in the [root README](../README.md).

## Quick start

```bash
cp .env.example .env     # set DATABASE_URL and DIRECT_URL
pnpm install             # runs `prisma generate` via postinstall
pnpm db:deploy           # apply migrations
pnpm db:seed             # insert demo products
pnpm start:dev           # http://localhost:4000/api
```

Once running, the interactive API reference is at <http://localhost:4000/docs> and the raw
OpenAPI document at <http://localhost:4000/docs/json>.

## Scripts

| Script             | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `pnpm start:dev`   | Watch-mode dev server                       |
| `pnpm build`       | Compile to `dist/`                          |
| `pnpm start:prod`  | Run the compiled server                     |
| `pnpm test`        | Jest unit tests                             |
| `pnpm lint`        | ESLint with type-aware rules                |
| `pnpm format`      | Prettier                                    |
| `pnpm db:generate` | Regenerate the Prisma client                |
| `pnpm db:migrate`  | Create and apply a migration (development)  |
| `pnpm db:deploy`   | Apply existing migrations (CI / production) |
| `pnpm db:seed`     | Seed products                               |
| `pnpm db:studio`   | Prisma Studio                               |

## Module map

```
src/
├── config/      environment loading, boot-time validation, swagger setup
├── common/      global exception filter, domain exceptions, error codes, swagger helpers
├── database/    PrismaService, generated client barrel
├── products/    catalogue reads
├── customers/   checkout customer upsert
├── pricing/     subtotal, shipping and total (single source of truth)
├── orders/      order creation, lookup, status transitions
├── payments/    idempotency, provider abstraction, mock provider
├── shipments/   shipment created on payment success
└── logistics/   LogisticsProvider seam for a future courier
```
