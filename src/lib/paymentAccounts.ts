export interface BankAccount {
  bank: string;
  accountNumber: string;
}

/**
 * Destination accounts shown to customers with an outstanding balance.
 * Update this list directly if account numbers change — no other file
 * needs to change.
 */
export const PAYMENT_ACCOUNTS: BankAccount[] = [
  { bank: "Bank Mandiri", accountNumber: "1370013717422" },
  { bank: "Bank BCA", accountNumber: "4452087361" },
  { bank: "Seabank", accountNumber: "901871946280" },
  { bank: "Bank Jago", accountNumber: "101391708297" },
  { bank: "Shopeepay / Gopay", accountNumber: "085600847046" },
];

export const PAYMENT_ACCOUNT_HOLDER = "Fahmi Nur Hidayat";
