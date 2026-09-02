/**
 * Client-side attempt throttling. This is a UX nicety and a cheap
 * deterrent, NOT the real defense — a determined client can clear
 * localStorage and bypass it. The Apps Script backend enforces the
 * actual rate limit per IP-ish key (see backend/Code.gs), which this
 * cannot be bypassed by clearing browser storage.
 */

const STORAGE_KEY = "ijun_lookup_attempts";
const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 5;
const MIN_INTERVAL_MS = 1_500; // debounce rapid double-submits

interface AttemptLog {
  timestamps: number[];
}

function readLog(): AttemptLog {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { timestamps: [] };
    const parsed = JSON.parse(raw) as AttemptLog;
    return { timestamps: Array.isArray(parsed.timestamps) ? parsed.timestamps : [] };
  } catch {
    return { timestamps: [] };
  }
}

function writeLog(log: AttemptLog): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // storage unavailable (private mode etc.) — degrade silently
  }
}

export interface ThrottleCheck {
  allowed: boolean;
  retryAfterMs: number;
}

/** Call before firing a lookup request. Does not record the attempt. */
export function checkThrottle(): ThrottleCheck {
  const now = Date.now();
  const log = readLog();
  const recent = log.timestamps.filter((t) => now - t < WINDOW_MS);

  const last = recent[recent.length - 1];
  if (last && now - last < MIN_INTERVAL_MS) {
    return { allowed: false, retryAfterMs: MIN_INTERVAL_MS - (now - last) };
  }

  if (recent.length >= MAX_ATTEMPTS_PER_WINDOW) {
    const oldestInWindow = recent[0];
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldestInWindow) };
  }

  return { allowed: true, retryAfterMs: 0 };
}

/** Call after firing a lookup request, regardless of outcome. */
export function recordAttempt(): void {
  const now = Date.now();
  const log = readLog();
  const recent = log.timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  writeLog({ timestamps: recent });
}
