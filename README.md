# Ijun Bookstore — Cek Pesanan

Mobile-first order/invoice lookup for Ijun Bookstore customers. A
customer enters the last 4 digits of the phone number used at checkout
and sees their order status, items, and any remaining balance —
without exposing the underlying Google Sheet or full phone numbers.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Google Apps Script (backend API) + Google Sheets (data source)

## Project structure

```
src/
  components/     Reusable UI pieces (Button, PaymentStatusBadge, ...)
  pages/          HomePage, OrderListPage, OrderDetailPage
  hooks/          useOrderLookup — the lookup → list → detail state machine
  services/       OrdersApi interface + Google Apps Script / mock implementations
  types/          Shared order/item/payment types
  lib/            formatting + client-side rate-limit helpers
backend/
  Code.gs         The only code that touches the Google Sheet
  DEPLOY.md       Sheet structure + Apps Script deployment steps
```

## Local development

```bash
npm install
cp .env.example .env
```

By default `.env.example` sets `VITE_USE_MOCK_API=false`, which needs a
real Apps Script deployment (see `backend/DEPLOY.md`). To build and
preview the UI without deploying anything yet, set:

```
VITE_USE_MOCK_API=true
```

This swaps in an in-memory mock (`src/services/MockOrdersApi.ts`) with
three sample orders across two phone numbers — try `8231` (two orders,
one LUNAS and one SUDAH DP) or `5567` (one order, BELUM BAYAR).

```bash
npm run dev
```

## Connecting the real backend

1. Follow `backend/DEPLOY.md` to set up the Sheet and deploy `Code.gs`
   as a Web App.
2. Set `VITE_APPS_SCRIPT_URL` in `.env` to the deployment's `/exec` URL.
3. Set `VITE_USE_MOCK_API=false` (or remove the line).
4. Optionally set `VITE_CLIENT_TOKEN` to match `CLIENT_TOKEN` in the
   Apps Script's Script Properties (a light deterrent, not real auth).
5. Set `VITE_ADMIN_WHATSAPP` to the number the "Hubungi Admin" button
   should open a chat with (digits only, country code, no `+`).

## Build

```bash
npm run build
```

Outputs static files to `dist/` — deployable to any static host
(Niagahoster, Netlify, Vercel, GitHub Pages, etc.), since the app makes
no server-side requests other than to the Apps Script URL.

## Swapping the backend later

The UI only ever talks to the `OrdersApi` interface
(`src/services/OrdersApi.ts`), never to `GoogleAppsScriptOrdersApi`
directly. To move off Apps Script later, write a new class implementing
the same interface and swap it into `src/services/ordersApiInstance.ts` —
no component or page needs to change.

## Security notes

- The frontend never receives a full phone number, only the last 4
  digits it already has, echoed back by the server as `phoneLast4`.
- Order detail requests are re-verified server-side against `phoneLast4`
  — a customer can't view another order's detail just by knowing its
  `order_id`.
- Only the specific columns documented in `backend/DEPLOY.md` are ever
  read into API responses; any other columns or sheets in the
  spreadsheet (admin notes, internal flags, etc.) are never touched.
- Input is validated as exactly 4 numeric digits both client- and
  server-side.
- Requests are rate-limited server-side per browser (via `CacheService`
  in Apps Script) and lightly throttled client-side as a UX nicety —
  see `backend/DEPLOY.md` for the limits and their caveats.
