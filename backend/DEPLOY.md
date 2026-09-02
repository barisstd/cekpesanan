# Backend Setup — Google Apps Script + Google Sheets

The frontend never touches the Spreadsheet. It only ever calls the Apps
Script Web App URL, and this script decides what data is safe to return
(no full phone numbers, no admin notes, no other customers' orders).

## 1. Set up the Google Sheet

Create one Google Sheet (spreadsheet) with three tabs, named exactly:

### `ORDERS`
| order_id | order_date | customer_name | phone       | shipping_method | order_status |
|----------|------------|----------------|-------------|------------------|--------------|
| IJN-1042 | 2026-08-24 | Ratna Sari     | 081234568231| JNE Reguler      | Dikirim      |

- `phone` should be the full phone number used at checkout. The script
  strips it down to last 4 digits before anything leaves the server —
  keep the full number here, just never expose the column elsewhere.
- Feel free to add extra admin-only columns (e.g. `admin_notes`,
  `internal_flag`) — the script only reads the six columns above, so
  anything else you add is automatically never returned to the frontend.

### `ORDER_ITEMS`
| order_id | product_name | price  | qty |
|----------|--------------|--------|-----|
| IJN-1042 | Seri Kisah 25 Nabi (Boardbook) | 149000 | 1 |

### `PAYMENTS`
| payment_id | order_id | payment_date | amount | method       | status   |
|------------|----------|--------------|--------|--------------|----------|
| PAY-2201   | IJN-1042 | 2026-08-24   | 150000 | Transfer BCA | Diterima |

Column headers are matched case-insensitively and converted from
`snake_case` to `camelCase` automatically, so keep the header names as
shown (spaces or underscores both work).

## 2. Add the script

1. In the Sheet, go to **Extensions > Apps Script**.
2. Delete the default `Code.gs` boilerplate and paste in the contents
   of `backend/Code.gs` from this project.
3. Save the project (e.g. name it "Ijun Order Lookup API").

## 3. (Optional but recommended) Set a shared client token

1. In the Apps Script editor: **Project Settings > Script Properties**.
2. Add a property `CLIENT_TOKEN` with a random value (e.g. a UUID).
3. Put the same value in the frontend's `.env` as `VITE_CLIENT_TOKEN`.

This is a light deterrent against someone hitting your endpoint URL
directly outside the app — not strong authentication, since it ships
inside the frontend bundle. Rate limiting (below) is the real backstop.

## 4. Deploy as a Web App

1. **Deploy > New deployment**.
2. Select type: **Web app**.
3. **Execute as:** Me (your account — this is what lets the script read
   the Sheet without the caller needing their own Google account).
4. **Who has access:** Anyone.
5. Click **Deploy**, authorize the requested permissions, and copy the
   `/exec` URL it gives you.

Paste that URL into the frontend's `.env` as `VITE_APPS_SCRIPT_URL`.

## 5. Re-deploying after changes

Apps Script Web App URLs are pinned to a specific deployment version.
After editing `Code.gs`, use **Deploy > Manage deployments > Edit >
New version** to push the update to the same URL (creating a *new*
deployment instead would give you a different URL and break the
frontend's `.env`).

## Notes on rate limiting

`Code.gs` uses `CacheService` to cap each caller (identified by a
per-browser id the frontend generates, or the shared client token as a
fallback) to a small number of requests per rolling minute. This resets
automatically and needs no cleanup. It is enough to blunt casual
scripted abuse; it is not DDoS protection. If this endpoint starts
seeing serious abuse, consider fronting it with Cloudflare or moving to
a backend that can see real client IPs.

## Notes on what never leaves the server

- `phone` is read only to compute `phoneLast4` and to verify ownership
  when fetching an order's detail — the full number is discarded before
  the response is built.
- Only the six `ORDERS` columns, the four `ORDER_ITEMS` columns, and
  the six `PAYMENTS` columns above are ever read into a response. Any
  other columns you add to those sheets, or any other sheets/tabs in
  the spreadsheet, are invisible to the frontend.
