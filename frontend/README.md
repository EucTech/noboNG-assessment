# NoboNG Web

Next.js App Router frontend for the NoboNG cross-border commerce journey.

Full documentation — architecture, pricing model, payment simulation and trade-offs — lives in
the [root README](../README.md).

## Quick start

The API must be running first (see [`../backend`](../backend/README.md)).

```bash
cp .env.example .env.local
pnpm install
pnpm dev                 # http://localhost:3000
```

## Scripts

| Script           | Purpose                     |
| ---------------- | --------------------------- |
| `pnpm dev`       | Dev server                  |
| `pnpm build`     | Production build            |
| `pnpm start`     | Serve the production build  |
| `pnpm test`      | Vitest unit tests           |
| `pnpm typecheck` | `tsc --noEmit`              |
| `pnpm lint`      | ESLint                      |

## Routes

| Route            | Rendering | Purpose                                          |
| ---------------- | --------- | ------------------------------------------------ |
| `/`              | Static    | Banner, value strip, product showcases           |
| `/products`      | Dynamic   | Catalogue with category filter and sorting       |
| `/products/[id]` | Dynamic   | Product detail, quantity picker, add to cart     |
| `/cart`          | Client    | Line items, quantity, removal, running totals    |
| `/checkout`      | Client    | Delivery form, then the simulated payment step   |
| `/orders/[id]`   | Dynamic   | Persisted order, timeline, payment attempts      |

## Structure

```
app/          routing and page composition only
features/     products, cart, checkout, payments, orders, home
components/   ui (shadcn), layout, common
lib/          api client, formatters, utils
types/        API response contracts
```

Business logic lives in `features/`, each with its own `components`, `services`, `hooks`,
`store`, `validation`, `utils` and a barrel `index.ts`.

## Theming

Light and dark mode are driven by CSS custom properties in `app/globals.css` and toggled by
`next-themes`. Brand colours are taken from the NoboNG logo: deep green `#0A5C2E` as the
primary and `#FFC907` as the accent.
