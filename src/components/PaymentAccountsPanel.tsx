import { useState } from "react";
import { PAYMENT_ACCOUNTS, PAYMENT_ACCOUNT_HOLDER } from "@/lib/paymentAccounts";

const COPIED_RESET_MS = 1800;

export function PaymentAccountsPanel() {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  async function handleCopy(bank: string, accountNumber: string) {
    try {
      await navigator.clipboard.writeText(accountNumber);
    } catch {
      // Clipboard API can be unavailable (older browsers, non-HTTPS).
      // The number is still shown on screen, so the customer can select
      // and copy it manually — fail silently rather than block them.
    }
    setCopiedBank(bank);
    window.setTimeout(() => {
      setCopiedBank((current) => (current === bank ? null : current));
    }, COPIED_RESET_MS);
  }

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-soft">
      <p className="text-[15px] font-medium text-ink">
        Silakan transfer ke rekening berikut:
      </p>

      <div className="mt-2 divide-y divide-line">
        {PAYMENT_ACCOUNTS.map((account) => {
          const isCopied = copiedBank === account.bank;
          return (
            <div
              key={account.bank}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm text-ink/60">{account.bank}</p>
                <p className="truncate font-display text-lg font-semibold tracking-wide text-ink">
                  {account.accountNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(account.bank, account.accountNumber)}
                aria-label={`Salin nomor rekening ${account.bank}`}
                className={[
                  "flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2",
                  "text-sm font-medium transition-colors duration-150 print:hidden",
                  isCopied
                    ? "border-leaf bg-leaf-light text-leaf"
                    : "border-cloth/30 text-cloth hover:bg-cloth/5 active:bg-cloth/10",
                ].join(" ")}
              >
                {isCopied ? (
                  <>
                    <CheckIcon /> Disalin
                  </>
                ) : (
                  <>
                    <CopyIcon /> Salin
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-ink/50">a.n. {PAYMENT_ACCOUNT_HOLDER}</p>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3.5 9V2.5C3.5 1.94772 3.94772 1.5 4.5 1.5H9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.2L5.5 10.2L11.5 3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
