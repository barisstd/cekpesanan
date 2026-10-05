export function ReceiptPrintHeader() {
  return (
    <div className="mb-3 hidden text-center print:block">
      <p className="font-display text-xl font-bold tracking-wide text-ink">
        JASTIP IJUN
      </p>
      <p className="text-xs text-ink/60">- Baby &amp; Kids Bookshop -</p>
      <div className="mx-auto mt-2 w-full max-w-[220px] border-t border-dashed border-ink/30" />
    </div>
  );
}
