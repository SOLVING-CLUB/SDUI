# SDUI Blinkit-Style Homepage + Admin Dashboard — Design Spec

**Date:** 2026-07-19
**Status:** Approved (Option A, conversation 2026-07-19)

## Goal

A presentation-ready demo proving Server-Driven UI for a quick-commerce app:

1. A **single-page app** that renders a Blinkit-style homepage inside a phone frame, entirely from a JSON config fetched from an API.
2. An **admin dashboard** where a non-engineer edits tabs, themes, and widgets, then publishes — the app updates on refresh with no build or store release.

Phase 2 (out of scope here): React Native client consuming the same API.

## Stack

- Next.js (App Router, TypeScript, Tailwind) — one app: `/` (phone demo), `/admin` (dashboard), `/api/*` (layout API).
- Config store: pluggable interface. v1 = versioned JSON files in `data/` (works locally, zero cost). Later: Supabase Postgres behind the same interface for Vercel deploy.
- No external images: placeholder art via gradients/emoji so the demo is self-contained.

## SDUI Contract

```jsonc
{
  "screenId": "home",
  "header": { "etaText": "10 minutes", "address": "...", "searchPlaceholders": ["..."] },
  "tabs": [
    {
      "id": "beauty", "title": "Beauty", "icon": "💄",
      "badge": { "text": "Sale", "color": "#E23744" },
      "theme": { "gradientFrom": "#FDE7EF", "gradientTo": "#FFFFFF", "accent": "#E91E63", "dark": false },
      "widgets": [ { "id": "w1", "type": "campaign_banner", "props": { /* per-widget */ } } ]
    }
  ]
}
```

Rules:

- Client holds a **registry** `type → React component`. Unknown types are skipped, never crash.
- Layout references data (e.g. collection ids) rather than embedding catalog rows where practical; v1 seeds inline product data for demo simplicity.

## Widget Vocabulary (v1)

`campaign_banner`, `info_strip`, `deal_card_grid`, `cta_banner_pair`, `strip_banner`, `circle_category_rail`, `category_grid`, `product_rail`, `product_grid`, `section_title`.

Seed config replicates 5 Blinkit tabs from reference screenshots: All (pink Beauty Bash), Monsoon (blue), Electronics (yellow), Beauty (pink), Pharmacy (teal).

## Layout API

- `GET /api/screen/:id` → latest **published** config (+ `version`).
- `GET /api/screen/:id/draft` → current draft (admin).
- `PUT /api/screen/:id/draft` → save draft.
- `POST /api/screen/:id/publish` → freeze draft as new immutable version, mark live.
- `GET /api/screen/:id/versions` → version list; `POST /api/screen/:id/rollback` `{version}` → re-point live.

## Store

`ConfigStore` interface: `getPublished`, `getDraft`, `saveDraft`, `publish`, `listVersions`, `rollback`. v1 `FileStore` persists to `data/screens/home/{draft.json, versions/N.json, meta.json}`.

## Admin Dashboard (`/admin`)

- Tab list: select, add, remove, rename; per-tab theme editor (gradient/accent color inputs, icon, badge).
- Widget list per tab: reorder (up/down + drag), add from palette, remove, duplicate.
- Props editor: JSON editor per widget (schema-typed forms later).
- **Live phone preview** using the *same renderer component* as the public app, updating as you edit.
- Actions: Save draft, Publish, version history with one-click rollback.

## Error Handling

- Renderer: unknown widget type → skip; malformed props → widget renders fallback box in dev, skipped in prod.
- API: invalid JSON body → 400; missing screen → 404; store errors surface as 500 with message.
- Admin props editor: JSON parse errors shown inline; cannot save invalid JSON.

## Testing / Verification

- Manual demo flow: edit theme + reorder widgets in admin → publish → refresh `/` → changes visible.
- Type-level safety via shared TS types; `npm run build` must pass.
