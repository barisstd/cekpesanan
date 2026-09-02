import { BookMark } from "@/components/BookMark";

export function BrandHeader() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <BookMark className="h-6 w-6 shrink-0" />
      <span className="font-display text-[15px] font-semibold tracking-tight text-cloth">
        Jastip Ijun
      </span>
    </div>
  );
}
