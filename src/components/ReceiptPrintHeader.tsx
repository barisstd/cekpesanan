export function ReceiptPrintHeader() {
  return (
    <div className="mb-2 hidden text-center print:block">
      <p className="font-display text-sm font-bold tracking-wide text-ink">
        JASTIP IJUN
      </p>
      <p className="text-[9px] text-ink/60">- Baby &amp; Kids Bookshop -</p>
      <div className="mx-auto mt-1.5 w-full max-w-[140px] border-t border-dashed border-ink/30" />
    </div>
  );
}
