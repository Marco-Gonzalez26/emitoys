---
name: EmiToys
description: NERV Retro Cel — a light-mode diecast storefront drawn like a 90s Evangelion cel: pastel fills, black ink edges, chamfered NERV corners.
colors:
  eva-lilac: "#A877C8"
  eva-lime: "#A2DA5A"
  eva-blue: "#A2B2DF"
  eva-amber: "#F7BB2A"
  eva-black: "#000000"
  primary: "#A877C8"
  primary-hover: "#9563B8"
  primary-ink: "#5E2F82"
  cta: "#A2DA5A"
  cta-hover: "#8FC843"
  signal-ink: "#3F6212"
  info: "#A2B2DF"
  info-ink: "#33427A"
  alert: "#F7BB2A"
  alert-hover: "#E8A913"
  alert-ink: "#8A5A00"
  edge: "#000000"
  neutral-bg: "#FFFFFF"
  neutral-surface: "#F9F9FA"
  neutral-surface-2: "#F0F0F2"
  neutral-border: "#E2E2E8"
  ink: "#1A1A1A"
  ink-secondary: "#5C5C66"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Manrope', sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "monospace"
    fontWeight: 700
    letterSpacing: "0.14em"
rounded:
  none: "0px"
chamfer:
  button: "10px"
  button-sm: "7px"
  tag: "5px"
  card: "14px"
  feature: "22px"
spacing:
  container: "80rem"
components:
  button-go:
    backgroundColor: "{colors.cta}"
    textColor: "{colors.eva-black}"
    border: "2px {colors.edge}"
    chamfer: "{chamfer.button}"
    padding: "13px 24px"
  button-brand:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.eva-black}"
    border: "2px {colors.edge}"
    chamfer: "{chamfer.button}"
    padding: "13px 24px"
  button-ghost:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.ink}"
    border: "2px {colors.edge}"
    chamfer: "{chamfer.button}"
    padding: "13px 24px"
  card:
    backgroundColor: "{colors.neutral-surface}"
    border: "2px {colors.edge}"
    chamfer: "{chamfer.card}"
  tag-estado:
    backgroundColor: "{colors.info}"
    textColor: "{colors.eva-black}"
    chamfer: "{chamfer.tag}"
    padding: "4px 8px"
---

# Design System: EmiToys

## Overview

**Creative North Star: "NERV Retro Cel"**

The storefront is drawn like a 1995 Evangelion cel: flat pastel fills, black ink outlines, and the angled corners of NERV's command-center panels, set on a white page. Collector-grade diecast photography sits inside the cels. Under the cel look, the Daylight Garage structure is unchanged: the desire comes first, spec readouts are the proof, and WhatsApp is the only checkout. Every buying surface feeds the chat with prefilled intent (product, escala, price) and never dead-ends.

The voice is a title card beside an instrument panel. Condensed Anton display type and extrabold Plus Jakarta Sans sit beside monospace readouts for escala, price, stock, cupo and dates. A black header strip on each card reads `MARCA // ESCALA` in lime. Section headings run into a black instrument rule capped with an amber block. Cards keep the cursor-following GlowCard light inside their ink edge. The hero keeps its single authored motion moment: tube light, then photo, then lines, then meta. Everything below it stays flat.

**Key Characteristics:**
- White ground; every card and button is outlined in 2px black ink.
- Five-color retro palette. Pastels are only ever fills, with black text on top.
- Chamfered corners. Buttons cut top-left and bottom-right; cards cut top-right and bottom-left, so the two interlock.
- Flat. No shadows, no halos. Depth comes from the ink edge, overlap, and the GlowCard light that follows the cursor inside cards.
- Real product photography only, with branded-initials panels when an image is missing.

## Colors

The NGE retro palette: Unit-01 lilac, Unit-01 lime, Rei/Unit-00 periwinkle, NERV warning amber, and ink black. Each color has exactly one role.

### Roles
- **Unit-01 Lime** (#A2DA5A): **go**. Used only for the primary WhatsApp action ("Quiero este", "Pedir en WhatsApp", "Apartar", "Grupo WhatsApp"), the hero activation tube, text selection, and the in-stock indicator. Hover is #8FC843. Black text on it is 12.7:1.
- **Unit-01 Lilac** (#A877C8): **brand**. Used for the escala tag, the filter FAB and active filter chips, the "Ver todo el catálogo" tile, avatar discs, nav underlines and the scrollbar. Hover is #9563B8. Black text on it is 6.1:1. Lilac text uses **Lilac Ink** (#5E2F82, 9.9:1 on white).
- **Unit-00 Periwinkle** (#A2B2DF): **info**. Used for the disponible tag, the hover fill on ghost buttons, and dropdown and menu highlights. Text uses #33427A.
- **NERV Amber** (#F7BB2A): **warning**. Used for pre-venta tags, the cart count, hazard tape on pre-venta cards, the keyboard-focus fill and testimonial stars. Closing dates are text in **Amber Ink** (#8A5A00, 5.9:1).
- **Ink Black** (#000000): every card and button edge, the card header strip, the "Oferta" tag (amber on black) and tooltips.

### Neutral
- **Paper** (#FFFFFF): the page and ghost-button fills.
- **Panel Surface** (#F9F9FA): card interiors.
- **Nested Surface** (#F0F0F2): image wells and disabled fills.
- **Hairline** (#E2E2E8): internal dividers only. Outer edges are always ink.
- **Ink** (#1A1A1A) and **Graphite** (#5C5C66): text.

### Named Rules
**The Black-On-Pastel Rule.** White text never sits on a pastel. It fails AA on all four. Every pastel fill carries black text (`--brand-on`, `--cta-on`, `--alert-on`).
**The Ink-Text Rule.** Pastels are never text on white. Text uses the ink tokens (`--brand-ink`, `--signal-ink`, `--info-ink`, `--alert-ink`).
**The One-Role Rule.** Lime means go, amber means warning, periwinkle means info, lilac means brand. A color never borrows another color's role.
**The Daylight Rule.** The storefront ships light mode (the layout pins `data-theme="light"`).

## Typography

**Display Font:** Anton (`--font-garage`), uppercase: the hero product name, Catálogo, Filtros, Pre-venta abierta, Marcas, page titles (Comunidad, Envíos), 404, the footer wordmark.
**Section Heading Font:** Plus Jakarta Sans 800 (`--font-display`): lower-section headings, card product names, scale numbers.
**Body Font:** Manrope.
**Label Font:** monospace, uppercase, tabular figures.

### Hierarchy
- **Display** (Anton, 0.95 line-height, uppercase): hero name and primary section/page titles.
- **Headline** (Plus Jakarta Sans 800, -0.02em): lower-section headings, product names on cards (bold, text-sm), scale tile numbers.
- **Label** (mono 700, 0.14em, uppercase): readouts, tags, card header strips, prices, footer links, the countdown.
- **Button** (Manrope 800, 0.08em, uppercase).

### Named Rules
**The No-Eyebrow Rule.** No eyebrows above headings. Readouts sit below or beside the heading; page titles stand alone beside their instrument rule.

## Layout

A centered 80rem container. The hero is a single column on mobile and a 12-column grid on desktop (copy 5, photo 7). Urgency rows scroll horizontally with snap. Scale tiles are a 2-to-3-column bento. Vertical rhythm runs from py-12 to py-24.

## Elevation & Depth

Flat. The 2px ink edge is the only elevation cue; hover lifts a card by 2px with no shadow. Light lives in two places: the hero activation tube (lime line, ink hairline, soft lime glow) and the GlowCard cursor light inside card fills (marca color on product, pre-venta, brand and detail cards; lilac on scale tiles; platform colors on social cards). The GlowCard light switches off under reduced motion and on touch.

## Shapes

Nothing is rounded on the storefront except the controls inside shadcn primitives. Corners are cut with `clip-path`:
- Buttons: 10px (7px small, 8px icon), cutting top-left and bottom-right.
- Tags: 5px.
- Cards: 14px (22px on feature panels such as the hero photo, the scale feature tile and the product detail image), cutting top-right and bottom-left.

Because the clip-path also clips borders, edges are drawn by layering: the element paints the ink and an inset layer paints the fill. The inner cut shrinks by `bw × 0.586` so the diagonal edge stays as thick as the straight edges.

## Components

All components live in `app/globals.css` (`@layer components`) and `shared/components/ui/NervPanel.tsx`.

### Buttons (`.nerv-btn`)
- **Variants:**
  - `--go`: lime. The WhatsApp intent action.
  - `--brand`: lilac. Filters and the filter FAB.
  - `--warn`: amber.
  - Default ghost: paper fill, periwinkle on hover.
  - `--off`: disabled. Graphite edge and nested fill. Use it with `aria-disabled`.
- **Sizes:** `--sm`, `--block`, `--icon` (40px square).
- **Hover:** the fill deepens and the trailing icon nudges 2px. Active presses down 1px.
- **Focus:** clip-path hides outlines, so `:focus-visible` thickens the ink edge to 4px and switches the fill to amber (lime on `--warn`).

### Tags (`.nerv-tag`)
- Small chamfered mono labels with no edge.
- **Variants:**
  - Default lilac: escala, "Nuevo".
  - `--info`: disponible.
  - `--alert`: pre-venta, cart count.
  - `--black`: amber on black. "Oferta", arrow chips.
  - `--light`: marca seal over photography.
  - `--muted`: agotado.
- On a hovered tile, arrow chips switch to lime.

### Cards (`NervPanel` / `.nerv-panel` + `.nerv-panel__inner`)
- Two layers: the outer layer paints the ink, and the inner layer holds the fill, `overflow-hidden` and the clip.
- Pass `glow` (a color) to render `GlowCard` as the fill layer; pass `href` to make the whole card a link. Product, pre-venta, detail, brand, scale and social cards all glow.
- When GSAP animates a panel with `clearProps: 'all'`, set the chamfer with a `[--cut:Npx]` class rather than the `cut` prop, since the prop is an inline style.
- `.nerv-box` is a single-element variant for text-only containers, used for the About bento cells.
- Set `--panel-fill` to recolor the inside, for example the lilac catalog tile.

### Card header strip (`NervHead`)
- A black strip with a lime mono label built only from real data (`MARCA // ESCALA [// CÓDIGO]`), the marca color as an 8px square, and an amber code block.
- On a hovered card the label turns amber.

### Hazard tape (`.nerv-hazard`)
- 6px of amber and black diagonal stripes. Warning contexts only: the top of pre-venta cards and the 404 panel.

### Instrument rule (`.nerv-rule`)
- A 2px ink line with an amber end block that runs from a section heading toward its action link. Used on every storefront section heading and page title.

### Countdown (`PreventaCountdown`, Grommet `Clock`)
- Pre-venta cards with a closing date show an amber "Cierra en" label beside a black face with amber digits: whole days counted by us, HH:MM:SS by Grommet's digital `Clock` running backward (it wraps at 24h, so it re-keys each day). Renders the static date until mounted, then "Cerrada" once the date passes.

### Shipping accordion (`ShippingInfo`, Grommet `Accordion`)
- When the owner's Envíos text is written as blank-line-separated blocks whose first line is a title, it becomes an accordion inside a NERV panel (ink dividers, periwinkle plus / amber minus chips). Unstructured text renders as plain prose.

### Value props
- A NERV panel whose inner fill is ink, with a 2px grid gap so the cells read as an instrument grid. Each icon chip takes one role color.

### Grommet
- Grommet is used only where it adds behavior the kit lacks (Clock, Accordion), always inside `NervGrommet` (`plain`, NGE-themed). SSR styles come from `StyledComponentsRegistry` in the root layout. Don't use Grommet for layout, buttons, or cards.

### GarageHero (signature)
- The photo sits in a 22px-chamfer panel with the marca edge stripe and the lime activation tube.
- Below the photo: the marca seal (`--light`) and the estado tag, the Anton uppercase name, the mono readout, `--go` "Quiero este por WhatsApp" and ghost "Ver pre-ventas", then the house line with lilac ticks.
- Motion is the GSAP ignition timeline, guarded by `prefers-reduced-motion`.

### Testimonials
- Real-customer cards only, rendered as panels with amber stars outlined in ink, a lilac quote mark, a square avatar and the verified marker in lime ink.
- The section renders nothing when there are no testimonials.

## Do's and Don'ts

### Do:
- **Do** outline every card and button in 2px ink and chamfer it.
- **Do** put black text on every pastel fill.
- **Do** reserve lime for the WhatsApp go-action and amber for pre-venta and warnings.
- **Do** set spec facts in uppercase mono with tabular numbers.
- **Do** feed WhatsApp with prefilled intent on every buying surface.
- **Do** guard every motion with `prefers-reduced-motion`.

### Don't:
- **Don't** use `rounded-full` pills or `rounded-2xl` cards on the storefront.
- **Don't** set white text on lilac, lime, periwinkle or amber.
- **Don't** add shadows or halos to cards and buttons.
- **Don't** put eyebrows above headings, or marquees and tickers anywhere.
- **Don't** hardcode hex values; reference the `--eva-*` and role tokens.
- **Don't** fabricate testimonials, and don't check out on-page.
