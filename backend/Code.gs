/**
 * Ijun Bookstore — Order Lookup Backend
 * ======================================
 * Deploy this as a Web App (Deploy > New deployment > Web app).
 * The frontend NEVER talks to Google Sheets directly — only to this
 * script's /exec URL. This file is the only place that reads the
 * spreadsheet, so it is also the only place responsible for:
 *   - never returning the full phone number (only last 4 digits)
 *   - never returning admin-only columns
 *   - validating input (exactly 4 numeric digits)
 *   - rate limiting / abuse protection
 *
 * See DEPLOY.md in this folder for sheet structure and setup steps.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SHEET_NAMES = {
  ORDERS: "ORDERS",
  ORDER_ITEMS: "ORDER_ITEMS",
  PAYMENTS: "PAYMENTS",
};

// Rate limiting: max requests per identity within the rolling window.
const RATE_LIMIT_MAX_REQUESTS = 8;
const RATE_LIMIT_WINDOW_SECONDS = 60;

// Reads the optional shared secret from Script Properties.
// Project Settings > Script properties > CLIENT_TOKEN.
// Leave unset to skip this check (rate limiting still applies).
function getExpectedClientToken() {
  return PropertiesService.getScriptProperties().getProperty("CLIENT_TOKEN") || "";
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

function doGet(e) {
  return jsonResponse({ ok: false, error: "SERVER_ERROR", message: "Use POST." });
}

function doPost(e) {
  try {
    const body = parseRequestBody(e);
    const identity = resolveIdentity(e);

    if (!checkRateLimit(identity)) {
      return jsonResponse({ ok: false, error: "RATE_LIMITED" }, 429);
    }

    const expectedToken = getExpectedClientToken();
    if (expectedToken && body.clientToken !== expectedToken) {
      // Treat a bad/missing token like invalid input rather than
      // revealing that a token check exists.
      return jsonResponse({ ok: false, error: "INVALID_INPUT" }, 400);
    }

    if (body.action === "lookup") {
      return handleLookup(body);
    }
    if (body.action === "detail") {
      return handleDetail(body);
    }

    return jsonResponse({ ok: false, error: "INVALID_INPUT" }, 400);
  } catch (err) {
    return jsonResponse({ ok: false, error: "SERVER_ERROR" }, 500);
  }
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

function handleLookup(body) {
  const last4 = String(body.phoneLast4 || "").trim();
  if (!isValidLast4(last4)) {
    return jsonResponse({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  const orders = getOrdersByPhoneLast4(last4);
  if (orders.length === 0) {
    return jsonResponse({ ok: false, error: "NOT_FOUND" }, 404);
  }

  const summaries = orders.map((order) => buildOrderSummary(order));
  return jsonResponse({ ok: true, orders: summaries });
}

function handleDetail(body) {
  const last4 = String(body.phoneLast4 || "").trim();
  const orderId = String(body.orderId || "").trim();

  if (!isValidLast4(last4) || !orderId) {
    return jsonResponse({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  // Re-verify last4 ownership server-side — never trust that a client
  // asking for orderId X was legitimately shown it by the lookup step.
  const order = getOrderById(orderId);
  if (!order || normalizePhone(order.phone).slice(-4) !== last4) {
    return jsonResponse({ ok: false, error: "NOT_FOUND" }, 404);
  }

  const summary = buildOrderSummary(order);
  const items = getOrderItems(orderId);
  const payments = getOrderPayments(orderId);

  return jsonResponse({
    ok: true,
    order: Object.assign({}, summary, {
      items: items.map((item) => ({
        productName: item.productName,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
      })),
      // Payment method/date shown to the customer; no internal admin notes.
      payments: payments.map((p) => ({
        paymentId: p.paymentId,
        paymentDate: toIso(p.paymentDate),
        amount: p.amount,
        method: p.method,
        status: p.status,
      })),
    }),
  });
}

// ---------------------------------------------------------------------------
// Data access — the only functions that touch the Spreadsheet
// ---------------------------------------------------------------------------

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Missing sheet: " + name);
  return sheet;
}

function sheetToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map((h) => String(h).trim());
  const rows = values.slice(1);
  return rows
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[toCamelCase(header)] = row[i];
      });
      return obj;
    });
}

function toCamelCase(header) {
  // "order_id" -> "orderId", "order_date" -> "orderDate", etc.
  return header
    .toLowerCase()
    .replace(/[_\s]+(.)/g, (_, chr) => chr.toUpperCase());
}

function getOrdersByPhoneLast4(last4) {
  const orders = sheetToObjects(getSheet(SHEET_NAMES.ORDERS));
  return orders.filter((o) => normalizePhone(o.phone).slice(-4) === last4);
}

function getOrderById(orderId) {
  const orders = sheetToObjects(getSheet(SHEET_NAMES.ORDERS));
  return orders.find((o) => String(o.orderId) === orderId) || null;
}

function getOrderItems(orderId) {
  const items = sheetToObjects(getSheet(SHEET_NAMES.ORDER_ITEMS));
  return items.filter((i) => String(i.orderId) === orderId);
}

function getOrderPayments(orderId) {
  const payments = sheetToObjects(getSheet(SHEET_NAMES.PAYMENTS));
  return payments.filter((p) => String(p.orderId) === orderId);
}

// ---------------------------------------------------------------------------
// Business logic — payment calculations shared by lookup + detail
// ---------------------------------------------------------------------------

function buildOrderSummary(order) {
  const items = getOrderItems(order.orderId);
  const payments = getOrderPayments(order.orderId);

  const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0);
  const paid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = total - paid;

  return {
    orderId: String(order.orderId),
    orderDate: toIso(order.orderDate),
    customerName: order.customerName,
    phoneLast4: normalizePhone(order.phone).slice(-4), // full phone NEVER leaves this function
    shippingMethod: order.shippingMethod,
    orderStatus: order.orderStatus,
    total: total,
    paid: paid,
    remaining: remaining,
    paymentStatus: paymentStatusFor(paid, remaining),
  };
}

function paymentStatusFor(paid, remaining) {
  if (remaining <= 0) return "LUNAS";
  if (paid > 0) return "SUDAH DP";
  return "BELUM BAYAR";
}

// ---------------------------------------------------------------------------
// Validation & helpers
// ---------------------------------------------------------------------------

function isValidLast4(value) {
  return /^\d{4}$/.test(value);
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function toIso(value) {
  if (value instanceof Date) return value.toISOString();
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toISOString();
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function jsonResponse(payload, _status) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
  // Note: Apps Script Web Apps cannot set a custom HTTP status code from
  // doPost — the `_status` argument some callers pass is intentionally
  // unused here. The frontend relies on the `ok` / `error` fields in the
  // JSON body instead of the HTTP status for anything other than a
  // transport-level failure.
}

// ---------------------------------------------------------------------------
// Rate limiting — keyed by a coarse per-session identity, backed by
// CacheService (fast, auto-expiring, no spreadsheet writes on every request)
// ---------------------------------------------------------------------------

function resolveIdentity(e) {
  // Apps Script does not expose the caller's IP address. As a practical
  // proxy, key on the optional clientToken plus a per-browser id the
  // frontend can generate and send (falls back to a shared bucket if
  // neither is present, which still caps total abuse per window).
  const body = parseRequestBody(e);
  return "id:" + (body.clientId || body.clientToken || "anonymous");
}

function checkRateLimit(identity) {
  const cache = CacheService.getScriptCache();
  const key = "rl:" + identity;
  const current = Number(cache.get(key) || "0");

  if (current >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  cache.put(key, String(current + 1), RATE_LIMIT_WINDOW_SECONDS);
  return true;
}
