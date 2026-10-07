export function ReceiptPrintFooter() {
  return (
    <div className="mt-1 hidden text-center print:block">
      <div className="mx-auto mb-1.5 w-full max-w-[140px] border-t border-dashed border-ink/30" />
      <p className="text-[9px] text-ink/60">
        Terimakasih sudah berbelanja di Jastip Ijun
      </p>
    </div>
  );
}
