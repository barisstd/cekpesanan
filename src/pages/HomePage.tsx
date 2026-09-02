import { useState } from "react";
import { BookMark } from "@/components/BookMark";
import { PhoneDigitInput } from "@/components/PhoneDigitInput";
import { Button } from "@/components/Button";

interface HomePageProps {
  onSubmit: (last4: string) => void;
  initialValue?: string;
}

export function HomePage({ onSubmit, initialValue = "" }: HomePageProps) {
  const [digits, setDigits] = useState(initialValue);
  const isComplete = /^\d{4}$/.test(digits);

  function handleSubmit() {
    if (!isComplete) return;
    onSubmit(digits);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BookMark className="h-14 w-14" />

        <h1 className="mt-5 font-display text-[28px] font-semibold leading-tight text-ink">
          📦 Cek Pesanan Kamu
        </h1>
        <p className="mt-2 max-w-[280px] text-[15px] leading-relaxed text-ink/60">
          Lihat detail pesanan, pembayaran, dan kekurangan tagihanmu.
        </p>

        <form
          className="mt-9 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="mb-3 block text-sm font-medium text-ink/70">
            4 digit terakhir nomor HP
          </label>
          <PhoneDigitInput value={digits} onChange={setDigits} />

          <Button
            type="submit"
            fullWidth
            disabled={!isComplete}
            className="mt-8"
          >
            CEK PESANAN
          </Button>
        </form>
      </div>

      <p className="pb-2 text-center text-xs leading-relaxed text-ink/40">
        Kami hanya memakai 4 digit terakhir nomor HP kamu untuk menemukan
        pesanan — bukan nomor lengkap.
      </p>
    </div>
  );
}
