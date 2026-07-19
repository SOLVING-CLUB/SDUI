# Quick-Commerce SDUI Platform

Blinkit-style homepage driven entirely by **Server-Driven UI**: the layout, tabs, themes,
and widgets come from a versioned JSON API, managed from a web dashboard. UI changes ship
by clicking **Publish** — no app build, no Play Store / App Store review.

## What's inside

| Piece | Where | What it is |
|---|---|---|
| Web demo (phone frame) | `/` | The "app" for presentations, renders JSON from the layout API |
| Admin dashboard | `/admin` | Tabs, themes, widget palette, reorder, live preview, publish, rollback |
| Layout API | `/api/screen/home` | Versioned config: draft → publish → rollback |
| Config store | `src/lib/sdui/store.ts` | v1: JSON files in `data/` (gitignored). Swap for Supabase to deploy |
| Widget vocabulary | `src/components/sdui/widgets.tsx` | 11 widget types + registry (web renderer) |
| **Mobile app (Expo/RN)** | `mobile/` | Real Android/iOS client, same API, same registry pattern |

## Run the web demo + dashboard

```bash
npm install
npm run dev
# app:       http://localhost:3000
# dashboard: http://localhost:3000/admin
```

Demo flow: change a tab's gradient / reorder widgets / edit props in the dashboard →
**🚀 Publish** → on the app page hit **↻ Refresh** → new UI, no build.

## Run the real mobile app (no EAS, free)

```bash
cd mobile && npm install

# find your Mac's LAN IP (phone and Mac must share Wi-Fi):
ipconfig getifaddr en0

# Expo Go (fastest — install "Expo Go" from Play Store, scan QR):
EXPO_PUBLIC_API_URL=http://<MAC_LAN_IP>:3000 npx expo start

# Real local APK build (requires Android Studio SDK; no EAS, no cost):
EXPO_PUBLIC_API_URL=http://<MAC_LAN_IP>:3000 npx expo run:android

# iOS simulator (requires Xcode):
npx expo run:ios
```

The mobile app fetches the same `/api/screen/home` JSON. Publish from the dashboard and
pull-to-refresh on the phone — the app's UI changes with **zero rebuilds**. That's the SDUI
pitch: you only ship a new binary when you add a *new widget type* to the registry.

## Security

Mutating API routes (`draft` PUT, `publish`, `rollback`) accept requests freely when
`ADMIN_TOKEN` is unset (local demo). For any deployed environment set `ADMIN_TOKEN`,
then in the dashboard browser console run
`localStorage.setItem("adminToken", "<token>")` once.

## Deploying later (still free)

- Web + API → Vercel Hobby. Swap `store.ts` for a Supabase-backed implementation
  (the exported functions are the store interface) since serverless has no writable disk.
- Mobile → local `expo run:android` APK; distribute the file directly for demos.
