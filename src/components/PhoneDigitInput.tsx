import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

interface PhoneDigitInputProps {
  value: string; // up to 4 digits
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const LENGTH = 4;

export function PhoneDigitInput({
  value,
  onChange,
  onComplete,
  disabled,
  error,
}: PhoneDigitInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.split("").slice(0, LENGTH);
  while (digits.length < LENGTH) digits.push("");

  function setDigitAt(index: number, digit: string) {
    const next = [...digits];
    next[index] = digit;
    const joined = next.join("").replace(/\s+/g, "");
    onChange(joined);
    if (digit && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (joined.length === LENGTH && !joined.includes(" ")) {
      const allFilled = next.every((d) => d !== "");
      if (allFilled) onComplete?.(next.join(""));
    }
  }

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      setDigitAt(index, "");
      return;
    }
    // Handles fast typing where more than one char lands in one box.
    const chars = cleaned.split("");
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= LENGTH) break;
      const next = [...digits];
      next[cursor] = ch;
      digits[cursor] = ch;
      cursor += 1;
    }
    const joined = digits.join("");
    onChange(joined);
    const focusIndex = Math.min(cursor, LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
    if (joined.length === LENGTH && digits.every((d) => d !== "")) {
      onComplete?.(joined);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigitAt(index - 1, "");
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
    if (pasted.length === LENGTH) onComplete?.(pasted);
  }

  return (
    <div
      className="flex justify-center gap-3"
      role="group"
      aria-label="4 digit terakhir nomor HP"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="tel"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ke-${index + 1}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={[
            "h-16 w-14 rounded-2xl border-2 bg-white text-center font-display text-3xl font-medium text-ink",
            "transition-colors duration-150 focus:outline-none",
            error
              ? "border-brick focus:border-brick"
              : "border-line focus:border-cloth",
            disabled ? "opacity-50" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
