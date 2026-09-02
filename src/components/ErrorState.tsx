import { Button } from "@/components/Button";

type ErrorCode = "INVALID_INPUT" | "NOT_FOUND" | "RATE_LIMITED" | "SERVER_ERROR" | "CLIENT_THROTTLED";

interface ErrorStateProps {
  code: ErrorCode;
  retryAfterMs?: number;
  onRetry: () => void;
}

const COPY: Record<ErrorCode, { title: string; body: string; action: string }> = {
  INVALID_INPUT: {
    title: "Nomor belum lengkap",
    body: "Masukkan tepat 4 digit angka terakhir dari nomor HP yang dipakai saat pesan.",
    action: "Coba Lagi",
  },
  NOT_FOUND: {
    title: "Pesanan tidak ditemukan",
    body: "Tidak ada pesanan dengan 4 digit ini. Pastikan angkanya sesuai nomor HP saat checkout, atau hubungi admin kalau kamu yakin ini salah.",
    action: "Coba Nomor Lain",
  },
  RATE_LIMITED: {
    title: "Terlalu banyak percobaan",
    body: "Kamu sudah mencoba beberapa kali berturut-turut. Tunggu sebentar lalu coba lagi.",
    action: "Coba Lagi",
  },
  CLIENT_THROTTLED: {
    title: "Tunggu sebentar",
    body: "Coba lagi dalam beberapa detik ya.",
    action: "Coba Lagi",
  },
  SERVER_ERROR: {
    title: "Ada gangguan",
    body: "Sistem sedang bermasalah saat mengambil data pesanan. Coba lagi, atau hubungi admin kalau terus terjadi.",
    action: "Coba Lagi",
  },
};

export function ErrorState({ code, retryAfterMs, onRetry }: ErrorStateProps) {
  const copy = COPY[code];
  const seconds = retryAfterMs ? Math.ceil(retryAfterMs / 1000) : undefined;

  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-white px-6 py-10 text-center shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brick-light text-2xl">
        {code === "NOT_FOUND" ? "🔍" : code === "RATE_LIMITED" || code === "CLIENT_THROTTLED" ? "⏳" : "⚠️"}
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-ink">{copy.title}</p>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink/60">
          {copy.body}
          {seconds ? ` (${seconds} detik lagi)` : ""}
        </p>
      </div>
      <Button variant="secondary" onClick={onRetry} className="mt-1">
        {copy.action}
      </Button>
    </div>
  );
}
