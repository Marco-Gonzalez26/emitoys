# EmiToys — Agent Rules

<!-- BEGIN:nextjs-agent-rules -->
## ⚠️ This is NOT the Next.js you know

This project runs **Next.js 16** with breaking changes from previous versions.
Read `node_modules/next/dist/docs/` before writing any code. Heed all deprecation notices.

### Critical breaking changes in Next.js 16

- `middleware.ts` is **deprecated and renamed to `proxy.ts`**. The exported function must be named `proxy`, not `middleware`. Run `npx @next/codemod@canary middleware-to-proxy .` to migrate existing files.
- `skipMiddlewareUrlNormalize` is renamed to `skipProxyUrlNormalize` in `next.config.ts`.
- Caching is now **explicit** — nothing is cached by default. Use the `use cache` directive or `{ next: { revalidate: N } }` explicitly. Read `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`.
- To enable `use cache`, add `cacheComponents: true` to `next.config.ts`.
- **Server Functions** (Server Actions) are POST requests to the route where they are used — a `proxy.ts` matcher that excludes a path also skips Server Function calls on that path. Always verify auth inside each Server Action, never rely only on `proxy.ts`.
- `proxy.ts` runs in **Node.js runtime** by default. The `runtime` config option is not available in proxy files.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:project-overview -->
## Project Overview

**EmiToys** is an Ecuadorian e-commerce for diecast scale model cars (Hot Wheels, Tarmac Works, Inno64, Mini GT). It is a solo-developer project targeting collectors.

- **Package manager:** `pnpm` — never use `npm` or `yarn`
- **Deploy target:** Vercel
- **Node version:** Check `.nvmrc` or `package.json` engines field
<!-- END:project-overview -->

---

<!-- BEGIN:architecture-rules -->
## Architecture — Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design**. Understand the layer hierarchy before adding files:

```
app/          → Next.js App Router. Route files only (page.tsx, layout.tsx, loading.tsx, error.tsx).
               No business logic here. Call Server Actions or fetch from features/.
features/     → Business logic grouped by domain. Each feature is self-contained.
shared/       → Reusable code with no business logic. No imports from features/ allowed here.
```

### Import rules — NEVER violate these

```
app/       → can import from features/ and shared/
features/  → can import from shared/ only. NEVER import from app/ or other features/
shared/    → can import from nothing in this project. Zero internal dependencies.
```

### Feature structure

Each feature follows this internal structure:

```
features/<name>/
  components/   → React components for this feature
  hooks/        → Custom hooks
  actions/      → Server Actions ('use server')
  store/        → Zustand slices (only features/cart/store/ currently)
```

### File naming conventions

- Components: `PascalCase.tsx` — e.g. `ProductCard.tsx`
- Hooks: `camelCase.ts` prefixed with `use` — e.g. `useStockRealtime.ts`
- Actions: `camelCase.ts` describing the group of actions — e.g. `products.ts`
- Types: defined in `shared/types/index.ts`, exported from there

### Language convention

- **Route folders** (`app/`) → Spanish, because URLs are public-facing: `/catalogo`, `/producto`, `/checkout`
- **Everything else** (`features/`, `shared/`) → English: `ProductCard`, `useCartStore`, `CartDrawer`
- **Database column names** → Spanish (match the Supabase schema exactly): `nombre`, `precio`, `stock`, `es_destacado`

### No API routes for mutations

Use **Server Actions** for all data mutations. `route.ts` files are reserved for:
- External webhooks (e.g. `app/api/webhooks/payphone/route.ts`)
- Nothing else

### Data fetching pattern

```tsx
// Correct — Server Component fetches, passes to Client Component
export default async function Page() {
  const supabase = createClient(cookieStore)
  const { data } = await supabase.from('productos').select('*')
  return <ProductGrid products={data} />
}

// Wrong — never fetch in Client Components unless Realtime
```
<!-- END:architecture-rules -->

---

<!-- BEGIN:supabase-rules -->
## Supabase

### Client usage

There are two clients. Use the correct one for the context:

```ts
// Browser / Client Components
import { createClient } from '@/shared/lib/supabase/client'

// Server Components, Server Actions, Route Handlers
import { createClient } from '@/shared/lib/supabase/server'
// The server client requires cookieStore:
const cookieStore = await cookies()
const supabase = createClient(cookieStore)
```

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL              → Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  → Public key (replaces anon key in new projects)
SUPABASE_SERVICE_ROLE_KEY             → Secret, server-only, never expose to client
```

Never use `NEXT_PUBLIC_SUPABASE_ANON_KEY` — this project uses the new publishable key format.

### Auth

- Auth state is managed by Supabase. `proxy.ts` handles redirects based on `supabase.auth.getClaims()`.
- `proxy.ts` is **UX only** — it redirects unauthenticated users to `/login`. It is NOT the security layer.
- Real security lives in: **RLS policies** on every table + **role check inside each Server Action**.
- Never trust client-sent user IDs. Always use `supabase.auth.getClaims()` server-side.

### Pessimistic locking for stock

Stock mutations MUST use the `reservar_producto` Postgres function, not a direct UPDATE:

```ts
const { data } = await supabase.rpc('reservar_producto', {
  p_id: productId,
  cantidad: quantity
})
if (data === false) throw new Error('Stock insuficiente')
```

Direct `UPDATE stock = stock - 1` is forbidden — it causes race conditions on pre-sales.

### Realtime

Only use Realtime for live stock updates (`vistas_producto`, `productos.stock`). Do not use it for data that does not require real-time sync.
<!-- END:supabase-rules -->

---

<!-- BEGIN:design-system-rules -->
## Design System

### Color tokens — always use CSS variables, never hardcode hex

```
Light mode (default) — NGE retro palette
--bg              #FFFFFF    Page background
--surface         #F9F9FA    Card interior
--surface-2       #F0F0F2    Image wells, disabled fills
--text-primary    #1A1A1A    Main text
--text-secondary  #5C5C66    Muted text, labels
--border          #E2E2E8    Internal dividers only
--edge            #000000    Ink outline on every card and button
--brand           #A877C8    Unit-01 lilac — brand fills (black text on top)
--brand-ink       #5E2F82    Lilac text
--cta             #A2DA5A    Unit-01 lime — WhatsApp go-actions only (black text)
--signal-ink      #3F6212    Lime text
--info            #A2B2DF    Unit-00 periwinkle — disponible, hover fills
--alert           #F7BB2A    NERV amber — pre-venta, warnings, focus fill
--alert-ink       #8A5A00    Amber text
Pastels are fills only: always black text on them, never white; never pastel text on white.

Dark mode — applied via [data-theme="dark"] on <html> (admin only)
--edge            #F0E8FF    Ink edge flips light
```

Always write `bg-[var(--bg)]`, `text-[var(--text-primary)]`, `border-[var(--border)]`.
Never write `bg-white`, `text-gray-900`, or any hardcoded color class.

Brand colors per marca (used for badges and dropdown accents):
- Hot Wheels:   `#FF3D3D`
- Tarmac Works: `#00E5FF`
- Inno64:       `#FFD700`
- Mini GT:      `#FFB3E6`

### Typography

- **Font:** Manrope (`var(--font-manrope)`) — loaded via `next/font/google`
- **Headings:** `font-extrabold tracking-tight` — weight 800, letter-spacing -0.02em
- **Body:** `font-normal leading-relaxed` — 16px, line-height 1.6
- **Labels / nav:** `font-semibold text-xs tracking-widest uppercase`
- Apply font in body: `className="font-[family-name:var(--font-manrope)]"`

### Component style rules

- **Buttons:** `.nerv-btn` + variant (`--go` lime for WhatsApp, `--brand`, `--warn`, default ghost, `--off` disabled; sizes `--sm`, `--block`, `--icon`). Chamfered NERV corners, 2px black edge — never `rounded-full` pills on the storefront
- **Cards / cells:** `NervPanel` (or `.nerv-panel` + `.nerv-panel__inner` on a Link; `.nerv-box` for text-only blocks). Optional `NervHead` strip. Never `rounded-2xl`
- **Tags / seals:** `.nerv-tag` (+ `--info`, `--alert`, `--black`, `--light`, `--muted`)
- **Glow:** keep the GlowCard light — pass `glow={color}` (and `href` for link cards) to `NervPanel`
- **Section headings:** follow the title with `<span className='nerv-rule flex-1' />`
- **Grommet:** only for Clock / Accordion-type behavior, wrapped in `NervGrommet` (`shared/components/ui/NervGrommet.tsx`). Never for layout, buttons or cards
- **Shadows:** none. The ink edge is the depth. Clip-path hides outlines, so focus is handled inside `.nerv-btn`
- **Hover transitions:** `transition-all duration-200` or `transition-colors duration-200`
- **No inline styles** unless passing dynamic values (e.g. `style={{ background: brand.color_hex }}`). Everything else via Tailwind.

### Bento Grid — Hero layout

```
+------------------------------------------+
|  HeroCarousel (flex-1)  |  Copy + CTAs   |  col-span-4, flex row
|                         |  w-[55%]       |
+------------+------------+----+-----------+
|  Marca 1   |   Marca 2       |  Marca 3  |  col-span-1 each
+------------+-----------------+-----------+
```

- Top cell: `col-span-4 flex` with image carousel left + copy right
- Bottom cells: `col-span-1` per brand, `min-h-[220px]`, image with overlay

### Theme toggle

Theme is stored in `localStorage` as `'emitoys-theme'` and applied as `data-theme` on `<html>`.
The `ThemeToggle` component reads it on init with a **lazy initializer in useState** — no `useEffect` setState.
Toggling calls `document.documentElement.setAttribute('data-theme', next)`.
<!-- END:design-system-rules -->

---

<!-- BEGIN:animation-rules -->
## Animations — GSAP

GSAP is **100% free** as of April 30, 2025 (acquired by Webflow). All plugins including SplitText, ScrollTrigger, MorphSVG are free for commercial use. No license needed.

### Installation

```bash
pnpm add gsap @gsap/react
```

### Usage rules

- Always use `useGSAP` from `@gsap/react` inside Client Components — never raw `useEffect` + gsap
- Always register plugins at the top of the file: `gsap.registerPlugin(useGSAP, ScrollTrigger)`
- Always pass `scope` to `useGSAP` to avoid memory leaks: `useGSAP(() => { ... }, { scope: containerRef })`
- Pass `dependencies` to re-run on state change: `useGSAP(() => { ... }, { dependencies: [current], scope: ref })`
- Clean up intervals and timers in `useEffect` return, not inside `useGSAP`

### When to use GSAP vs CSS

```
GSAP:            Carousel transitions, page entrances, scroll-triggered reveals, SplitText titles
CSS transitions: Hover states, color changes, opacity toggles, simple transforms
```

### Current GSAP usage

- `features/catalog/components/HeroCarousel.tsx` — slide transitions with opacity + scale, badge entrance
<!-- END:animation-rules -->

---

<!-- BEGIN:component-library-rules -->
## Component Libraries

### Tailwind CSS v4

This project uses Tailwind v4 — breaking changes from v3:
- No `tailwind.config.js` — configuration lives in `globals.css` with `@theme`
- Arbitrary CSS variable values: `bg-[var(--bg)]`
- Font family from variable: `font-[family-name:var(--font-manrope)]`

### shadcn/ui

Installed with **Vega preset** (Tailwind v4 compatible). Components live in `shared/components/ui/`.

Use shadcn for: `Sheet` (cart drawer), `Slider` (price filter), `Select` (city in checkout), `Dialog` (modals), `Tabs` (admin nav), and other UI components

Do NOT use shadcn for: `Button`, `Card`, `Badge`, `Navbar` — use Tailwind directly for these.

Adding new components:
```bash
pnpm dlx shadcn@latest add <component>
```

### Zustand

Cart store: `features/cart/store/cartStore.ts`. localStorage key: `'emitoys-cart-store'`.

- Use `interface` not `type` for store definition — avoids persist middleware type errors
- Pass generic directly to persist: `persist<CartStore>(...)`
- Computed values are functions: call as `useCartStore(s => s.totalItems())`
<!-- END:component-library-rules -->

---

<!-- BEGIN:data-model-rules -->
## Data Model

All Supabase column names are in **Spanish**. Match them exactly in queries.

Key tables:

| Table | Purpose |
|-------|---------|
| `marcas` | Brands with `color_hex` for UI accents |
| `productos` | Products. `estado` enum: `disponible`, `pre_venta`, `agotado` |
| `imagenes_producto` | Images. `orden: 0` = primary image |
| `usuarios` | Extends `auth.users`. `tipo_usuario`: `cliente` or `admin` |
| `direcciones_envio` | Shipping addresses. One predeterminada per user |
| `carritos_de_compra` | One active cart per user |
| `carrito_items` | `precio_unidad` frozen at add time — never recalculated |
| `ordenes` | `costo_total` is a **generated column** — never compute in JS |
| `orden_items` | Snapshot at purchase. Includes `nombre_producto` as text copy |
| `vistas_producto` | Insert-only. Used for Realtime "X viewing" counter |

### Pre-ventas

Regular products with `estado = 'pre_venta'`. Extra fields:
- `pre_venta_fecha_cierre` — closing timestamp
- `pre_venta_cupo_total` — quota for progress bar UI

A Postgres trigger auto-sets `estado = 'agotado'` when `stock = 0`.

### Catalog filters → URL params

```
/catalogo?marca=hot-wheels&escala=1:64&precio_max=200
```

Read with `useSearchParams()`. Never store filters in React state — URL makes them shareable via WhatsApp.
<!-- END:data-model-rules -->

---

<!-- BEGIN:payments-shipping-rules -->
## Payments & Shipping

### Payphone

- Integration: headless API — custom UI, Payphone processes invisibly in the background
- Webhook: `app/api/webhooks/payphone/route.ts`
- Env vars: `PAYPHONE_TOKEN` (server only), `PAYPHONE_STORE_ID`, `NEXT_PUBLIC_PAYPHONE_STORE_ID`
- Never log or expose `PAYPHONE_TOKEN`

### Order flow

```
Checkout submit → Server Action creates orden (estado: pendiente)
  → Payphone processes payment
  → Webhook fires → estado: confirmada
  → n8n triggers WhatsApp to owner
  → Resend sends email to customer
```

### Servientrega shipping

- Cost is manually set by store owner in admin panel — no API integration
- Stored per city in DB, shown in cart drawer as editable field
- `costo_envio` is separate from `costo_subtotal` — `costo_total` is generated by Postgres
<!-- END:payments-shipping-rules -->

---

<!-- BEGIN:forbidden-patterns -->
## Forbidden Patterns

```
NEVER use middleware.ts          → renamed to proxy.ts in Next.js 16
NEVER export `middleware`        → must be named `proxy`
NEVER use npm or yarn            → pnpm only
NEVER hardcode hex colors        → use CSS variables
NEVER fetch in Client Components → use Server Components, pass as props
NEVER UPDATE stock directly      → use reservar_producto() RPC
NEVER put auth only in proxy.ts  → verify in every Server Action
NEVER import features/ in shared/
NEVER import one feature from another feature
NEVER use inline styles for static values
NEVER use localStorage in Server Components
NEVER use NEXT_PUBLIC_SUPABASE_ANON_KEY → use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEVER skip 'use server' on Server Actions
NEVER store catalog filters in React state → use URL search params
```
<!-- END:forbidden-patterns -->