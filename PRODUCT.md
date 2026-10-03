# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ecuadorian diecast collectors. They hunt specific mainlines, chase pieces, and pre-ventas to complete their display (vitrina), browsing primarily by marca (Hot Wheels, Tarmac Works, Inno64, Mini GT) and escala (1:64, 1:43, 1:18, 1:12). Most arrive and buy from their phones, continuing the purchase in WhatsApp chat.

## Product Purpose

EmiToys is an Ecuadorian e-commerce for diecast scale model cars. It exists so local collectors can find collector-grade pieces without importing them themselves. Success means a collector finds the exact piece, confirms availability and shipping over WhatsApp, and receives it anywhere in Ecuador.

## Positioning

Curated premium brands — Tarmac Works, Inno64, and Mini GT alongside Hot Wheels. A neighboring general toy seller could not truthfully copy the collector-grade curation or the scale-first organization of the catalog.

## Operating Context

- Solo-developer project; the store owner runs everything (products, marcas, testimonios, shipping costs) from the admin panel.
- WhatsApp-first checkout: ordering happens in WhatsApp chat. The site never checks out on-page; its buying surfaces must feed the chat with prefilled intent (product, escala, price).
- Payments processed via Payphone; shipping via Servientrega with per-city costs set manually by the owner.
- Pre-ventas run on an apartado (deposit) reservation model with closing dates and quotas.
- Community layer: a WhatsApp collectors group with pre-venta and subasta (auction) access.
- Spanish-language storefront with Spanish public URLs (/catalogo, /producto); prices in USD.

## Capabilities and Constraints

Confirmed functionality: filterable catalog (marca, escala, price) with shareable URL state; product detail with live stock; pre-venta dates and quotas; admin panel for products, marcas, testimonios, and configuration; customer testimonial showcase; Supabase RLS plus server-side admin role checks; Cloudinary-hosted imagery.

Constraints: single owner-operator; shipping costs are manual per city; checkout stays WhatsApp-first. Open product decisions: the fate of the vestigial on-site cart UI (remove it vs. wire it) and the exact pre-venta apartado terms shown to buyers.

Domain terminology: escala, pre-venta, apartado, cupo, estado (disponible, pre_venta, agotado).

## Brand Commitments

Name EmiToys. Direct Spanish-language voice as used on buying surfaces ("Quiero este", "Pedir en WhatsApp"). No invented claims beyond what the catalog and pages state.

## Evidence on Hand

Real Cloudinary product photography; the live Supabase product and brand catalog; an active WhatsApp community group. The testimonios table exists but no customer testimonials have been collected yet — future work must not fabricate reviews. No press, case studies, or benchmarks on hand.

## Product Principles

1. WhatsApp is the checkout — every buying surface must feed the chat with intent, never dead-end.
2. Curate like a collector — premium brands and scale-first organization over catalog breadth.
3. Trust before transaction — stock truth, pre-venta rules, and shipping facts on the page, never placeholders.
4. Solo-owner operable — anything the store needs must be doable from the admin panel in minutes.
5. Ecuador-first — Spanish, USD, Servientrega, and the local collector community in every decision.
